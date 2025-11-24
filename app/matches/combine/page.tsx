'use client'

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { matchesApi, type Match } from '@/services/matches';
import Table from '@/components/Table';
import Card from '@/components/Card';
import MatchModal from '@/components/MatchModal';

export default function CombineMatchesPage() {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const { data: matches, isLoading, error } = useQuery({
    queryKey: ['combine-matches'],
    queryFn: () => matchesApi.getCombineMatches(25),
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
          Error loading combine matches. Please try again later.
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
          Combine Matches
        </h1>
        <p className="text-theme-secondary">
          Draft combine game results and matchups
        </p>
      </div>

      {matches && matches.length > 0 ? (
        <Table headers={['Date', 'Team 1', 'Score', 'Team 2', 'Score', 'Winner']}>
          {matches.map((match) => (
            <tr 
              key={match.id} 
              className={`bg-theme-hover ${match.boxscore_url ? 'cursor-pointer hover:bg-theme-tertiary' : ''}`}
              onClick={() => match.boxscore_url && setSelectedMatch(match)}
            >
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
                {match.boxscore_url && (
                  <span className="ml-2 text-xs text-legends-purple-600 dark:text-legends-purple-400">📊</span>
                )}
              </td>
            </tr>
          ))}
        </Table>
      ) : (
        <Card>
          <p className="text-center text-theme-secondary py-8">
            No combine matches found.
          </p>
        </Card>
      )}

      {selectedMatch && (
        <MatchModal match={selectedMatch} onClose={() => setSelectedMatch(null)} />
      )}
    </div>
  );
}


