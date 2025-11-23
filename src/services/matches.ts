import { supabase } from '../lib/supabase';
import { LEGENDS_LEAGUE_ID } from './leagues';

export type Match = {
  id: string;
  match_date: string;
  team1_id: string;
  team2_id: string;
  team1_name?: string;
  team2_name?: string;
  team1_score?: number;
  team2_score?: number;
  winner_id?: string;
  created_at: string;
  boxscore_url?: string | null;
};

export const matchesApi = {
  getRecent: async (limit: number = 25): Promise<Match[]> => {
    // Try v_matches_with_primary_context first, fallback to matches table
    let data, error;
    
    try {
      const result = await supabase
        .from('v_matches_with_primary_context')
        .select(`
          id,
          played_at,
          team_a_id,
          team_b_id,
          score_a,
          score_b,
          winner_id,
          league_id,
          boxscore_url,
          team1:teams!v_matches_with_primary_context_team_a_id_fkey(name),
          team2:teams!v_matches_with_primary_context_team_b_id_fkey(name)
        `)
        .eq('league_id', LEGENDS_LEAGUE_ID)
        .order('played_at', { ascending: false })
        .limit(limit);
      data = result.data;
      error = result.error;
      
      // If the view query failed, try fallback to matches table
      if (error) {
        const fallbackResult = await supabase
          .from('matches')
          .select(`
            id,
            played_at,
            team_a_id,
            team_b_id,
            score_a,
            score_b,
            winner_id,
            league_id,
            boxscore_url,
            team1:teams!matches_team_a_id_fkey(name),
            team2:teams!matches_team_b_id_fkey(name)
          `)
          .eq('league_id', LEGENDS_LEAGUE_ID)
          .order('played_at', { ascending: false })
          .limit(limit);
        data = fallbackResult.data;
        error = fallbackResult.error;
      }
    } catch (err) {
      // If both queries fail, log the error and return empty array
      console.error('Exception fetching matches:', err);
      return [];
    }
    
    if (error) {
      console.error('Error fetching matches:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        fullError: error
      });
      // Return empty array instead of throwing to prevent breaking the UI
      return [];
    }
    
    // Transform the data to flatten team names
    return (data || []).map((match: any) => {
      // Handle team data - it might be an array or single object
      const team1Name = Array.isArray(match.team1)
        ? (match.team1[0]?.name || 'Unknown Team')
        : (match.team1?.name || match.team_a?.name || 'Unknown Team');
      
      const team2Name = Array.isArray(match.team2)
        ? (match.team2[0]?.name || 'Unknown Team')
        : (match.team2?.name || match.team_b?.name || 'Unknown Team');
      
      return {
        id: match.id,
        match_date: match.played_at || '',
        team1_id: match.team_a_id || match.team1_id || '',
        team2_id: match.team_b_id || match.team2_id || '',
        team1_name: team1Name,
        team2_name: team2Name,
        team1_score: match.score_a || match.team1_score || undefined,
        team2_score: match.score_b || match.team2_score || undefined,
        winner_id: match.winner_id || undefined,
        created_at: match.played_at || '',
        boxscore_url: match.boxscore_url || null,
      };
    });
  },

  getCombineMatches: async (limit: number = 25): Promise<Match[]> => {
    // Try v_matches_with_primary_context first, fallback to matches table
    let data, error;
    
    try {
      const result = await supabase
        .from('v_matches_with_primary_context')
        .select(`
          id,
          played_at,
          team_a_id,
          team_b_id,
          score_a,
          score_b,
          winner_id,
          league_id,
          stage,
          boxscore_url,
          team1:teams!v_matches_with_primary_context_team_a_id_fkey(name),
          team2:teams!v_matches_with_primary_context_team_b_id_fkey(name)
        `)
        .eq('league_id', LEGENDS_LEAGUE_ID)
        .eq('stage', 'Combine')
        .order('played_at', { ascending: false })
        .limit(limit);
      data = result.data;
      error = result.error;
      
      // If the view query failed, try fallback to matches table
      if (error) {
        const fallbackResult = await supabase
          .from('matches')
          .select(`
            id,
            played_at,
            team_a_id,
            team_b_id,
            score_a,
            score_b,
            winner_id,
            league_id,
          stage,
          boxscore_url,
          team1:teams!matches_team_a_id_fkey(name),
          team2:teams!matches_team_b_id_fkey(name)
          `)
          .eq('league_id', LEGENDS_LEAGUE_ID)
          .eq('stage', 'Combine')
          .order('played_at', { ascending: false })
          .limit(limit);
        data = fallbackResult.data;
        error = fallbackResult.error;
      }
    } catch (err) {
      // If both queries fail, log the error and return empty array
      console.error('Exception fetching combine matches:', err);
      return [];
    }
    
    if (error) {
      console.error('Error fetching combine matches:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        fullError: error
      });
      // Return empty array instead of throwing to prevent breaking the UI
      return [];
    }
    
    // Transform the data to flatten team names
    return (data || []).map((match: any) => {
      // Handle team data - it might be an array or single object
      const team1Name = Array.isArray(match.team1)
        ? (match.team1[0]?.name || 'Unknown Team')
        : (match.team1?.name || match.team_a?.name || 'Unknown Team');
      
      const team2Name = Array.isArray(match.team2)
        ? (match.team2[0]?.name || 'Unknown Team')
        : (match.team2?.name || match.team_b?.name || 'Unknown Team');
      
      return {
        id: match.id,
        match_date: match.played_at || '',
        team1_id: match.team_a_id || match.team1_id || '',
        team2_id: match.team_b_id || match.team2_id || '',
        team1_name: team1Name,
        team2_name: team2Name,
        team1_score: match.score_a || match.team1_score || undefined,
        team2_score: match.score_b || match.team2_score || undefined,
        winner_id: match.winner_id || undefined,
        created_at: match.played_at || '',
        boxscore_url: match.boxscore_url || null,
      };
    });
  },

  getLeagueMatches: async (limit: number = 25): Promise<Match[]> => {
    // Try v_matches_with_primary_context first, fallback to matches table
    let data, error;
    
    try {
      const result = await supabase
        .from('v_matches_with_primary_context')
        .select(`
          id,
          played_at,
          team_a_id,
          team_b_id,
          score_a,
          score_b,
          winner_id,
          league_id,
          stage,
          boxscore_url,
          team1:teams!v_matches_with_primary_context_team_a_id_fkey(name),
          team2:teams!v_matches_with_primary_context_team_b_id_fkey(name)
        `)
        .eq('league_id', LEGENDS_LEAGUE_ID)
        .order('played_at', { ascending: false })
        .limit(limit * 2); // Fetch more to account for filtering
      data = result.data;
      error = result.error;
      
      // If the view query failed, try fallback to matches table
      if (error) {
        const fallbackResult = await supabase
          .from('matches')
          .select(`
            id,
            played_at,
            team_a_id,
            team_b_id,
            score_a,
            score_b,
            winner_id,
            league_id,
          stage,
          boxscore_url,
          team1:teams!matches_team_a_id_fkey(name),
          team2:teams!matches_team_b_id_fkey(name)
          `)
          .eq('league_id', LEGENDS_LEAGUE_ID)
          .order('played_at', { ascending: false })
          .limit(limit * 2); // Fetch more to account for filtering
        data = fallbackResult.data;
        error = fallbackResult.error;
      }
    } catch (err) {
      // If both queries fail, log the error and return empty array
      console.error('Exception fetching league matches:', err);
      return [];
    }
    
    if (error) {
      console.error('Error fetching league matches:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        fullError: error
      });
      // Return empty array instead of throwing to prevent breaking the UI
      return [];
    }
    
    // Filter out combine matches (stage !== 'Combine' or stage is null)
    const filteredData = (data || []).filter((match: any) => {
      const stage = match.stage;
      return !stage || stage !== 'Combine';
    }).slice(0, limit);
    
    // Transform the data to flatten team names
    return filteredData.map((match: any) => {
      // Handle team data - it might be an array or single object
      const team1Name = Array.isArray(match.team1)
        ? (match.team1[0]?.name || 'Unknown Team')
        : (match.team1?.name || match.team_a?.name || 'Unknown Team');
      
      const team2Name = Array.isArray(match.team2)
        ? (match.team2[0]?.name || 'Unknown Team')
        : (match.team2?.name || match.team_b?.name || 'Unknown Team');
      
      return {
        id: match.id,
        match_date: match.played_at || '',
        team1_id: match.team_a_id || match.team1_id || '',
        team2_id: match.team_b_id || match.team2_id || '',
        team1_name: team1Name,
        team2_name: team2Name,
        team1_score: match.score_a || match.team1_score || undefined,
        team2_score: match.score_b || match.team2_score || undefined,
        winner_id: match.winner_id || undefined,
        created_at: match.played_at || '',
        boxscore_url: match.boxscore_url || null,
      };
    });
  },

  getById: async (id: string): Promise<Match | null> => {
    let data: any, error;
    
    try {
      const result = await supabase
        .from('v_matches_with_primary_context')
        .select(`
          id,
          played_at,
          team_a_id,
          team_b_id,
          score_a,
          score_b,
          winner_id,
          league_id,
          boxscore_url,
          boxscore_url,
          team1:teams!v_matches_with_primary_context_team_a_id_fkey(name),
          team2:teams!v_matches_with_primary_context_team_b_id_fkey(name)
        `)
        .eq('id', id)
        .eq('league_id', LEGENDS_LEAGUE_ID)
        .single();
      data = result.data;
      error = result.error;
      
      // If the view query failed, try fallback to matches table
      if (error) {
        const fallbackResult = await supabase
          .from('matches')
          .select(`
            id,
            played_at,
            team_a_id,
            team_b_id,
            score_a,
            score_b,
            winner_id,
            league_id,
            boxscore_url,
          boxscore_url,
          team1:teams!matches_team_a_id_fkey(name),
          team2:teams!matches_team_b_id_fkey(name)
          `)
          .eq('id', id)
          .eq('league_id', LEGENDS_LEAGUE_ID)
          .single();
        data = fallbackResult.data;
        error = fallbackResult.error;
      }
    } catch (err) {
      // If both queries fail, log the error and return null
      console.error('Exception fetching match by id:', err);
      return null;
    }
    
    if (error) {
      console.error('Error fetching match by id:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        fullError: error
      });
      return null;
    }
    
    if (!data) return null;
    
    // Handle team data - it might be an array or single object
    const team1Name = Array.isArray(data.team1) 
      ? (data.team1[0]?.name || 'Unknown Team')
      : (data.team1?.name || data.team_a?.name || 'Unknown Team');
    
    const team2Name = Array.isArray(data.team2)
      ? (data.team2[0]?.name || 'Unknown Team')
      : (data.team2?.name || data.team_b?.name || 'Unknown Team');
    
    return {
      id: data.id,
      match_date: data.played_at || '',
      team1_id: data.team_a_id || data.team1_id || '',
      team2_id: data.team_b_id || data.team2_id || '',
      team1_name: team1Name,
      team2_name: team2Name,
      team1_score: data.score_a || data.team1_score || undefined,
      team2_score: data.score_b || data.team2_score || undefined,
      winner_id: data.winner_id || undefined,
      created_at: data.played_at || '',
      boxscore_url: data.boxscore_url || null,
    };
  },
};

