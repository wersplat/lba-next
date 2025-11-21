'use client'

import { useDraft } from '@/context/DraftContext/useDraft';
import { useAuth } from '@/context/AuthContext';
import DraftBoard from '@/components/DraftBoard';
import { useQuery } from '@tanstack/react-query';
import { hasActiveSeason } from '@/services/seasons';
import type { Player } from '@/services/players';

export default function LiveDraftPage() {
  const { user } = useAuth();
  const { 
    teams, 
    players,
    currentPick, 
    isLoading, 
    togglePause,
    resetDraft,
    isPaused,
    isStarted,
    timeLeft,
    selectPlayer
  } = useDraft();

  // Check if there's an active season
  const { data: hasActive, isLoading: isLoadingSeason } = useQuery({
    queryKey: ['hasActiveSeason'],
    queryFn: hasActiveSeason,
  });

  const currentTeam = teams[(currentPick - 1) % teams.length];
  // Check if user is admin based on Clerk user email addresses
  const userEmail = user?.emailAddresses?.[0]?.emailAddress;
  const isAdmin = userEmail?.endsWith('@admin.com') ?? false;
  const isDraftDisabled = !hasActive;

  const handleSelectPlayer = (player: Player) => {
    if (isDraftDisabled) return;
    selectPlayer(player.id);
  };

  if (isLoading || isLoadingSeason) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-legends-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Banner for no active season */}
      {!hasActive && (
        <div className="bg-theme-primary border-l-4 p-4 rounded-md shadow-sm" style={{ borderLeftColor: 'var(--legends-red)' }}>
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5" style={{ color: 'var(--legends-red)' }} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-theme-primary">
                <strong className="font-medium" style={{ color: 'var(--legends-red)' }}>No Active Season</strong>
                <br />
                <span className="text-theme-secondary">There is currently no active season for Legends Basketball Association. The draft is disabled until an active season is created.</span>
              </p>
            </div>
          </div>
        </div>
      )}
      <DraftBoard 
        currentTeam={currentTeam}
        currentPick={currentPick}
        timeLeft={timeLeft}
        isPaused={isPaused}
        isStarted={isStarted}
        onTogglePause={togglePause}
        onResetDraft={resetDraft}
        isAdmin={isAdmin}
        disabled={isDraftDisabled}
      />
      
      {/* Available Players */}
      <div className="bg-white dark:bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-300">
          <h3 className="text-lg font-medium text-theme-primary">Available Players</h3>
        </div>
        <div className="overflow-y-auto" style={{ maxHeight: '600px' }}>
          {players.length === 0 ? (
            <div className="p-6 text-center text-theme-secondary">
              No players available
            </div>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-300">
              {players.map((player: Player) => (
                <li key={player.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-theme-primary">{player.name}</p>
                      <p className="text-sm text-theme-secondary">{player.position} • {player.team}</p>
                    </div>
                    <button
                      onClick={() => handleSelectPlayer(player)}
                      className={`inline-flex items-center px-3 py-1.5 border text-xs font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        !isStarted || isPaused || isDraftDisabled
                          ? 'bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed'
                          : 'bg-legends-purple-600 text-white border-transparent hover:bg-legends-purple-700 focus:ring-legends-purple-500'
                      }`}
                      disabled={!isStarted || isPaused || isDraftDisabled}
                    >
                      Draft
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

