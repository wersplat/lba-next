'use client'

import type { PlayerProfile } from '@/services/players';
import StatChart from './StatChart';
import Card from '@/components/Card';
import Table from '@/components/Table';
import Tooltip from '@/components/Tooltip';

interface DraftCombineOverviewProps {
  player: PlayerProfile;
}

function calculateFGPercentage(fgm: number | null, fga: number | null): string {
  if (!fgm || !fga || fga === 0) return '0.0';
  return ((fgm / fga) * 100).toFixed(1);
}

function calculate3PPercentage(made: number | null, attempted: number | null): string {
  if (!made || !attempted || attempted === 0) return '0.0';
  return ((made / attempted) * 100).toFixed(1);
}

function calculateFTPercentage(ftm: number | null, fta: number | null): string {
  if (!ftm || !fta || fta === 0) return '0.0';
  return ((ftm / fta) * 100).toFixed(1);
}

export default function DraftCombineOverview({ player }: DraftCombineOverviewProps) {
  const combineStats = player.combineStats;
  const leagueStats = player.leagueStats;
  const latestDraft = player.draftPicks.length > 0 ? player.draftPicks[0] : null;
  const draftPoolStatus = player.draftPoolStatus;
  
  // Prepare combine game log
  const combineGameLogHeaders = ['Date', 'Position', 'PTS', 'AST', 'REB', 'STL', 'BLK', 'TO', 'FG%', '3P%', 'FT%'];
  const combineGameLogRows = combineStats.recentGames.slice(0, 10).map((game) => {
    const date = game.created_at ? new Date(game.created_at).toLocaleDateString() : 'N/A';
    const fgPct = calculateFGPercentage(game.fgm, game.fga);
    const threePct = calculate3PPercentage(game.three_points_made, game.three_points_attempted);
    const ftPct = calculateFTPercentage(game.ftm, game.fta);
    
    return (
      <tr key={game.id} className="hover:bg-theme-hover">
        <td className="px-4 py-3 text-sm text-theme-primary">{date}</td>
        <td className="px-4 py-3 text-sm text-theme-secondary font-medium">{game.position || '-'}</td>
        <td className="px-4 py-3 text-sm text-theme-primary">{game.points || 0}</td>
        <td className="px-4 py-3 text-sm text-theme-secondary">{game.assists || 0}</td>
        <td className="px-4 py-3 text-sm text-theme-secondary">{game.rebounds || 0}</td>
        <td className="px-4 py-3 text-sm text-theme-secondary">{game.steals || 0}</td>
        <td className="px-4 py-3 text-sm text-theme-secondary">{game.blocks || 0}</td>
        <td className="px-4 py-3 text-sm text-theme-secondary">{game.turnovers || 0}</td>
        <td className="px-4 py-3 text-sm text-theme-secondary">{fgPct}%</td>
        <td className="px-4 py-3 text-sm text-theme-secondary">{threePct}%</td>
        <td className="px-4 py-3 text-sm text-theme-secondary">{ftPct}%</td>
      </tr>
    );
  });
  
  // Prepare combine rating trend from combine games
  const combineRatingTrend = combineStats.recentGames.slice(0, 10).reverse().map((game, index) => ({
    week: `Game ${index + 1}`,
    rating: game.points || 0,
  }));
  
  return (
    <div className="space-y-6">
      {/* Draft Pool Status */}
      {draftPoolStatus && (
        <Card>
          <h3 className="text-lg font-medium text-theme-primary mb-4">Draft Pool Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-theme-muted">Status</span>
              <div className="mt-1">
                {draftPoolStatus.is_eligible ? (
                  // Show eligibility badge (same as draft board)
                  <Tooltip
                    content={
                      draftPoolStatus.eligibility_reason === 'status'
                        ? 'Player is eligible for the draft because they are marked as eligible in the draft pool.'
                        : draftPoolStatus.eligibility_reason === 'combine_games'
                        ? `Player is eligible for the draft because they have played ${draftPoolStatus.combine_games} combine games (5+ required).`
                        : 'Player is eligible for the draft because they are marked as eligible AND have 5+ combine games played.'
                    }
                  >
                    <span className={`px-2 py-1 rounded-full text-xs font-medium cursor-help ${
                      draftPoolStatus.eligibility_reason === 'status' || draftPoolStatus.eligibility_reason === 'both'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}>
                      {draftPoolStatus.eligibility_reason === 'status' 
                        ? 'Eligible (Status)'
                        : draftPoolStatus.eligibility_reason === 'combine_games'
                        ? 'Eligible (5+ Games)'
                        : 'Eligible (Both)'}
                    </span>
                  </Tooltip>
                ) : (
                  // Show status badge (same as draft pool)
                  <Tooltip
                    content={
                      draftPoolStatus.combine_games > 0
                        ? `Player is available in the draft pool. They have played ${draftPoolStatus.combine_games} combine game${draftPoolStatus.combine_games !== 1 ? 's' : ''} but need 5+ games or eligible status to be draft eligible.`
                        : 'Player is available in the draft pool. They need 5+ combine games or eligible status to be draft eligible.'
                    }
                  >
                    <span className={`px-2 py-1 rounded-full text-xs font-medium cursor-help ${
                      !draftPoolStatus.status || draftPoolStatus.status.toLowerCase() === 'available'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                    }`}>
                      {draftPoolStatus.status || 'Available'}
                    </span>
                  </Tooltip>
                )}
              </div>
            </div>
            <div>
              <span className="text-sm font-medium text-theme-muted">Combine Games</span>
              <p className="text-2xl font-bold text-theme-primary">{draftPoolStatus.combine_games}</p>
            </div>
          </div>
        </Card>
      )}
      
      {/* Draft Details */}
      {latestDraft && (
        <Card>
          <h3 className="text-lg font-medium text-theme-primary mb-4">Draft Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-theme-muted">Pick Number</span>
              <p className="text-2xl font-bold text-theme-primary">#{latestDraft.pick_number}</p>
            </div>
            {latestDraft.team_name && (
              <div>
                <span className="text-sm font-medium text-theme-muted">Drafted By</span>
                <p className="text-lg font-semibold text-theme-primary">{latestDraft.team_name}</p>
              </div>
            )}
            {player.salary_tier && (
              <div>
                <span className="text-sm font-medium text-theme-muted">Contract Type</span>
                <p className="text-lg font-semibold text-theme-primary capitalize">{player.salary_tier}</p>
              </div>
            )}
          </div>
        </Card>
      )}
      
      {/* League Stats */}
      {leagueStats.games_played > 0 && (
        <Card>
          <h3 className="text-lg font-medium text-theme-primary mb-4">League Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {leagueStats.ppg !== null && (
              <div className="text-center">
                <div className="text-2xl font-bold text-legends-purple-600 dark:text-legends-purple-400">
                  {leagueStats.ppg.toFixed(1)}
                </div>
                <div className="text-sm text-theme-muted">PPG</div>
              </div>
            )}
            {leagueStats.apg !== null && (
              <div className="text-center">
                <div className="text-2xl font-bold text-legends-purple-600 dark:text-legends-purple-400">
                  {leagueStats.apg.toFixed(1)}
                </div>
                <div className="text-sm text-theme-muted">APG</div>
              </div>
            )}
            {leagueStats.rpg !== null && (
              <div className="text-center">
                <div className="text-2xl font-bold text-legends-purple-600 dark:text-legends-purple-400">
                  {leagueStats.rpg.toFixed(1)}
                </div>
                <div className="text-sm text-theme-muted">RPG</div>
              </div>
            )}
            {leagueStats.spg !== null && (
              <div className="text-center">
                <div className="text-2xl font-bold text-legends-purple-600 dark:text-legends-purple-400">
                  {leagueStats.spg.toFixed(1)}
                </div>
                <div className="text-sm text-theme-muted">SPG</div>
              </div>
            )}
            <div className="text-center">
              <div className="text-2xl font-bold text-legends-purple-600 dark:text-legends-purple-400">
                {leagueStats.games_played}
              </div>
              <div className="text-sm text-theme-muted">Games</div>
            </div>
          </div>
        </Card>
      )}
      
      {/* Combine Results */}
      {combineStats.games_played > 0 ? (
        <Card>
          <h3 className="text-lg font-medium text-theme-primary mb-4">Combine Results</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            {combineStats.ppg !== null && (
              <div className="text-center">
                <div className="text-2xl font-bold text-legends-purple-600 dark:text-legends-purple-400">
                  {combineStats.ppg.toFixed(1)}
                </div>
                <div className="text-sm text-theme-muted">PPG</div>
              </div>
            )}
            {combineStats.apg !== null && (
              <div className="text-center">
                <div className="text-2xl font-bold text-legends-purple-600 dark:text-legends-purple-400">
                  {combineStats.apg.toFixed(1)}
                </div>
                <div className="text-sm text-theme-muted">APG</div>
              </div>
            )}
            {combineStats.rpg !== null && (
              <div className="text-center">
                <div className="text-2xl font-bold text-legends-purple-600 dark:text-legends-purple-400">
                  {combineStats.rpg.toFixed(1)}
                </div>
                <div className="text-sm text-theme-muted">RPG</div>
              </div>
            )}
            {combineStats.fg_percentage !== null && (
              <div className="text-center">
                <div className="text-2xl font-bold text-legends-purple-600 dark:text-legends-purple-400">
                  {combineStats.fg_percentage.toFixed(1)}%
                </div>
                <div className="text-sm text-theme-muted">FG%</div>
              </div>
            )}
            {combineStats.three_point_percentage !== null && (
              <div className="text-center">
                <div className="text-2xl font-bold text-legends-purple-600 dark:text-legends-purple-400">
                  {combineStats.three_point_percentage.toFixed(1)}%
                </div>
                <div className="text-sm text-theme-muted">3P%</div>
              </div>
            )}
          </div>
          
          {/* Position Summary */}
          {combineStats.positionSummary && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-theme-muted mb-2">Positions Played</h4>
              <div className="flex flex-wrap gap-3">
                {combineStats.positionSummary.PG > 0 && (
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-sm font-medium">
                    PG: {combineStats.positionSummary.PG}
                  </span>
                )}
                {combineStats.positionSummary.SG > 0 && (
                  <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-sm font-medium">
                    SG: {combineStats.positionSummary.SG}
                  </span>
                )}
                {combineStats.positionSummary.Lock > 0 && (
                  <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 text-sm font-medium">
                    Lock: {combineStats.positionSummary.Lock}
                  </span>
                )}
                {combineStats.positionSummary.PF > 0 && (
                  <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 text-sm font-medium">
                    PF: {combineStats.positionSummary.PF}
                  </span>
                )}
                {combineStats.positionSummary.C > 0 && (
                  <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-sm font-medium">
                    C: {combineStats.positionSummary.C}
                  </span>
                )}
              </div>
            </div>
          )}
          
          {/* Combine Rating Trend */}
          {combineRatingTrend.length > 0 && (
            <div className="mt-6">
              <StatChart
                data={combineRatingTrend}
                type="line"
                dataKey="rating"
                xAxisKey="week"
                title="Combine Points Per Game"
                color="#7A60A8"
              />
            </div>
          )}
          
          {/* Combine Game Log */}
          {combineGameLogRows.length > 0 && (
            <div className="mt-6">
              <h4 className="text-md font-medium text-theme-primary mb-3">Combine Games</h4>
              <div className="overflow-x-auto">
                <Table headers={combineGameLogHeaders}>
                  {combineGameLogRows}
                </Table>
              </div>
            </div>
          )}
        </Card>
      ) : (
        <Card>
          <h3 className="text-lg font-medium text-theme-primary mb-4">Combine Results</h3>
          <p className="text-theme-muted text-center py-8">No combine statistics available</p>
        </Card>
      )}
      
      {/* Scouting Summary */}
      <Card>
        <h3 className="text-lg font-medium text-theme-primary mb-4">Scouting Summary</h3>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2">Strengths</h4>
            <ul className="list-disc list-inside text-sm text-theme-secondary space-y-1">
              <li>Strong scoring ability with consistent shooting form</li>
              <li>Good court vision and passing skills</li>
              <li>Solid defensive awareness and positioning</li>
              <li>High basketball IQ and decision-making</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-2">Areas for Improvement</h4>
            <ul className="list-disc list-inside text-sm text-theme-secondary space-y-1">
              <li>Can improve three-point shooting consistency</li>
              <li>Needs to work on reducing turnovers</li>
              <li>Could enhance rebounding presence</li>
            </ul>
          </div>
          <div className="mt-4 p-3 bg-theme-tertiary rounded-lg">
            <p className="text-sm italic text-theme-secondary">
              "A versatile player with strong fundamentals and good potential for growth. Shows promise in multiple areas of the game."
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

