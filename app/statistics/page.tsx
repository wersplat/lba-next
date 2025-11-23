'use client'

import { useQuery } from '@tanstack/react-query';
import { statisticsApi } from '@/services/statistics';
import Card from '@/components/Card';
import { useState } from 'react';
import PlayerLink from '@/components/PlayerLink';

type SortField = 'player' | 'games_played' | 'ppg' | 'apg' | 'rpg' | 'spg' | 'bpg' | 'tpg' | 'fg_percentage' | 'three_point_percentage' | 'ft_percentage';
type SortDirection = 'asc' | 'desc';

export default function StatisticsPage() {
  const [sortField, setSortField] = useState<SortField>('ppg');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['league-statistics'],
    queryFn: () => statisticsApi.getLeagueStats(),
  });

  const { data: combineStats, isLoading: isLoadingCombine, error: combineError } = useQuery({
    queryKey: ['combine-statistics'],
    queryFn: () => statisticsApi.getCombineStats(),
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedCombineStats = combineStats ? [...combineStats].sort((a, b) => {
    let aValue: number | string;
    let bValue: number | string;

    switch (sortField) {
      case 'player':
        aValue = a.player_name.toLowerCase();
        bValue = b.player_name.toLowerCase();
        break;
      case 'games_played':
        aValue = a.games_played;
        bValue = b.games_played;
        break;
      case 'ppg':
        aValue = a.ppg;
        bValue = b.ppg;
        break;
      case 'apg':
        aValue = a.apg;
        bValue = b.apg;
        break;
      case 'rpg':
        aValue = a.rpg;
        bValue = b.rpg;
        break;
      case 'spg':
        aValue = a.spg;
        bValue = b.spg;
        break;
      case 'bpg':
        aValue = a.bpg;
        bValue = b.bpg;
        break;
      case 'tpg':
        aValue = a.tpg;
        bValue = b.tpg;
        break;
      case 'fg_percentage':
        aValue = a.fg_percentage;
        bValue = b.fg_percentage;
        break;
      case 'three_point_percentage':
        aValue = a.three_point_percentage;
        bValue = b.three_point_percentage;
        break;
      case 'ft_percentage':
        aValue = a.ft_percentage;
        bValue = b.ft_percentage;
        break;
      default:
        return 0;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return sortDirection === 'asc'
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number);
  }) : [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-legends-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <p className="text-red-600 dark:text-legends-red-400">
          Error loading statistics. Please try again later.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-theme-primary mb-2">
          League Statistics
        </h1>
        <p className="text-theme-secondary">
          Comprehensive league-wide statistics and metrics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-legends-purple-600 dark:text-legends-purple-400 mb-2">
              {stats?.total_teams || 0}
            </div>
            <div className="text-sm text-theme-secondary">
              Total Teams
            </div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-legends-red-600 dark:text-legends-red-400 mb-2">
              {stats?.total_players || 0}
            </div>
            <div className="text-sm text-theme-secondary">
              Total Players
            </div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-legends-blue-600 dark:text-legends-blue-400 mb-2">
              {stats?.total_matches || 0}
            </div>
            <div className="text-sm text-theme-secondary">
              Total Matches
            </div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-legends-purple-600 dark:text-legends-purple-400 mb-2">
              {stats?.average_points_per_game?.toFixed(1) || '0.0'}
            </div>
            <div className="text-sm text-theme-secondary">
              Avg Points/Game
            </div>
          </div>
        </Card>
      </div>

      {stats?.top_scorer && (
        <Card>
          <h2 className="text-2xl font-semibold text-theme-primary mb-4">
            Top Scorer
          </h2>
          <div className="space-y-2">
            <p className="text-lg text-theme-secondary">
              <span className="font-semibold">{stats.top_scorer.player_name}</span>
            </p>
            <p className="text-theme-muted">
              Total Points: <span className="font-semibold text-legends-purple-600 dark:text-legends-purple-400">
                {stats.top_scorer.total_points}
              </span>
            </p>
          </div>
        </Card>
      )}

      {/* Combine Statistics Section */}
      <Card>
        <h2 className="text-2xl font-semibold text-theme-primary mb-4">
          Combine Statistics
        </h2>
        <p className="text-theme-secondary mb-4">
          Player statistics from games with stage set as Combine - Click column headers to sort
        </p>

        {isLoadingCombine ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-legends-purple-500"></div>
          </div>
        ) : combineError ? (
          <p className="text-red-600 dark:text-legends-red-400 text-center py-8">
            Error loading combine statistics. Please try again later.
          </p>
        ) : sortedCombineStats.length === 0 ? (
          <p className="text-center text-theme-secondary py-8">
            No combine statistics available.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-300">
              <thead className="bg-gray-50 dark:bg-gray-100">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-theme-secondary uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('player')}
                      className="flex items-center gap-1 hover:text-legends-purple-600 dark:hover:text-legends-purple-400"
                    >
                      Player
                      {sortField === 'player' && (
                        <span className="text-legends-purple-600 dark:text-legends-purple-400">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-theme-secondary uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('games_played')}
                      className="flex items-center gap-1 hover:text-legends-purple-600 dark:hover:text-legends-purple-400"
                    >
                      GP
                      {sortField === 'games_played' && (
                        <span className="text-legends-purple-600 dark:text-legends-purple-400">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-theme-secondary uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('ppg')}
                      className="flex items-center gap-1 hover:text-legends-purple-600 dark:hover:text-legends-purple-400"
                    >
                      PPG
                      {sortField === 'ppg' && (
                        <span className="text-legends-purple-600 dark:text-legends-purple-400">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-theme-secondary uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('apg')}
                      className="flex items-center gap-1 hover:text-legends-purple-600 dark:hover:text-legends-purple-400"
                    >
                      APG
                      {sortField === 'apg' && (
                        <span className="text-legends-purple-600 dark:text-legends-purple-400">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-theme-secondary uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('rpg')}
                      className="flex items-center gap-1 hover:text-legends-purple-600 dark:hover:text-legends-purple-400"
                    >
                      RPG
                      {sortField === 'rpg' && (
                        <span className="text-legends-purple-600 dark:text-legends-purple-400">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-theme-secondary uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('spg')}
                      className="flex items-center gap-1 hover:text-legends-purple-600 dark:hover:text-legends-purple-400"
                    >
                      SPG
                      {sortField === 'spg' && (
                        <span className="text-legends-purple-600 dark:text-legends-purple-400">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-theme-secondary uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('bpg')}
                      className="flex items-center gap-1 hover:text-legends-purple-600 dark:hover:text-legends-purple-400"
                    >
                      BPG
                      {sortField === 'bpg' && (
                        <span className="text-legends-purple-600 dark:text-legends-purple-400">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-theme-secondary uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('tpg')}
                      className="flex items-center gap-1 hover:text-legends-purple-600 dark:hover:text-legends-purple-400"
                    >
                      TPG
                      {sortField === 'tpg' && (
                        <span className="text-legends-purple-600 dark:text-legends-purple-400">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-theme-secondary uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('fg_percentage')}
                      className="flex items-center gap-1 hover:text-legends-purple-600 dark:hover:text-legends-purple-400"
                    >
                      FG%
                      {sortField === 'fg_percentage' && (
                        <span className="text-legends-purple-600 dark:text-legends-purple-400">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-theme-secondary uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('three_point_percentage')}
                      className="flex items-center gap-1 hover:text-legends-purple-600 dark:hover:text-legends-purple-400"
                    >
                      3P%
                      {sortField === 'three_point_percentage' && (
                        <span className="text-legends-purple-600 dark:text-legends-purple-400">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-theme-secondary uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('ft_percentage')}
                      className="flex items-center gap-1 hover:text-legends-purple-600 dark:hover:text-legends-purple-400"
                    >
                      FT%
                      {sortField === 'ft_percentage' && (
                        <span className="text-legends-purple-600 dark:text-legends-purple-400">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-white divide-y divide-gray-200 dark:divide-gray-300">
                {sortedCombineStats.map((stat) => (
                  <tr key={stat.player_id} className="hover:bg-gray-50 dark:hover:bg-gray-100">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-theme-primary">
                      <PlayerLink playerId={stat.player_id} playerName={stat.player_name} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-theme-secondary">
                      {stat.games_played}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-theme-secondary">
                      {stat.ppg.toFixed(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-theme-secondary">
                      {stat.apg.toFixed(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-theme-secondary">
                      {stat.rpg.toFixed(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-theme-secondary">
                      {stat.spg.toFixed(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-theme-secondary">
                      {stat.bpg.toFixed(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-theme-secondary">
                      {stat.tpg.toFixed(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-theme-secondary">
                      {stat.fg_percentage.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-theme-secondary">
                      {stat.three_point_percentage.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-theme-secondary">
                      {stat.ft_percentage.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

