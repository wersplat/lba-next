import { supabase } from '../lib/supabase';
import { LEGENDS_LEAGUE_ID } from './leagues';
import type { Database } from './supabase';

type DraftPoolRow = Database['public']['Tables']['draft_pool']['Row'];

export type DraftPoolPlayer = DraftPoolRow & {
  player_name: string;
  position: string | null;
  team: string | null;
};

export type EligiblePlayer = DraftPoolPlayer & {
  combine_games: number;
  eligibility_reason: 'status' | 'combine_games' | 'both';
};

export const draftPoolApi = {
  getAll: async (): Promise<DraftPoolPlayer[]> => {
    const { data, error } = await supabase
      .from('draft_pool')
      .select(`
        *,
        player:players!draft_pool_player_id_fkey (
          gamertag,
          position,
          currentTeamName
        )
      `)
      .eq('league_id', LEGENDS_LEAGUE_ID)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching draft pool:', error);
      // Check if it's a permissions/RLS issue
      if (error.message?.includes('permission') || error.message?.includes('policy')) {
        console.warn('Possible RLS (Row Level Security) issue. Check Supabase policies for draft_pool table.');
      }
      throw error;
    }
    
    // Filter by status = 'available' (case-insensitive) or null status
    const filteredData = (data || []).filter((item: DraftPoolRow & { player?: { gamertag: string; position: string | null; currentTeamName: string | null } | null }) => {
      const status = item.status?.toLowerCase();
      return !status || status === 'available';
    });
    
    return filteredData
      .map((item: DraftPoolRow & { player?: { gamertag: string; position: string | null; currentTeamName: string | null } | null }) => ({
        ...item,
        player_name: item.player?.gamertag || 'Unknown Player',
        position: item.player?.position || null,
        team: item.player?.currentTeamName || null,
      }))
      .sort((a, b) => a.player_name.localeCompare(b.player_name));
  },

  getByPosition: async (position: string): Promise<DraftPoolPlayer[]> => {
    const { data, error } = await supabase
      .from('draft_pool')
      .select(`
        *,
        player:players!draft_pool_player_id_fkey (
          gamertag,
          position,
          currentTeamName
        )
      `)
      .eq('league_id', LEGENDS_LEAGUE_ID)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching draft pool by position:', error);
      throw error;
    }
    
    // Filter by status = 'available' (case-insensitive) or null status, then by position
    const filteredData = (data || []).filter((item: DraftPoolRow & { player?: { gamertag: string; position: string | null; currentTeamName: string | null } | null }) => {
      const status = item.status?.toLowerCase();
      return (!status || status === 'available') && item.player?.position === position;
    });
    
    return filteredData
      .map((item: DraftPoolRow & { player?: { gamertag: string; position: string | null; currentTeamName: string | null } | null }) => ({
        ...item,
        player_name: item.player?.gamertag || 'Unknown Player',
        position: item.player?.position || null,
        team: item.player?.currentTeamName || null,
      }))
      .sort((a, b) => a.player_name.localeCompare(b.player_name));
  },

  search: async (searchTerm: string): Promise<DraftPoolPlayer[]> => {
    const { data, error } = await supabase
      .from('draft_pool')
      .select(`
        *,
        player:players!draft_pool_player_id_fkey (
          gamertag,
          position,
          currentTeamName
        )
      `)
      .eq('league_id', LEGENDS_LEAGUE_ID)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error searching draft pool:', error);
      throw error;
    }
    
    const searchLower = searchTerm.toLowerCase();
    
    // Filter by status = 'available' (case-insensitive) or null status, then by search term
    const filteredData = (data || []).filter((item: DraftPoolRow & { player?: { gamertag: string; position: string | null; currentTeamName: string | null } | null }) => {
      const status = item.status?.toLowerCase();
      const playerName = item.player?.gamertag?.toLowerCase() || '';
      return (!status || status === 'available') && playerName.includes(searchLower);
    });
    
    return filteredData
      .map((item: DraftPoolRow & { player?: { gamertag: string; position: string | null; currentTeamName: string | null } | null }) => ({
        ...item,
        player_name: item.player?.gamertag || 'Unknown Player',
        position: item.player?.position || null,
        team: item.player?.currentTeamName || null,
      }))
      .sort((a, b) => a.player_name.localeCompare(b.player_name));
  },

  markAsAssigned: async (playerId: string, authenticatedSupabase: typeof supabase, seasonId?: string): Promise<void> => {
    // Build update query - update all draft_pool entries for this player in this league
    // Use authenticated client for RLS policies
    // Don't filter by season since a player can only be in one draft pool entry per league
    const { data, error } = await authenticatedSupabase
      .from('draft_pool')
      .update({ 
        status: 'assigned',
        updated_at: new Date().toISOString(),
      })
      .eq('player_id', playerId)
      .eq('league_id', LEGENDS_LEAGUE_ID)
      .select();
    
    if (error) {
      console.error('Error marking player as assigned:', error);
      throw error;
    }
    
    // Log if no rows were updated (player might not be in draft pool)
    if (!data || data.length === 0) {
      console.warn(`Player ${playerId} not found in draft_pool for league ${LEGENDS_LEAGUE_ID}`);
    }
  },

  getEligiblePlayers: async (): Promise<EligiblePlayer[]> => {
    try {
      // First, get all combine match IDs
      let combineMatchIds: string[] = [];
      
      try {
        // Try v_matches_with_primary_context view first
        const { data: matches } = await supabase
          .from('v_matches_with_primary_context')
          .select('id, stage')
          .eq('league_id', LEGENDS_LEAGUE_ID)
          .eq('stage', 'Combine');
        
        if (matches) {
          combineMatchIds = matches.map((m: any) => m.id);
        }
      } catch (err) {
        // Fallback to matches table
        try {
          const { data: matches } = await supabase
            .from('matches')
            .select('id, stage')
            .eq('league_id', LEGENDS_LEAGUE_ID)
            .eq('stage', 'Combine');
          
          if (matches) {
            combineMatchIds = matches.map((m: any) => m.id);
          }
        } catch (err2) {
          console.log('Error fetching combine matches:', err2);
        }
      }

      // Count combine games per player
      const playerCombineGameCounts = new Map<string, number>();
      
      if (combineMatchIds.length > 0) {
        const { data: playerStats } = await supabase
          .from('player_stats')
          .select('player_id, match_id')
          .in('match_id', combineMatchIds);

        if (playerStats) {
          const playerMatchMap = new Map<string, Set<string>>();
          
          playerStats.forEach((stat: any) => {
            const playerId = stat.player_id;
            const matchId = stat.match_id;
            
            if (!playerId || !matchId) return;
            
            if (!playerMatchMap.has(playerId)) {
              playerMatchMap.set(playerId, new Set());
            }
            playerMatchMap.get(playerId)!.add(matchId);
          });

          // Count unique matches per player
          playerMatchMap.forEach((matchIds, playerId) => {
            playerCombineGameCounts.set(playerId, matchIds.size);
          });
        }
      }

      // Get players from draft_pool with status = 'eligible' or all players to check combine games
      const { data: draftPoolData, error } = await supabase
        .from('draft_pool')
        .select(`
          *,
          player:players!draft_pool_player_id_fkey (
            gamertag,
            position,
            currentTeamName
          )
        `)
        .eq('league_id', LEGENDS_LEAGUE_ID)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching draft pool for eligible players:', error);
        throw error;
      }

      // Filter and map eligible players
      const eligiblePlayersMap = new Map<string, EligiblePlayer>();

      (draftPoolData || []).forEach((item: DraftPoolRow & { player?: { gamertag: string; position: string | null; currentTeamName: string | null } | null }) => {
        const status = item.status?.toLowerCase();
        const playerId = item.player_id;
        const combineGames = playerCombineGameCounts.get(playerId) || 0;
        const hasEligibleStatus = status === 'eligible';
        const hasEnoughCombineGames = combineGames >= 5;

        // Player is eligible if they have status='eligible' OR 5+ combine games
        if (hasEligibleStatus || hasEnoughCombineGames) {
          let eligibilityReason: 'status' | 'combine_games' | 'both';
          if (hasEligibleStatus && hasEnoughCombineGames) {
            eligibilityReason = 'both';
          } else if (hasEligibleStatus) {
            eligibilityReason = 'status';
          } else {
            eligibilityReason = 'combine_games';
          }

          const player: EligiblePlayer = {
            ...item,
            player_name: item.player?.gamertag || 'Unknown Player',
            position: item.player?.position || null,
            team: item.player?.currentTeamName || null,
            combine_games: combineGames,
            eligibility_reason: eligibilityReason,
          };

          eligiblePlayersMap.set(playerId, player);
        }
      });

      // Convert map to array and sort
      return Array.from(eligiblePlayersMap.values())
        .sort((a, b) => a.player_name.localeCompare(b.player_name));
    } catch (error) {
      console.error('Error fetching eligible players:', error);
      throw error;
    }
  },
};

