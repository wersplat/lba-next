'use client'

import { useQuery } from '@tanstack/react-query';
import { teamsApi, type Team } from '@/services/teams';
import Table from '@/components/Table';
import Card from '@/components/Card';
import Link from 'next/link';
import { useState } from 'react';

type ViewMode = 'cards' | 'list';

export default function TeamsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  
  const { data: teams, isLoading, error } = useQuery({
    queryKey: ['teams'],
    queryFn: () => teamsApi.getAll(),
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
          Error loading teams. Please try again later.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-theme-primary mb-2">
            Teams
          </h1>
          <p className="text-theme-secondary">
            View all teams in the Legends Basketball Association
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('cards')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'cards'
                ? 'bg-legends-purple-600 text-white'
                : 'bg-theme-hover text-theme-primary hover:bg-theme-tertiary'
            }`}
            aria-label="Card view"
            aria-pressed={viewMode === 'cards'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'list'
                ? 'bg-legends-purple-600 text-white'
                : 'bg-theme-hover text-theme-primary hover:bg-theme-tertiary'
            }`}
            aria-label="List view"
            aria-pressed={viewMode === 'list'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {teams && teams.length > 0 ? (
        viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team: Team) => (
              <Card key={team.id} className="hover:shadow-lg transition-shadow">
                <Link href={`/teams/${team.id}`} className="block">
                  <div className="flex items-center space-x-4">
                    {team.logo ? (
                      <img 
                        className="h-16 w-16 rounded-full flex-shrink-0" 
                        src={team.logo} 
                        alt={`${team.name} logo`}
                        width={64}
                        height={64}
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-theme-tertiary flex items-center justify-center text-2xl font-bold text-theme-secondary flex-shrink-0">
                        {team.name.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-semibold text-theme-primary truncate">
                        {team.name}
                      </h3>
                      {team.division && (
                        <p className="text-sm text-theme-secondary mt-1">
                          {team.division}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <Table headers={['Logo', 'Team Name', 'Division']}>
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
              </tr>
            ))}
          </Table>
        )
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

