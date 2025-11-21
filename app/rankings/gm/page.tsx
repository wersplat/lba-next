'use client'

import { useQuery } from '@tanstack/react-query';
import { gmApi, type GMProfile } from '@/services/gm';
import Card from '@/components/Card';
import GMLink from '@/components/GMLink';
import { useState } from 'react';
import type { ReactNode } from 'react';

type SortField = 'gm_name' | 'team' | 'wins' | 'losses' | 'win_percentage';
type SortDirection = 'asc' | 'desc';

function getGMDisplayName(gm: GMProfile): string {
  return gm.player?.gamertag || gm.discord_username || 'General Manager';
}

function calculateWinPercentage(wins: number, losses: number): number {
  const total = wins + losses;
  if (total === 0) return 0;
  return wins / total;
}

export default function GMRankingsPage() {
  const [sortField, setSortField] = useState<SortField>('win_percentage');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const { data: gms, isLoading, error } = useQuery({
    queryKey: ['gm-rankings'],
    queryFn: () => gmApi.getAll(),
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedGMs = gms ? [...gms].sort((a, b) => {
    let aValue: number | string;
    let bValue: number | string;

    switch (sortField) {
      case 'gm_name':
        aValue = getGMDisplayName(a).toLowerCase();
        bValue = getGMDisplayName(b).toLowerCase();
        break;
      case 'team':
        aValue = (a.team?.team_name || '').toLowerCase();
        bValue = (b.team?.team_name || '').toLowerCase();
        break;
      case 'wins':
        aValue = a.total_wins;
        bValue = b.total_wins;
        break;
      case 'losses':
        aValue = a.total_losses;
        bValue = b.total_losses;
        break;
      case 'win_percentage':
        aValue = calculateWinPercentage(a.total_wins, a.total_losses);
        bValue = calculateWinPercentage(b.total_wins, b.total_losses);
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
          Error loading GM rankings. Please try again later.
        </p>
      </Card>
    );
  }

  const SortButton = ({ field, children }: { field: SortField; children: ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-legends-purple-600 dark:hover:text-legends-purple-400"
    >
      {children}
      {sortField === field && (
        <span className="text-legends-purple-600 dark:text-legends-purple-400">
          {sortDirection === 'asc' ? '↑' : '↓'}
        </span>
      )}
    </button>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-theme-primary mb-2">
          General Manager Rankings
        </h1>
        <p className="text-theme-secondary">
          GM rankings by Win-Loss record - Click column headers to sort
        </p>
      </div>

      {sortedGMs.length > 0 ? (
        <div className="bg-white dark:bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-300">
              <thead className="bg-gray-50 dark:bg-gray-100">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-theme-secondary uppercase tracking-wider">
                    Rank
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-theme-secondary uppercase tracking-wider">
                    <SortButton field="gm_name">GM Name</SortButton>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-theme-secondary uppercase tracking-wider">
                    <SortButton field="team">Team</SortButton>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-theme-secondary uppercase tracking-wider">
                    <SortButton field="wins">Wins</SortButton>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-theme-secondary uppercase tracking-wider">
                    <SortButton field="losses">Losses</SortButton>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-theme-secondary uppercase tracking-wider">
                    <SortButton field="win_percentage">Win %</SortButton>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-theme-secondary uppercase tracking-wider">
                    Games Played
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-white divide-y divide-gray-200 dark:divide-gray-300">
                {sortedGMs.map((gm, index) => {
                  const winPercentage = calculateWinPercentage(gm.total_wins, gm.total_losses);
                  const gamesPlayed = gm.total_wins + gm.total_losses;
                  const displayName = getGMDisplayName(gm);
                  
                  return (
                    <tr key={gm.id} className="hover:bg-gray-50 dark:hover:bg-gray-100">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-theme-primary">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <GMLink gmId={gm.id} gmName={displayName} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-theme-secondary">
                        {gm.team?.team_name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-theme-secondary">
                        {gm.total_wins}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-theme-secondary">
                        {gm.total_losses}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-theme-secondary">
                        {(winPercentage * 100).toFixed(1)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-theme-secondary">
                        {gamesPlayed}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <Card>
          <p className="text-center text-theme-secondary py-8">
            No GM rankings data available.
          </p>
        </Card>
      )}
    </div>
  );
}

