'use client'

import { useQuery } from '@tanstack/react-query';
import { teamsApi, type Team } from '@/services/teams';
import Table from '@/components/Table';
import Card from '@/components/Card';
import Link from 'next/link';

export default function TeamsPage() {
  const { data: teams, isLoading, error } = useQuery({
    queryKey: ['teams'],
    queryFn: () => teamsApi.getAll(),
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

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
          Error loading teams. Please try again later.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-theme-primary mb-2">
          Teams
        </h1>
        <p className="text-theme-secondary">
          View all teams in the Legends Basketball Association
        </p>
      </div>

      {teams && teams.length > 0 ? (
        <Table headers={['Logo', 'Team Name', 'Division', 'Created']}>
          {teams.map((team: Team) => (
            <tr key={team.id} className="bg-theme-hover">
              <td className="px-6 py-4 whitespace-nowrap">
                {team.logo ? (
                  <img 
                    className="h-10 w-10 rounded-full" 
                    src={team.logo} 
                    alt={`${team.name} logo`}
                    width={40}
                    height={40}
                    loading="lazy"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-theme-tertiary flex items-center justify-center text-sm font-bold text-theme-secondary">
                    {team.name.charAt(0)}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <Link
                  href={`/teams/${team.id}`}
                  className="font-medium text-legends-purple-600 dark:text-legends-purple-400 hover:text-legends-purple-800 dark:hover:text-legends-purple-300 transition-colors"
                >
                  {team.name}
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-theme-secondary">
                {team.division || 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-theme-secondary">
                {formatDate(team.created_at)}
              </td>
            </tr>
          ))}
        </Table>
      ) : (
        <Card>
          <p className="text-center text-theme-secondary py-8">
            No teams found.
          </p>
        </Card>
      )}
    </div>
  );
}

