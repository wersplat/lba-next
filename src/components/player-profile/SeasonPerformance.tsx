'use client'

import type { PlayerProfile } from '@/services/players';
import Card from '@/components/Card';
import StatChart from './StatChart';
import Table from '@/components/Table';

interface SeasonPerformanceProps {
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

export default function SeasonPerformance({ player }: SeasonPerformanceProps) {
  // Use league stats for main section
  const leagueGames = player.leagueStats.recentGames;
  const leagueAverages = player.leagueStats;
  
  // Prepare game log data for table (league games)
  const gameLogHeaders = ['Date', 'PTS', 'AST', 'REB', 'STL', 'BLK', 'TO', 'FG%', '3P%'];
  const gameLogRows = leagueGames.slice(0, 10).map((game) => {
    const date = game.created_at ? new Date(game.created_at).toLocaleDateString() : 'N/A';
    const fgPct = calculateFGPercentage(game.fgm, game.fga);
    const threePct = calculate3PPercentage(game.three_points_made, game.three_points_attempted);
    
    return (
      <tr key={game.id} className="hover:bg-theme-hover">
        <td className="px-4 py-3 text-sm text-theme-primary">{date}</td>
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
  });
  
  // Prepare chart data for points per game (league games)
  const pointsChartData = leagueGames.slice(0, 10).reverse().map((game, index) => ({
    game: `Game ${index + 1}`,
    points: game.points || 0,
  }));
  
  // Prepare chart data for all stats (league games)
  const statsChartData = leagueGames.slice(0, 10).reverse().map((game, index) => ({
    game: `Game ${index + 1}`,
    points: game.points || 0,
    assists: game.assists || 0,
    rebounds: game.rebounds || 0,
  }));
  
  // Outside league stats
  const outsideLeagueGames = player.outsideLeagueStats.recentGames;
  const outsideLeagueAverages = player.outsideLeagueStats;
  
  // Combine stats
  const combineGames = player.combineStats.recentGames;
  const combineAverages = player.combineStats;
  
  // Prepare outside league game log with league names
  const outsideLeagueGameLogHeaders = ['Date', 'League', 'PTS', 'AST', 'REB', 'STL', 'BLK', 'TO', 'FG%', '3P%'];
  const outsideLeagueGameLogRows = outsideLeagueGames.slice(0, 10).map((game) => {
    const date = game.created_at ? new Date(game.created_at).toLocaleDateString() : 'N/A';
    const fgPct = calculateFGPercentage(game.fgm, game.fga);
    const threePct = calculate3PPercentage(game.three_points_made, game.three_points_attempted);
    const leagueLabel = game.league_name || 'Unknown League';
    const stageLabel = game.stage ? ` (${game.stage})` : '';
    
    return (
      <tr key={game.id} className="hover:bg-theme-hover">
        <td className="px-4 py-3 text-sm text-theme-primary">{date}</td>
        <td className="px-4 py-3 text-sm text-theme-secondary">{leagueLabel}{stageLabel}</td>
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
  });
  
  // Prepare combine game log
  const combineGameLogHeaders = ['Date', 'Position', 'PTS', 'AST', 'REB', 'STL', 'BLK', 'TO', 'FG%', '3P%', 'FT%'];
  const combineGameLogRows = combineGames.slice(0, 10).map((game) => {
    const date = game.created_at ? new Date(game.created_at).toLocaleDateString() : 'N/A';
    const fgPct = calculateFGPercentage(game.fgm, game.fga);
    const threePct = calculate3PPercentage(game.three_points_made, game.three_points_attempted);
    const ftPct = calculateFGPercentage(game.ftm, game.fta);
    
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
  
  return (
    <div className="space-y-6">
      {/* Current Team and League */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-theme-primary mb-2">Current Status</h3>
            {player.currentTeamName ? (
              <p className="text-theme-secondary">
                Playing for <span className="font-semibold">{player.currentTeamName}</span>
              </p>
            ) : (
              <p className="text-theme-secondary">Free Agent</p>
            )}
          </div>
          {player.performance_score && (
            <div className="text-right">
              <span className="text-sm text-theme-muted">Performance Score</span>
              <p className="text-3xl font-bold text-legends-purple-600 dark:text-legends-purple-400">
                {Math.round(player.performance_score)}
              </p>
            </div>
          )}
        </div>
      </Card>
      
      {/* Season Averages (League Stats) */}
      <Card>
        <h3 className="text-lg font-medium text-theme-primary mb-4">Season Averages</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {leagueAverages.ppg !== null && (
            <div className="text-center">
              <div className="text-2xl font-bold text-theme-primary">{leagueAverages.ppg.toFixed(1)}</div>
              <div className="text-xs text-theme-muted">PPG</div>
            </div>
          )}
          {leagueAverages.apg !== null && (
            <div className="text-center">
              <div className="text-2xl font-bold text-theme-primary">{leagueAverages.apg.toFixed(1)}</div>
              <div className="text-xs text-theme-muted">APG</div>
            </div>
          )}
          {leagueAverages.rpg !== null && (
            <div className="text-center">
              <div className="text-2xl font-bold text-theme-primary">{leagueAverages.rpg.toFixed(1)}</div>
              <div className="text-xs text-theme-muted">RPG</div>
            </div>
          )}
          {leagueAverages.spg !== null && (
            <div className="text-center">
              <div className="text-2xl font-bold text-theme-primary">{leagueAverages.spg.toFixed(1)}</div>
              <div className="text-xs text-theme-muted">SPG</div>
            </div>
          )}
          {leagueAverages.bpg !== null && (
            <div className="text-center">
              <div className="text-2xl font-bold text-theme-primary">{leagueAverages.bpg.toFixed(1)}</div>
              <div className="text-xs text-theme-muted">BPG</div>
            </div>
          )}
          {leagueAverages.games_played > 0 && (
            <div className="text-center">
              <div className="text-2xl font-bold text-theme-primary">{leagueAverages.games_played}</div>
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
      
      {statsChartData.length > 0 && (
        <Card>
          <StatChart
            data={statsChartData}
            type="bar"
            dataKey="points"
            xAxisKey="game"
            title="Recent Game Performance"
            color="#7A60A8"
          />
        </Card>
      )}
      
      {/* Game Log (League Games) */}
      <Card>
        <h3 className="text-lg font-medium text-theme-primary mb-4">Recent Games</h3>
        {gameLogRows.length > 0 ? (
          <div className="overflow-x-auto">
            <Table headers={gameLogHeaders}>
              {gameLogRows}
            </Table>
          </div>
        ) : (
          <p className="text-theme-muted text-center py-8">No league game data available</p>
        )}
      </Card>
      
      {/* Combine Games Section */}
      {combineAverages.games_played > 0 && (
        <>
          <Card>
            <h3 className="text-lg font-medium text-theme-primary mb-4">Combine Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {combineAverages.ppg !== null && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-theme-primary">{combineAverages.ppg.toFixed(1)}</div>
                  <div className="text-xs text-theme-muted">PPG</div>
                </div>
              )}
              {combineAverages.apg !== null && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-theme-primary">{combineAverages.apg.toFixed(1)}</div>
                  <div className="text-xs text-theme-muted">APG</div>
                </div>
              )}
              {combineAverages.rpg !== null && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-theme-primary">{combineAverages.rpg.toFixed(1)}</div>
                  <div className="text-xs text-theme-muted">RPG</div>
                </div>
              )}
              {combineAverages.spg !== null && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-theme-primary">{combineAverages.spg.toFixed(1)}</div>
                  <div className="text-xs text-theme-muted">SPG</div>
                </div>
              )}
              {combineAverages.bpg !== null && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-theme-primary">{combineAverages.bpg.toFixed(1)}</div>
                  <div className="text-xs text-theme-muted">BPG</div>
                </div>
              )}
              {combineAverages.fg_percentage !== null && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-theme-primary">{combineAverages.fg_percentage.toFixed(1)}%</div>
                  <div className="text-xs text-theme-muted">FG%</div>
                </div>
              )}
              {combineAverages.three_point_percentage !== null && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-theme-primary">{combineAverages.three_point_percentage.toFixed(1)}%</div>
                  <div className="text-xs text-theme-muted">3P%</div>
                </div>
              )}
              <div className="text-center">
                <div className="text-2xl font-bold text-theme-primary">{combineAverages.games_played}</div>
                <div className="text-xs text-theme-muted">Games</div>
              </div>
            </div>
          </Card>
          
          <Card>
            <h3 className="text-lg font-medium text-theme-primary mb-4">Combine Games</h3>
            {combineGameLogRows.length > 0 ? (
              <div className="overflow-x-auto">
                <Table headers={combineGameLogHeaders}>
                  {combineGameLogRows}
                </Table>
              </div>
            ) : (
              <p className="text-theme-muted text-center py-8">No combine game data available</p>
            )}
          </Card>
        </>
      )}
      
      {/* Outside League Stats Section */}
      {outsideLeagueAverages.games_played > 0 && (
        <>
          <Card>
            <h3 className="text-lg font-medium text-theme-primary mb-4">Outside League Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {outsideLeagueAverages.ppg !== null && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-theme-primary">{outsideLeagueAverages.ppg.toFixed(1)}</div>
                  <div className="text-xs text-theme-muted">PPG</div>
                </div>
              )}
              {outsideLeagueAverages.apg !== null && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-theme-primary">{outsideLeagueAverages.apg.toFixed(1)}</div>
                  <div className="text-xs text-theme-muted">APG</div>
                </div>
              )}
              {outsideLeagueAverages.rpg !== null && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-theme-primary">{outsideLeagueAverages.rpg.toFixed(1)}</div>
                  <div className="text-xs text-theme-muted">RPG</div>
                </div>
              )}
              {outsideLeagueAverages.spg !== null && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-theme-primary">{outsideLeagueAverages.spg.toFixed(1)}</div>
                  <div className="text-xs text-theme-muted">SPG</div>
                </div>
              )}
              {outsideLeagueAverages.bpg !== null && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-theme-primary">{outsideLeagueAverages.bpg.toFixed(1)}</div>
                  <div className="text-xs text-theme-muted">BPG</div>
                </div>
              )}
              <div className="text-center">
                <div className="text-2xl font-bold text-theme-primary">{outsideLeagueAverages.games_played}</div>
                <div className="text-xs text-theme-muted">Games</div>
              </div>
            </div>
          </Card>
          
          <Card>
            <h3 className="text-lg font-medium text-theme-primary mb-4">Outside League Games</h3>
            {outsideLeagueGameLogRows.length > 0 ? (
              <div className="overflow-x-auto">
                <Table headers={outsideLeagueGameLogHeaders}>
                  {outsideLeagueGameLogRows}
                </Table>
              </div>
            ) : (
              <p className="text-theme-muted text-center py-8">No outside league game data available</p>
            )}
          </Card>
        </>
      )}
    </div>
  );
}

