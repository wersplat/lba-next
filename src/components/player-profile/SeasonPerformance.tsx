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
  // Prepare game log data for table
  const gameLogHeaders = ['Date', 'PTS', 'AST', 'REB', 'STL', 'BLK', 'TO', 'FG%', '3P%'];
  const gameLogRows = player.recentGames.slice(0, 10).map((game) => {
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
  
  // Prepare chart data for points per game
  const pointsChartData = player.recentGames.slice(0, 10).reverse().map((game, index) => ({
    game: `Game ${index + 1}`,
    points: game.points || 0,
  }));
  
  // Prepare chart data for all stats
  const statsChartData = player.recentGames.slice(0, 10).reverse().map((game, index) => ({
    game: `Game ${index + 1}`,
    points: game.points || 0,
    assists: game.assists || 0,
    rebounds: game.rebounds || 0,
  }));
  
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
      
      {/* Season Averages */}
      <Card>
        <h3 className="text-lg font-medium text-theme-primary mb-4">Season Averages</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {player.ppg !== null && (
            <div className="text-center">
              <div className="text-2xl font-bold text-theme-primary">{player.ppg.toFixed(1)}</div>
              <div className="text-xs text-theme-muted">PPG</div>
            </div>
          )}
          {player.apg !== null && (
            <div className="text-center">
              <div className="text-2xl font-bold text-theme-primary">{player.apg.toFixed(1)}</div>
              <div className="text-xs text-theme-muted">APG</div>
            </div>
          )}
          {player.rpg !== null && (
            <div className="text-center">
              <div className="text-2xl font-bold text-theme-primary">{player.rpg.toFixed(1)}</div>
              <div className="text-xs text-theme-muted">RPG</div>
            </div>
          )}
          {player.spg !== null && (
            <div className="text-center">
              <div className="text-2xl font-bold text-theme-primary">{player.spg.toFixed(1)}</div>
              <div className="text-xs text-theme-muted">SPG</div>
            </div>
          )}
          {player.bpg !== null && (
            <div className="text-center">
              <div className="text-2xl font-bold text-theme-primary">{player.bpg.toFixed(1)}</div>
              <div className="text-xs text-theme-muted">BPG</div>
            </div>
          )}
          {player.games_played !== null && (
            <div className="text-center">
              <div className="text-2xl font-bold text-theme-primary">{player.games_played}</div>
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
      
      {/* Game Log */}
      <Card>
        <h3 className="text-lg font-medium text-theme-primary mb-4">Recent Games</h3>
        {gameLogRows.length > 0 ? (
          <div className="overflow-x-auto">
            <Table headers={gameLogHeaders}>
              {gameLogRows}
            </Table>
          </div>
        ) : (
          <p className="text-theme-muted text-center py-8">No game data available</p>
        )}
      </Card>
    </div>
  );
}

