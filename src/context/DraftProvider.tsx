import { useState, useEffect, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDraft as useDraftHook } from '../hooks/useDraft';
import { DraftContext } from './DraftContext/context';
import type { ReactNode } from 'react';
import type { DraftContextType, Team } from './DraftContext/types';

export function DraftProvider({ children }: { children: ReactNode }) {
  const [currentPick, setCurrentPick] = useState<number>(1);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(90); // 90 seconds per pick
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const {
    teamsQuery,
    playersQuery,
    draftPicksQuery,
    selectPlayer: selectPlayerAction,
    resetDraft: resetDraftAction,
    setupRealtimeSubscriptions,
  } = useDraftHook();

  // Set up real-time subscriptions
  useEffect(() => {
    const cleanup = setupRealtimeSubscriptions();
    return cleanup;
  }, [setupRealtimeSubscriptions]);

  // Fetch data
  const { data: teams = [], isLoading: isLoadingTeams } = useQuery(teamsQuery);
  const { data: players = [], isLoading: isLoadingPlayers } = useQuery(playersQuery);
  const { data: draftPicks = [], isLoading: isLoadingPicks } = useQuery(draftPicksQuery);

  // Update loading state
  useEffect(() => {
    setIsLoading(isLoadingTeams || isLoadingPlayers || isLoadingPicks);
  }, [isLoadingTeams, isLoadingPlayers, isLoadingPicks]);

  // Handle player selection
  const handleSelectPlayer = useCallback(async (playerId: string) => {
    // Auto-start draft if not started yet
    if (!isStarted) {
      setIsStarted(true);
      setIsPaused(false);
    }
    
    if (!selectPlayerAction) {
      console.error('selectPlayerAction is not defined');
      return;
    }
    
    try {
      await selectPlayerAction(
        playerId,
        currentPick,
        teams as Team[],
        () => {
          // On success callback
          setCurrentPick(prev => prev + 1);
          setTimeLeft(90);
        }
      );
    } catch (error) {
      console.error('Error selecting player:', error);
      throw error;
    }
  }, [selectPlayerAction, currentPick, teams, isStarted]);

  // Handle skip pick
  const handleSkipPick = useCallback(() => {
    setCurrentPick(prev => prev + 1);
    setTimeLeft(90);
  }, []);

  // Handle start draft
  const handleStartDraft = useCallback(() => {
    setIsStarted(true);
    setIsPaused(false);
  }, []);

  // Handle toggle pause
  const handleTogglePause = useCallback(() => {
    if (!isStarted) {
      handleStartDraft();
      return;
    }
    setIsPaused(prev => !prev);
  }, [isStarted, handleStartDraft]);

  // Handle reset draft
  const handleResetDraft = useCallback(async () => {
    if (!resetDraftAction) {
      console.error('resetDraftAction is not defined');
      return;
    }
    
    try {
      await resetDraftAction();
      setCurrentPick(1);
      setTimeLeft(90);
      setIsPaused(false);
      setIsStarted(false);
    } catch (error) {
      console.error('Error resetting draft:', error);
      throw error;
    }
  }, [resetDraftAction]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue: DraftContextType = useMemo(() => ({
    teams: teams || [],
    players: players || [],
    draftPicks: draftPicks || [],
    currentPick,
    isPaused,
    isStarted,
    timeLeft,
    isLoading,
    selectPlayer: handleSelectPlayer,
    skipPick: handleSkipPick,
    startDraft: handleStartDraft,
    togglePause: handleTogglePause,
    resetDraft: handleResetDraft,
  }), [
    teams,
    players,
    draftPicks,
    currentPick,
    isPaused,
    isStarted,
    timeLeft,
    isLoading,
    handleSelectPlayer,
    handleSkipPick,
    handleStartDraft,
    handleTogglePause,
    handleResetDraft,
  ]);

  // Timer logic - only run if draft has been started
  useEffect(() => {
    if (!isStarted || isPaused || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isStarted, isPaused, timeLeft]);

  return (
    <DraftContext.Provider value={contextValue}>
      {children}
    </DraftContext.Provider>
  );
}
