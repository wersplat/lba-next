import { supabase } from '../lib/supabase';
import { LEGENDS_LEAGUE_ID } from './leagues';

// Helper function to check if there's an active season
export const hasActiveSeason = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('league_seasons')
      .select('id')
      .eq('league_id', LEGENDS_LEAGUE_ID)
      .eq('is_active', true)
      .limit(1);
    
    if (error) {
      console.warn('Error checking for active season:', error);
      return false;
    }
    
    return data && data.length > 0;
  } catch (err) {
    console.warn('Error checking for active season:', err);
    return false;
  }
};

// Helper function to get current season ID for Legends Basketball Association
export const getCurrentSeasonId = async (): Promise<string | null> => {
  try {
    // First try to find an active season
    const { data: activeData, error: activeError } = await supabase
      .from('league_seasons')
      .select('id')
      .eq('league_id', LEGENDS_LEAGUE_ID)
      .eq('is_active', true)
      .order('start_date', { ascending: false })
      .limit(1);
    
    if (activeError) {
      console.warn('Error fetching active season:', activeError);
    }
    
    if (activeData && activeData.length > 0) {
      return activeData[0].id;
    }
    
    // If no active season, fall back to the most recent season (regardless of is_active status)
    const { data: recentData, error: recentError } = await supabase
      .from('league_seasons')
      .select('id')
      .eq('league_id', LEGENDS_LEAGUE_ID)
      .order('start_date', { ascending: false })
      .limit(1);
    
    if (recentError) {
      console.warn('Error fetching recent season:', recentError);
      return null;
    }
    
    if (!recentData || recentData.length === 0) {
      console.warn('Could not find any season for Legends Basketball Association');
      return null;
    }
    
    return recentData[0].id;
  } catch (err) {
    console.warn('Error fetching current season:', err);
    return null;
  }
};

