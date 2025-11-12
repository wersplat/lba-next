'use client'

import { useQuery } from '@tanstack/react-query';
import { matchesApi } from '@/services/matches';
import Table from '@/components/Table';
import Card from '@/components/Card';

export default function RecentMatchesPage() {
  const { data: matches, isLoading, error } = useQuery({
    queryKey: ['recent-matches'],
    queryFn: () => matchesApi.getRecent(25),
  });

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
          Error loading matches. Please try again later.
        </p>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-theme-primary mb-2">
          Recent Matches
        </h1>
        <p className="text-theme-secondary">
          Latest game results and matchups
        </p>
      </div>

      {matches && matches.length > 0 ? (
        <Table headers={['Date', 'Team 1', 'Score', 'Team 2', 'Score', 'Winner']}>
          {matches.map((match) => (
            <tr key={match.id} className="bg-theme-hover">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-theme-secondary">
                {formatDate(match.match_date)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-theme-primary">
                {match.team1_name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-theme-primary">
                {match.team1_score ?? '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-theme-primary">
                {match.team2_name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-theme-primary">
                {match.team2_score ?? '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {match.winner_id === match.team1_id ? (
                  <span className="text-legends-purple-600 dark:text-legends-purple-400 font-semibold">
                    {match.team1_name}
                  </span>
                ) : match.winner_id === match.team2_id ? (
                  <span className="text-legends-purple-600 dark:text-legends-purple-400 font-semibold">
                    {match.team2_name}
                  </span>
                ) : (
                  <span className="text-theme-muted">-</span>
                )}
              </td>
            </tr>
          ))}
        </Table>
      ) : (
        <Card>
          <p className="text-center text-theme-secondary py-8">
            No matches found.
          </p>
        </Card>
      )}
    </div>
  );
}

