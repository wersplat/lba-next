'use client'

import { useQuery } from '@tanstack/react-query';
import { draftPoolApi } from '@/services/draftPool';
import Table from '@/components/Table';
import Card from '@/components/Card';
import PlayerLink from '@/components/PlayerLink';
import { useState } from 'react';

export default function DraftBoardPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState<string>('');

  const { data: players, isLoading, error } = useQuery({
    queryKey: ['draft-board-eligible'],
    queryFn: () => draftPoolApi.getEligiblePlayers(),
  });

  const filteredPlayers = players?.filter(player => {
    const matchesSearch = 
      player.player_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.team?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPosition = !positionFilter || player.position === positionFilter;
    
    return matchesSearch && matchesPosition;
  }) || [];

  const positions = ['PG', 'SG', 'SF', 'PF', 'C'];

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
          Error loading draft board. Please try again later.
        </p>
        {error instanceof Error && (
          <p className="text-sm text-theme-secondary mt-2">
            {error.message}
          </p>
        )}
      </Card>
    );
  }

  if (!players || players.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-theme-primary mb-2">
            Draft Board
          </h1>
          <p className="text-theme-secondary">
            Players eligible for the draft (5+ combine games or marked eligible)
          </p>
        </div>
        <Card>
          <p className="text-center text-theme-secondary py-8">
            No eligible players found for the draft board.
            <br />
            <span className="text-sm mt-2 block">
              Players need either 5+ combine games played or be marked as eligible in the draft pool.
            </span>
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Draft Board
        </h1>
        <p className="text-gray-600 dark:text-neutral-300">
          Players eligible for the draft (5+ combine games or marked eligible)
        </p>
      </div>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-theme-primary mb-2">
              Search Players
            </label>
            <input
              type="text"
              placeholder="Search by name, position, or team..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-theme w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-legends-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-theme-primary mb-2">
              Filter by Position
            </label>
            <select
              value={positionFilter}
              onChange={(e) => setPositionFilter(e.target.value)}
              className="select-theme w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-legends-purple-500 focus:border-transparent"
            >
              <option value="">All Positions</option>
              {positions.map(pos => (
                <option key={pos} value={pos}>{pos}</option>
              ))}
            </select>
          </div>
        </div>

        {filteredPlayers.length === 0 ? (
          <p className="text-center text-theme-secondary py-8">
            No players found matching your criteria.
          </p>
        ) : (
          <Table headers={['Player Name', 'Position', 'Team', 'Combine Games', 'Status']}>
            {filteredPlayers.map((player) => (
              <tr key={player.player_id} className="bg-theme-hover">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-theme-primary">
                  <PlayerLink 
                    playerId={player.player_id} 
                    playerName={player.player_name}
                    className="font-medium"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-theme-secondary">
                  {player.position || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-theme-secondary">
                  {player.team || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-theme-secondary">
                  {player.combine_games}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    player.eligibility_reason === 'status' || player.eligibility_reason === 'both'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : player.combine_games >= 5
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                  }`}>
                    {player.eligibility_reason === 'status' 
                      ? 'Eligible (Status)'
                      : player.eligibility_reason === 'combine_games'
                      ? 'Eligible (5+ Games)'
                      : 'Eligible (Both)'
                    }
                  </span>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
    </div>
  );
}

