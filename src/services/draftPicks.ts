import { supabase } from '../lib/supabase';
import { LEGENDS_LEAGUE_ID } from './leagues';
import { getCurrentSeasonId } from './seasons';
import type { Database } from './supabase';

export type DraftPick = {
  id: string;
  pick_number: number;
  team_id: string;
  player_id: string;
  player_name: string;
  player_position: string;
  league_id: string | null;
  season_id: string | null;
  created_at: string;
};

export const draftPicksApi = {
  getAll: async (): Promise<DraftPick[]> => {
    try {
      // Get current season ID
      const seasonId = await getCurrentSeasonId();
      
      // Build query with filters for league_id and season_id
      let query = supabase
        .from('draft_picks')
        .select('*')
        .eq('league_id', LEGENDS_LEAGUE_ID);
      
      // Add season_id filter if available
      if (seasonId) {
        query = query.eq('season_id', seasonId);
      }
      
      // Order by pick_number
      query = query.order('pick_number');
      
      const { data, error } = await query;
      
      if (error) {
        // Handle table not existing gracefully
        const errorObj = error as { code?: string; status?: number; message?: string };
        if (errorObj?.code === 'PGRST116' || errorObj?.status === 404 || errorObj?.message?.includes('relation') || errorObj?.message?.includes('does not exist')) {
          console.log('draft_picks table does not exist yet, returning empty array');
          return [];
        }
        throw error;
      }
      
      return (data || []).map((pick: Database['public']['Tables']['draft_picks']['Row']) => ({
        id: pick.id,
        pick_number: pick.pick_number,
        team_id: pick.team_id,
        player_id: pick.player_id,
        player_name: pick.player_name,
        player_position: pick.player_position || '',
        league_id: pick.league_id,
        season_id: pick.season_id,
        created_at: pick.created_at || new Date().toISOString(),
      }));
    } catch (err: unknown) {
      // Handle 404 or other errors gracefully
      const error = err as { code?: string; status?: number; message?: string };
      if (error?.code === 'PGRST116' || error?.status === 404 || error?.message?.includes('relation') || error?.message?.includes('does not exist')) {
        console.log('draft_picks table does not exist yet, returning empty array');
        return [];
      }
      console.warn('Error fetching draft picks:', err);
      return [];
    }
  },

  getByTeam: async (teamId: string): Promise<DraftPick[]> => {
    try {
      // Get current season ID
      const seasonId = await getCurrentSeasonId();
      
      // Build query with filters for league_id and season_id
      let query = supabase
        .from('draft_picks')
        .select('*')
        .eq('team_id', teamId)
        .eq('league_id', LEGENDS_LEAGUE_ID);
      
      // Add season_id filter if available
      if (seasonId) {
        query = query.eq('season_id', seasonId);
      }
      
      // Order by pick_number
      query = query.order('pick_number');
      
      const { data, error } = await query;
      
      if (error) {
        const errorObj = error as { code?: string; status?: number; message?: string };
        if (errorObj?.code === 'PGRST116' || errorObj?.status === 404 || errorObj?.message?.includes('relation') || errorObj?.message?.includes('does not exist')) {
          return [];
        }
        throw error;
      }
      
      return (data || []).map((pick: Database['public']['Tables']['draft_picks']['Row']) => ({
        id: pick.id,
        pick_number: pick.pick_number,
        team_id: pick.team_id,
        player_id: pick.player_id,
        player_name: pick.player_name,
        player_position: pick.player_position || '',
        league_id: pick.league_id,
        season_id: pick.season_id,
        created_at: pick.created_at || new Date().toISOString(),
      }));
    } catch (err: unknown) {
      const error = err as { code?: string; status?: number; message?: string };
      if (error?.code === 'PGRST116' || error?.status === 404 || error?.message?.includes('relation') || error?.message?.includes('does not exist')) {
        return [];
      }
      console.warn('Error fetching draft picks by team:', err);
      return [];
    }
  },

  resetDraft: async (): Promise<void> => {
    try {
      // Get current season ID
      const seasonId = await getCurrentSeasonId();
      
      // Build delete query with filters for league_id and season_id
      let deleteQuery = supabase
        .from('draft_picks')
        .delete()
        .eq('league_id', LEGENDS_LEAGUE_ID);
      
      // Filter by season_id if available
      if (seasonId) {
        deleteQuery = deleteQuery.eq('season_id', seasonId);
      }
      
      const { error: picksError } = await deleteQuery;
      
      if (picksError) {
        const error = picksError as { code?: string; status?: number; message?: string };
        if (error.code === 'PGRST116' || error.status === 404 || error.message?.includes('relation') || error.message?.includes('does not exist')) {
          console.log('draft_picks table does not exist, nothing to reset');
          return;
        }
        throw picksError;
      }
    } catch (err: unknown) {
      // If table doesn't exist, that's fine
      const error = err as { code?: string; status?: number; message?: string };
      if (error?.code === 'PGRST116' || error?.status === 404 || error?.message?.includes('relation') || error?.message?.includes('does not exist')) {
        console.log('draft_picks table does not exist, nothing to reset');
        return;
      }
      console.warn('Error resetting draft', err);
    }
  },
};

