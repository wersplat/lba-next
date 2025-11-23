'use client'

import { useQuery } from '@tanstack/react-query';
import { prizePoolApi, type SeasonPrizePool } from '@/services/prizePool';
import Card from '@/components/Card';
import { useState } from 'react';
import type { ReactNode } from 'react';

type SortField = 'season' | 'start_date' | 'total';
type SortDirection = 'asc' | 'desc';

// Format currency
const formatCurrency = (amount: number | null): string => {
  if (amount === null || amount === undefined) return 'N/A';
  return `$${amount.toLocaleString('en-US')}`;
};

// Format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
};

// Format date range
const formatDateRange = (startDate: string, endDate: string): string => {
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};

export default function PrizePoolPage() {
  const [sortField, setSortField] = useState<SortField>('season');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const { data: currentSeason, isLoading: isLoadingCurrent } = useQuery({
    queryKey: ['currentSeasonPrizePool'],
    queryFn: () => prizePoolApi.getCurrentSeasonPrizePool(),
  });

  const { data: allSeasons, isLoading: isLoadingAll } = useQuery({
    queryKey: ['allSeasonPrizePools'],
    queryFn: () => prizePoolApi.getAllSeasonPrizePools(),
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedSeasons = allSeasons ? [...allSeasons].sort((a, b) => {
    let aValue: number | string;
    let bValue: number | string;

    switch (sortField) {
      case 'season':
        aValue = a.season_number;
        bValue = b.season_number;
        break;
      case 'start_date':
        aValue = a.start_date;
        bValue = b.start_date;
        break;
      case 'total':
        aValue = a.total_prize_pool;
        bValue = b.total_prize_pool;
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

  const isLoading = isLoadingCurrent || isLoadingAll;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-legends-purple-500"></div>
      </div>
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

  // Calculate percentages for progress bars
  const getPercentage = (value: number, total: number): number => {
    if (total === 0) return 0;
    return (value / total) * 100;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-theme-primary mb-2">
          Prize Pool
        </h1>
        <p className="text-theme-secondary">
          Track current and historical prize pool contributions
        </p>
      </div>

      {/* Explanation Section */}
      <Card>
        <h2 className="text-2xl font-semibold text-theme-primary mb-4">
          Prize Pool Components
        </h2>
        <div className="space-y-4 text-theme-primary">
          <p>
            The Legends Basketball Association prize pool consists of three main components:
          </p>
          <ol className="list-decimal list-inside space-y-3 ml-2">
            <li>
              <strong>Base Pot:</strong> A guaranteed $1,000 starting amount for each season.
            </li>
            <li>
              <strong>Paid Tag:</strong> Additional contributions from player registration fees and paid tags.
            </li>
            <li>
              <strong>HOF/UPA Contributions:</strong> Contributions from Hall of Fame League and Unified Pro Am Association partnerships.
            </li>
          </ol>
          <p className="pt-2">
            The total prize pool is the sum of all three components and is awarded to teams based on their season performance.
          </p>
        </div>
      </Card>

      {/* Current Season Tracker */}
      {currentSeason ? (
        <Card>
          <h2 className="text-2xl font-semibold text-theme-primary mb-4">
            Current Season - Season {currentSeason.season_number}
          </h2>
          <div className="space-y-4">
            <div className="text-theme-secondary mb-6">
              <p>
                <strong>Season Dates:</strong> {formatDateRange(currentSeason.start_date, currentSeason.end_date)}
              </p>
            </div>

            {/* Progress Bars */}
            <div className="space-y-4">
              {/* Base Pot */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-theme-primary font-medium">Base Pot</span>
                  <span className="text-theme-secondary">
                    {formatCurrency(currentSeason.base_pot)} ({getPercentage(currentSeason.base_pot, currentSeason.total_prize_pool).toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-theme-tertiary rounded-full h-4">
                  <div
                    className="bg-legends-purple-600 h-4 rounded-full transition-all duration-300"
                    style={{ width: `${getPercentage(currentSeason.base_pot, currentSeason.total_prize_pool)}%` }}
                  />
                </div>
              </div>

              {/* Paid Tag */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-theme-primary font-medium">Paid Tag</span>
                  <span className="text-theme-secondary">
                    {formatCurrency(currentSeason.paid_tag_amount)} ({getPercentage(currentSeason.paid_tag_amount || 0, currentSeason.total_prize_pool).toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-theme-tertiary rounded-full h-4">
                  <div
                    className="bg-legends-purple-500 h-4 rounded-full transition-all duration-300"
                    style={{ width: `${getPercentage(currentSeason.paid_tag_amount || 0, currentSeason.total_prize_pool)}%` }}
                  />
                </div>
              </div>

              {/* HOF/UPA Contributions */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-theme-primary font-medium">HOF/UPA Contributions</span>
                  <span className="text-theme-secondary">
                    {formatCurrency(currentSeason.hof_upa_contributions)} ({getPercentage(currentSeason.hof_upa_contributions || 0, currentSeason.total_prize_pool).toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-theme-tertiary rounded-full h-4">
                  <div
                    className="bg-legends-purple-400 h-4 rounded-full transition-all duration-300"
                    style={{ width: `${getPercentage(currentSeason.hof_upa_contributions || 0, currentSeason.total_prize_pool)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Total Prize Pool */}
            <div className="mt-6 pt-6 border-t border-theme">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-theme-primary">Total Prize Pool</span>
                <span className="text-2xl font-bold text-legends-purple-600 dark:text-legends-purple-400">
                  {formatCurrency(currentSeason.total_prize_pool)}
                </span>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <Card>
          <p className="text-center text-theme-secondary py-8">
            No active season prize pool data available.
          </p>
        </Card>
      )}

      {/* Historical Table */}
      <div>
        <h2 className="text-2xl font-semibold text-theme-primary mb-4">
          Historical Prize Pools
        </h2>
        {sortedSeasons.length > 0 ? (
          <div className="bg-theme-primary shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-theme">
                <thead className="bg-theme-secondary">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-theme-secondary uppercase tracking-wider">
                      <SortButton field="season">Season</SortButton>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-theme-secondary uppercase tracking-wider">
                      <SortButton field="start_date">Season Dates</SortButton>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-theme-secondary uppercase tracking-wider">
                      Base Pot
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-theme-secondary uppercase tracking-wider">
                      Paid Tag
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-theme-secondary uppercase tracking-wider">
                      HOF/UPA Contributions
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-theme-secondary uppercase tracking-wider">
                      <SortButton field="total">Total Prize Pool</SortButton>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-theme-primary divide-y divide-theme">
                  {sortedSeasons.map((season) => (
                    <tr key={season.season_id} className="bg-theme-hover">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-theme-primary">
                        {season.season_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-theme-secondary">
                        {formatDateRange(season.start_date, season.end_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-theme-secondary">
                        {formatCurrency(season.base_pot)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-theme-secondary">
                        {formatCurrency(season.paid_tag_amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-theme-secondary">
                        {formatCurrency(season.hof_upa_contributions)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-theme-primary">
                        {formatCurrency(season.total_prize_pool)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <Card>
            <p className="text-center text-theme-secondary py-8">
              No historical prize pool data available.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}

