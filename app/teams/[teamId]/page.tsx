'use client'

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useDraft } from '@/context/DraftContext/useDraft';
import { teamsApi } from '@/services/teams';
import { gmApi } from '@/services/gm';
import type { Player } from '@/services/players';
import type { DraftPick } from '@/services/draftPicks';

export default function TeamPage() {
  const params = useParams();
  const teamId = params?.teamId as string;
  const { teams, draftPicks, players } = useDraft();

  // Fetch team details to get lba_teams_id for GM lookup
  const { data: teamDetails } = useQuery({
    queryKey: ['team-details', teamId],
    queryFn: () => teamsApi.getById(teamId),
    enabled: !!teamId,
  });

  // Fetch GM for this team - use lba_teams_id if available, otherwise fallback to teamId
  const { data: gm } = useQuery({
    queryKey: ['gm-by-team', teamDetails?.lba_teams_id || teamId],
    queryFn: () => gmApi.getByTeamId(teamDetails?.lba_teams_id || teamId),
    enabled: !!(teamDetails?.lba_teams_id || teamId),
  });

  // Find the current team
  const team = teams.find((t: { id: string | undefined }) => t.id === teamId);
  
  // Filter picks for this team
  const teamPicks = draftPicks
    .filter((pick): pick is DraftPick & { player_id: string } => 
      pick.team_id === teamId && pick.player_id !== null
    )
    .sort((a, b) => a.pick_number - b.pick_number);

  // Get player details for each pick
  const picksWithPlayers = teamPicks.map(pick => {
    const player = players.find((p: Player) => p.id === pick.player_id);
    return {
      ...pick,
      player
    };
  });

  // Calculate team statistics
  const totalPicks = teamPicks.length;
  const positions = picksWithPlayers.reduce<Record<string, number>>((acc, pick) => {
    if (!pick.player) return acc;
    const position = pick.player.position;
    acc[position] = (acc[position] || 0) + 1;
    return acc;
  }, {});

  if (!team) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-theme-primary">Team not found</h3>
        <p className="mt-2 text-sm text-theme-secondary">The requested team could not be found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Team Header */}
      <div className="bg-theme-primary border border-theme shadow rounded-lg overflow-hidden">
        <div className="px-6 py-8 sm:px-8">
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0">
              {team?.logo ? (
                <img 
                  className="h-24 w-24 rounded-full" 
                  src={team.logo} 
                  alt={`${team?.name || 'Team'} logo`} 
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-theme-hover flex items-center justify-center text-4xl font-bold text-theme-secondary">
                  {team?.name?.charAt(0) || '?'}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-theme-primary">{team.name}</h1>
              {gm && (
                <div className="mt-2">
                  <Link 
                    href={`/gm/${gm.id}`}
                    className="inline-flex items-center text-sm font-medium text-legends-purple-600 hover:text-legends-purple-800 dark:text-legends-purple-400 dark:hover:text-legends-purple-300 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    General Manager: {gm.player?.gamertag || gm.discord_username || 'View Profile'}
                  </Link>
                </div>
              )}
              <div className="mt-2 flex flex-wrap gap-4">
                <div>
                  <span className="text-sm font-medium text-theme-secondary">Total Picks</span>
                  <p className="text-2xl font-semibold text-theme-primary">{totalPicks}</p>
                </div>
                {Object.entries(positions).map(([position, count]) => (
                  <div key={position}>
                    <span className="text-sm font-medium text-theme-secondary">{position}s</span>
                    <p className="text-2xl font-semibold text-theme-primary">{String(count)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Picks */}
      <div className="bg-theme-primary border border-theme shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-theme">
          <h3 className="text-lg font-medium text-theme-primary">Draft Picks</h3>
        </div>
        
        {picksWithPlayers.length === 0 ? (
          <div className="p-6 text-center text-theme-secondary">
            No picks made yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-theme">
              <thead className="bg-theme-hover">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-theme-secondary uppercase tracking-wider">
                    Pick
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-theme-secondary uppercase tracking-wider">
                    Player
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-theme-secondary uppercase tracking-wider">
                    Position
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-theme-secondary uppercase tracking-wider">
                    Team
                  </th>
                </tr>
              </thead>
              <tbody className="bg-theme-primary divide-y divide-theme">
                {picksWithPlayers.map((pick) => {
                  const player = pick.player as Player | undefined;
                  return (
                    <tr key={pick.id} className="hover:bg-theme-hover">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-theme-primary">
                        {pick.pick_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-theme-primary">
                        {player?.name || 'Unknown Player'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-theme-secondary">
                        {player?.position || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-theme-secondary">
                        {player?.team || 'N/A'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Team Needs Analysis */}
      <div className="bg-theme-primary border border-theme shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-theme">
          <h3 className="text-lg font-medium text-theme-primary">Team Needs</h3>
        </div>
        <div className="p-6">
          {Object.keys(positions).length === 0 ? (
            <p className="text-sm text-theme-secondary">No position data available yet.</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(positions).map(([position, count]) => (
                <div key={position}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-theme-primary">{position}</span>
                    <span className="text-theme-secondary">{count} players</span>
                  </div>
                  <div className="w-full bg-theme-hover rounded-full h-2.5">
                    <div 
                      className="bg-legends-purple-600 dark:bg-legends-purple-400 h-2.5 rounded-full" 
                      style={{ width: `${Math.min(100, (count / 5) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

