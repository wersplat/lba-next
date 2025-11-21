'use client'

import { useQuery } from '@tanstack/react-query';
import type { GMProfile } from '@/services/gm';
import { playersApi } from '@/services/players';
import Card from '@/components/Card';
import StatChart from '@/components/player-profile/StatChart';
import Table from '@/components/Table';

interface Past2KExperienceProps {
  gm: GMProfile;
}

function calculateFGPercentage(fgm: number | null, fga: number | null): string {
  if (!fgm || !fga || fga === 0) return '0.0';
  return ((fgm / fga) * 100).toFixed(1);
}

function calculate3PPercentage(made: number | null, attempted: number | null): string {
  if (!made || !attempted || attempted === 0) return '0.0';
  return ((made / attempted) * 100).toFixed(1);
}

export default function Past2KExperience({ gm }: Past2KExperienceProps) {
  const hasTextExperience = gm.past_2k_experience_text && gm.past_2k_experience_text.trim().length > 0;
  const hasStructuredExperience = gm.experience && gm.experience.length > 0;
  const hasPlayerId = gm.player_id !== null && gm.player_id !== undefined;

  // Fetch player stats if GM has a linked player ID
  const { data: playerProfile, isLoading: isLoadingPlayer } = useQuery({
    queryKey: ['player-profile', gm.player_id],
    queryFn: () => playersApi.getPlayerProfile(gm.player_id!),
    enabled: hasPlayerId,
  });

  if (!hasTextExperience && !hasStructuredExperience && !hasPlayerId) {
    return (
      <Card>
        <h3 className="text-lg font-medium text-theme-primary mb-4">Past 2K Experience</h3>
        <div className="text-center py-8">
          <p className="text-theme-muted">No 2K experience information available</p>
        </div>
      </Card>
    );
  }

  // Prepare game log data for table if player stats are available
  const gameLogHeaders = ['Date', 'Team', 'League', 'Season', 'PTS', 'AST', 'REB', 'STL', 'BLK', 'TO', 'FG%', '3P%'];
  const gameLogRows = playerProfile?.recentGames.slice(0, 10).map((game) => {
    const date = game.created_at ? new Date(game.created_at).toLocaleDateString() : 'N/A';
    const fgPct = calculateFGPercentage(game.fgm, game.fga);
    const threePct = calculate3PPercentage(game.three_points_made, game.three_points_attempted);
    const teamName = game.team_name || 'N/A';
    const leagueName = game.league_name || 'N/A';
    const seasonNumber = game.season_number !== null && game.season_number !== undefined ? `S${game.season_number}` : 'N/A';
    
    return (
      <tr key={game.id} className="hover:bg-theme-hover">
        <td className="px-4 py-3 text-sm text-theme-primary">{date}</td>
        <td className="px-4 py-3 text-sm text-theme-secondary font-medium">{teamName}</td>
        <td className="px-4 py-3 text-sm text-theme-secondary">{leagueName}</td>
        <td className="px-4 py-3 text-sm text-theme-secondary">{seasonNumber}</td>
        <td className="px-4 py-3 text-sm text-theme-primary">{game.points || 0}</td>
        <td className="px-4 py-3 text-sm text-theme-secondary">{game.assists || 0}</td>
        <td className="px-4 py-3 text-sm text-theme-secondary">{game.rebounds || 0}</td>
        <td className="px-4 py-3 text-sm text-theme-secondary">{game.steals || 0}</td>
        <td className="px-4 py-3 text-sm text-theme-secondary">{game.blocks || 0}</td>
        <td className="px-4 py-3 text-sm text-theme-secondary">{game.turnovers || 0}</td>
        <td className="px-4 py-3 text-sm text-theme-secondary">{fgPct}%</td>
        <td className="px-4 py-3 text-sm text-theme-secondary">{threePct}%</td>
      </tr>
    );
  }) || [];

  // Prepare chart data for points per game
  const pointsChartData = playerProfile?.recentGames.slice(0, 10).reverse().map((game, index) => ({
    game: `Game ${index + 1}`,
    points: game.points || 0,
  })) || [];

  return (
    <div className="space-y-6">
      {/* Text Experience */}
      {hasTextExperience && (
        <Card>
          <h3 className="text-lg font-medium text-theme-primary mb-4">Experience Overview</h3>
          <div className="prose prose-sm max-w-none text-theme-secondary">
            <p className="whitespace-pre-line">{gm.past_2k_experience_text}</p>
          </div>
        </Card>
      )}

      {/* Structured Experience */}
      {hasStructuredExperience && (
        <Card>
          <h3 className="text-lg font-medium text-theme-primary mb-4">Career History</h3>
          <div className="space-y-4">
            {gm.experience.map((exp) => (
              <div
                key={exp.id}
                className="p-4 bg-theme-tertiary rounded-lg border border-theme-border"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2">
                  <div>
                    <h4 className="text-base font-semibold text-theme-primary mb-1">
                      {exp.league_name}
                    </h4>
                    {exp.team_name && (
                      <p className="text-sm text-theme-secondary mb-1">
                        {exp.team_name}
                        {exp.role && ` • ${exp.role}`}
                      </p>
                    )}
                    {exp.season && (
                      <p className="text-xs text-theme-muted mb-1">Season: {exp.season}</p>
                    )}
                  </div>
                  {(exp.start_date || exp.end_date) && (
                    <div className="text-xs text-theme-muted mt-2 sm:mt-0">
                      {exp.start_date && (
                        <div>
                          Start: {new Date(exp.start_date).toLocaleDateString()}
                        </div>
                      )}
                      {exp.end_date && (
                        <div>
                          End: {new Date(exp.end_date).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {exp.achievements && (
                  <div className="mt-3 pt-3 border-t border-theme-border">
                    <p className="text-sm text-theme-secondary">{exp.achievements}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Player Stats Section */}
      {hasPlayerId && (
        <>
          {isLoadingPlayer ? (
            <Card>
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-legends-purple-500"></div>
              </div>
            </Card>
          ) : playerProfile ? (
            <>
              {/* Current Team and Performance Score */}
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-theme-primary mb-2">Player Stats</h3>
                    {playerProfile.currentTeamName ? (
                      <p className="text-theme-secondary">
                        Playing for <span className="font-semibold">{playerProfile.currentTeamName}</span>
                        {playerProfile.position && ` • ${playerProfile.position}`}
                      </p>
                    ) : (
                      <p className="text-theme-secondary">Free Agent</p>
                    )}
                    {playerProfile.recentGames.length > 0 && (
                      <p className="text-xs text-theme-muted mt-1">
                        Stats from {playerProfile.recentGames[0]?.league_name || 'various leagues'} 
                        {playerProfile.recentGames[0]?.season_number !== null && playerProfile.recentGames[0]?.season_number !== undefined 
                          ? ` Season ${playerProfile.recentGames[0].season_number}` 
                          : ''}
                      </p>
                    )}
                  </div>
                  {playerProfile.performance_score && (
                    <div className="text-right">
                      <span className="text-sm text-theme-muted">Performance Score</span>
                      <p className="text-3xl font-bold text-legends-purple-600 dark:text-legends-purple-400">
                        {Math.round(playerProfile.performance_score)}
                      </p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Season Averages */}
              <Card>
                <h3 className="text-lg font-medium text-theme-primary mb-4">Season Averages</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                  {playerProfile.ppg !== null && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-theme-primary">{playerProfile.ppg.toFixed(1)}</div>
                      <div className="text-xs text-theme-muted">PPG</div>
                    </div>
                  )}
                  {playerProfile.apg !== null && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-theme-primary">{playerProfile.apg.toFixed(1)}</div>
                      <div className="text-xs text-theme-muted">APG</div>
                    </div>
                  )}
                  {playerProfile.rpg !== null && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-theme-primary">{playerProfile.rpg.toFixed(1)}</div>
                      <div className="text-xs text-theme-muted">RPG</div>
                    </div>
                  )}
                  {playerProfile.spg !== null && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-theme-primary">{playerProfile.spg.toFixed(1)}</div>
                      <div className="text-xs text-theme-muted">SPG</div>
                    </div>
                  )}
                  {playerProfile.bpg !== null && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-theme-primary">{playerProfile.bpg.toFixed(1)}</div>
                      <div className="text-xs text-theme-muted">BPG</div>
                    </div>
                  )}
                  {playerProfile.games_played !== null && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-theme-primary">{playerProfile.games_played}</div>
                      <div className="text-xs text-theme-muted">Games</div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Performance Charts */}
              {pointsChartData.length > 0 && (
                <Card>
                  <StatChart
                    data={pointsChartData}
                    type="line"
                    dataKey="points"
                    xAxisKey="game"
                    title="Points Per Game (Last 10 Games)"
                    color="#7A60A8"
                  />
                </Card>
              )}

              {/* Game Log */}
              {gameLogRows.length > 0 && (
                <Card>
                  <h3 className="text-lg font-medium text-theme-primary mb-4">Recent Games</h3>
                  <div className="overflow-x-auto">
                    <Table headers={gameLogHeaders}>
                      {gameLogRows}
                    </Table>
                  </div>
                </Card>
              )}
            </>
          ) : null}
        </>
      )}
    </div>
  );
}

