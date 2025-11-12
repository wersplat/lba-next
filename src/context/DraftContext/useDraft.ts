import { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMutation } from '@apollo/client/react';
import { teamsApi, type Team } from '../../services/teams';
import { playersApi, type Player } from '../../services/players';
import { draftPicksApi, type DraftPick } from '../../services/draftPicks';
import { INSERT_DRAFT_PICK } from '../../services/graphql';
import { LEGENDS_LEAGUE_ID } from '../../services/leagues';
import { getCurrentSeasonId } from '../../services/seasons';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../AuthContext';
import type { DraftContextType } from './types';

const DRAFT_DURATION = 60; // 60 seconds per pick

export const useDraft = (): DraftContextType => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { supabase: authenticatedSupabase } = useAuth();
  
  // State for draft control
  const [isPaused, setIsPaused] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(DRAFT_DURATION);
  const [currentPick, setCurrentPick] = useState(1);
  
  // Fetch teams, players, and draft picks
  const { data: teams = [], isLoading: isLoadingTeams } = useQuery<Team[]>({
    queryKey: ['teams'],
    queryFn: teamsApi.getAll,
  });

  const { data: players = [], isLoading: isLoadingPlayers } = useQuery<Player[]>({
    queryKey: ['players'],
    queryFn: playersApi.getAll,
  });

  const { data: draftPicks = [], isLoading: isLoadingDraftPicks } = useQuery<DraftPick[]>({
    queryKey: ['draftPicks'],
    queryFn: draftPicksApi.getAll,
    retry: false, // Don't retry if table doesn't exist
    refetchOnWindowFocus: false,
  });

  // Skip the current pick
  const skipPick = useCallback(() => {
    setCurrentPick(prev => prev + 1);
    setTimeLeft(DRAFT_DURATION);
    toast('Pick skipped', 'info');
  }, [toast]);

  // Timer effect - only run if draft has been started
  useEffect(() => {
    if (!isStarted || isPaused || isLoadingDraftPicks) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto-skip if time runs out
          skipPick();
          return DRAFT_DURATION;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isStarted, isPaused, isLoadingDraftPicks, skipPick]);

  // GraphQL mutation for selecting a player
  const [insertDraftPickMutation, { loading: isDrafting }] = useMutation(INSERT_DRAFT_PICK, {
    onError: (error) => {
      console.error('Error selecting player:', error);
      const apolloError = error as { 
        graphQLErrors?: Array<{ 
          message: string; 
          extensions?: { 
            code?: string;
            path?: string;
            [key: string]: any;
          };
        }>; 
        networkError?: { message?: string };
        message?: string;
      };
      
      // Try to extract detailed error message
      let errorMessage = 'Failed to select player';
      if (apolloError.graphQLErrors && apolloError.graphQLErrors.length > 0) {
        const firstError = apolloError.graphQLErrors[0];
        errorMessage = firstError.message || errorMessage;
        console.error('GraphQL Error Details:', {
          message: firstError.message,
          extensions: firstError.extensions,
          fullError: firstError,
        });
      } else if (apolloError.networkError) {
        errorMessage = apolloError.networkError.message || errorMessage;
        console.error('Network Error:', apolloError.networkError);
      } else if (apolloError.message) {
        errorMessage = apolloError.message;
      }
      
      console.error('Full error object:', error);
      toast(errorMessage, 'error');
    },
  });

  // Mutation function for selecting a player
  const selectPlayerMutation = {
    mutateAsync: async (playerId: string) => {
      // Auto-start draft if not started yet
      if (!isStarted) {
        setIsStarted(true);
        setIsPaused(false);
      }
      
      const currentTeam = teams[(currentPick - 1) % teams.length];
      if (!currentTeam) throw new Error('No team found for current pick');
      
      // Get current season ID
      const seasonId = await getCurrentSeasonId();
      if (!seasonId) throw new Error('No active season found');
      
      // Prepare mutation variables
      const variables = {
        league_id: LEGENDS_LEAGUE_ID,
        season_id: seasonId,
        team_id: currentTeam.id,
        player_id: playerId,
        pick_number: currentPick,
      };
      
      console.log('Drafting player with variables:', variables);
      
      // Execute GraphQL mutation
      await insertDraftPickMutation({
        variables,
      });
      
      // Invalidate queries to refetch data
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['players'] }),
        queryClient.invalidateQueries({ queryKey: ['draftPicks'] }),
        queryClient.invalidateQueries({ queryKey: ['draft-pool'] }),
      ]);
      
      // Move to next pick
      setCurrentPick(prev => prev + 1);
      setTimeLeft(DRAFT_DURATION);
    },
  };

  // Start the draft
  const startDraft = useCallback(() => {
    setIsStarted(true);
    setIsPaused(false);
    toast('Draft started', 'success');
  }, [toast]);

  // Toggle pause state
  const togglePause = useCallback(() => {
    if (!isStarted) {
      startDraft();
      return;
    }
    setIsPaused(prev => !prev);
    toast(isPaused ? 'Draft resumed' : 'Draft paused', 'info');
  }, [isStarted, isPaused, startDraft, toast]);

  // Reset the draft
  const resetDraft = useCallback(async () => {
    try {
      await draftPicksApi.resetDraft();
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['players'] }),
        queryClient.invalidateQueries({ queryKey: ['draftPicks'] }),
      ]);
      setCurrentPick(1);
      setTimeLeft(DRAFT_DURATION);
      setIsPaused(false);
      setIsStarted(false);
      toast('Draft reset successfully', 'success');
    } catch (error) {
      console.error('Error resetting draft:', error);
      toast('Failed to reset draft', 'error');
    }
  }, [queryClient, toast]);

  return {
    teams,
    players: players.filter(p => p.available),
    draftPicks,
    currentPick,
    isPaused,
    isStarted,
    timeLeft,
    isLoading: isLoadingTeams || isLoadingPlayers || isLoadingDraftPicks,
    selectPlayer: selectPlayerMutation.mutateAsync,
    skipPick,
    startDraft,
    togglePause,
    resetDraft,
  };
};
