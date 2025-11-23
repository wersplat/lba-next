'use client'

import { useState, useEffect } from 'react';
import type { Match } from '@/services/matches';

type PlayerStat = {
  player_name: string;
  team_id: string;
  points: number;
  assists: number;
  rebounds: number;
  steals: number;
  blocks: number;
  turnovers: number;
  fouls: number;
  fgm: number;
  fga: number;
  three_points_made: number;
  three_points_attempted: number;
  ftm: number;
  fta: number;
  plus_minus: number | null;
  grd: string | null;
  slot_index: number | null;
};

type TeamStat = {
  team_id: string;
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  fouls: number;
  field_goals_made: number;
  field_goals_attempted: number;
  three_points_made: number;
  three_points_attempted: number;
  free_throws_made: number;
  free_throws_attempted: number;
  plus_minus: number | null;
  grd: string | null;
  teams?: { name: string };
};

type MatchModalProps = {
  match: Match | null;
  onClose: () => void;
};

export default function MatchModal({ match, onClose }: MatchModalProps) {
  const [activeTab, setActiveTab] = useState<'screenshot' | 'player-stats' | 'team-stats'>('screenshot');
  const [playerStats, setPlayerStats] = useState<PlayerStat[]>([]);
  const [teamStats, setTeamStats] = useState<TeamStat[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!match) return null;

  useEffect(() => {
    if (!match) return;
    
    setActiveTab('screenshot');
    setLoading(true);
    setError(null);
    setPlayerStats([]);
    setTeamStats([]);

    const loadStats = async () => {
      try {
        // Fetch player stats
        const playerRes = await fetch(`/api/player-stats?match_id=${match.id}`);
        
        if (playerRes.ok) {
          const playerData = await playerRes.json();
          setPlayerStats(playerData.playerStats || []);
        } else {
          const errorData = await playerRes.json().catch(() => ({ error: 'Failed to parse error' }));
          setError(errorData.error || 'Failed to load player stats');
        }

        // Fetch team stats
        const teamRes = await fetch(`/api/team-stats?match_id=${match.id}`);
        
        if (teamRes.ok) {
          const teamData = await teamRes.json();
          setTeamStats(teamData.teamStats || []);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        setError(error instanceof Error ? error.message : 'Failed to load stats');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [match]);

  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-theme-primary border border-theme rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-theme">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-theme-primary">
              {match.team1_name} vs {match.team2_name}
              <span className="ml-3 text-sm text-theme-secondary">
                {match.team1_score ?? 0}-{match.team2_score ?? 0}
              </span>
            </h2>
            <button
              onClick={onClose}
              className="text-theme-secondary hover:text-theme-primary transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-2 text-xs text-theme-secondary">
            <span>{new Date(match.match_date).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-theme">
          {match.boxscore_url && (
            <button
              onClick={() => setActiveTab('screenshot')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
                activeTab === 'screenshot'
                  ? 'border-legends-purple-500 text-legends-purple-600 dark:text-legends-purple-400'
                  : 'border-transparent text-theme-secondary hover:text-theme-primary'
              }`}
            >
              Screenshot
            </button>
          )}
          <button
            onClick={() => setActiveTab('player-stats')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
              activeTab === 'player-stats'
                ? 'border-legends-purple-500 text-legends-purple-600 dark:text-legends-purple-400'
                : 'border-transparent text-theme-secondary hover:text-theme-primary'
            }`}
          >
            Player Stats
          </button>
          <button
            onClick={() => setActiveTab('team-stats')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
              activeTab === 'team-stats'
                ? 'border-legends-purple-500 text-legends-purple-600 dark:text-legends-purple-400'
                : 'border-transparent text-theme-secondary hover:text-theme-primary'
            }`}
          >
            Team Stats
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Screenshot Tab */}
          {activeTab === 'screenshot' && match.boxscore_url && (
            <div className="flex justify-center">
              <img
                src={match.boxscore_url}
                alt="Box Score"
                className="max-w-full h-auto rounded"
              />
            </div>
          )}

          {/* Player Stats Tab */}
          {activeTab === 'player-stats' && (
            <div className="overflow-x-auto">
              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 rounded text-red-800 dark:text-red-300 text-sm">
                  {error}
                </div>
              )}
              {loading ? (
                <div className="text-center py-8 text-theme-secondary">Loading stats...</div>
              ) : playerStats.length > 0 ? (
                (() => {
                  // Sort by team1_id first, then by slot_index
                  const sortedStats = [...playerStats].sort((a, b) => {
                    // Team 1 players first
                    if (a.team_id === match.team1_id && b.team_id !== match.team1_id) return -1;
                    if (a.team_id !== match.team1_id && b.team_id === match.team1_id) return 1;
                    // Then by slot_index within each team
                    return (a.slot_index ?? 999) - (b.slot_index ?? 999);
                  });

                  return (
                    <table className="w-full text-sm">
                      <thead className="bg-theme-hover text-theme-primary">
                        <tr>
                          <th className="text-left py-2 px-4">Player</th>
                          <th className="text-center py-2 px-4">GRD</th>
                          <th className="text-right py-2 px-4">PTS</th>
                          <th className="text-right py-2 px-4">REB</th>
                          <th className="text-right py-2 px-4">AST</th>
                          <th className="text-right py-2 px-4">STL</th>
                          <th className="text-right py-2 px-4">BLK</th>
                          <th className="text-right py-2 px-4">TO</th>
                          <th className="text-right py-2 px-4">PF</th>
                          <th className="text-right py-2 px-4">FG</th>
                          <th className="text-right py-2 px-4">3PT</th>
                          <th className="text-right py-2 px-4">FT</th>
                          <th className="text-right py-2 px-4">+/-</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-theme">
                        {sortedStats.map((stat, idx) => {
                          const isTeam1 = stat.team_id === match.team1_id;
                          return (
                            <tr key={idx} className={`hover:bg-theme-hover ${isTeam1 ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                              <td className="py-2 px-4 text-theme-primary">{stat.player_name}</td>
                              <td className="text-center py-2 px-4">
                                <span className="px-2 py-0.5 rounded bg-theme-hover text-theme-primary text-xs font-bold">
                                  {stat.grd || '-'}
                                </span>
                              </td>
                              <td className="text-right py-2 px-4 font-semibold text-theme-primary">{stat.points}</td>
                              <td className="text-right py-2 px-4 text-theme-primary">{stat.rebounds}</td>
                              <td className="text-right py-2 px-4 text-theme-primary">{stat.assists}</td>
                              <td className="text-right py-2 px-4 text-theme-primary">{stat.steals}</td>
                              <td className="text-right py-2 px-4 text-theme-primary">{stat.blocks}</td>
                              <td className="text-right py-2 px-4 text-theme-primary">{stat.turnovers}</td>
                              <td className="text-right py-2 px-4 text-theme-primary">{stat.fouls}</td>
                              <td className="text-right py-2 px-4 text-theme-primary">{stat.fgm}/{stat.fga}</td>
                              <td className="text-right py-2 px-4 text-theme-primary">{stat.three_points_made}/{stat.three_points_attempted}</td>
                              <td className="text-right py-2 px-4 text-theme-primary">{stat.ftm}/{stat.fta}</td>
                              <td className={`text-right py-2 px-4 font-semibold ${
                                (stat.plus_minus ?? 0) > 0 ? 'text-green-600 dark:text-green-400' : 
                                (stat.plus_minus ?? 0) < 0 ? 'text-red-600 dark:text-red-400' : 
                                'text-theme-secondary'
                              }`}>
                                {stat.plus_minus !== null ? (stat.plus_minus > 0 ? `+${stat.plus_minus}` : stat.plus_minus) : '-'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  );
                })()
              ) : (
                <div className="text-center py-8 text-theme-secondary">
                  No player stats available for this match.
                </div>
              )}
            </div>
          )}

          {/* Team Stats Tab */}
          {activeTab === 'team-stats' && (
            <div className="overflow-x-auto">
              {loading ? (
                <div className="text-center py-8 text-theme-secondary">Loading stats...</div>
              ) : teamStats.length > 0 ? (
                <table className="w-full text-sm">
                  <thead className="bg-theme-hover text-theme-primary">
                    <tr>
                      <th className="text-left py-2 px-4">Team</th>
                      <th className="text-center py-2 px-4">GRD</th>
                      <th className="text-right py-2 px-4">PTS</th>
                      <th className="text-right py-2 px-4">REB</th>
                      <th className="text-right py-2 px-4">AST</th>
                      <th className="text-right py-2 px-4">STL</th>
                      <th className="text-right py-2 px-4">BLK</th>
                      <th className="text-right py-2 px-4">TO</th>
                      <th className="text-right py-2 px-4">PF</th>
                      <th className="text-right py-2 px-4">FG%</th>
                      <th className="text-right py-2 px-4">3PT%</th>
                      <th className="text-right py-2 px-4">FT%</th>
                      <th className="text-right py-2 px-4">+/-</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-theme">
                    {teamStats.map((stat, idx) => {
                      const fgPct = stat.field_goals_attempted > 0
                        ? ((stat.field_goals_made / stat.field_goals_attempted) * 100).toFixed(1)
                        : '-';
                      const threePct = stat.three_points_attempted > 0
                        ? ((stat.three_points_made / stat.three_points_attempted) * 100).toFixed(1)
                        : '-';
                      const ftPct = stat.free_throws_attempted > 0
                        ? ((stat.free_throws_made / stat.free_throws_attempted) * 100).toFixed(1)
                        : '0.0';

                      return (
                        <tr key={idx} className={`hover:bg-theme-hover ${idx % 2 === 0 ? 'bg-theme-primary' : 'bg-theme-hover'}`}>
                          <td className="py-2 px-4 font-semibold text-theme-primary">
                            {stat.teams?.name || 'Team'}
                          </td>
                          <td className="text-center py-2 px-4">
                            <span className="px-2 py-0.5 rounded bg-theme-hover text-theme-primary text-xs font-bold">
                              {stat.grd || '-'}
                            </span>
                          </td>
                          <td className="text-right py-2 px-4 font-semibold text-theme-primary">{stat.points}</td>
                          <td className="text-right py-2 px-4 text-theme-primary">{stat.rebounds}</td>
                          <td className="text-right py-2 px-4 text-theme-primary">{stat.assists}</td>
                          <td className="text-right py-2 px-4 text-theme-primary">{stat.steals}</td>
                          <td className="text-right py-2 px-4 text-theme-primary">{stat.blocks}</td>
                          <td className="text-right py-2 px-4 text-theme-primary">{stat.turnovers}</td>
                          <td className="text-right py-2 px-4 text-theme-primary">{stat.fouls}</td>
                          <td className="text-right py-2 px-4 text-theme-primary">{fgPct}%</td>
                          <td className="text-right py-2 px-4 text-theme-primary">{threePct}%</td>
                          <td className="text-right py-2 px-4 text-theme-primary">{ftPct}%</td>
                          <td className={`text-right py-2 px-4 font-semibold ${
                            (stat.plus_minus ?? 0) > 0 ? 'text-green-600 dark:text-green-400' : 
                            (stat.plus_minus ?? 0) < 0 ? 'text-red-600 dark:text-red-400' : 
                            'text-theme-secondary'
                          }`}>
                            {stat.plus_minus !== null ? (stat.plus_minus > 0 ? `+${stat.plus_minus}` : stat.plus_minus) : '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-8 text-theme-secondary">
                  No team stats available for this match.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

