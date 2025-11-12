import { supabase } from '../lib/supabase';
import { LEGENDS_LEAGUE_ID } from './leagues';
import type { Database } from './supabase';

export type Team = {
  id: string;
  name: string;
  logo: string | null;
  created_at: string;
};

export const teamsApi = {
  getAll: async (): Promise<Team[]> => {
    const { data, error } = await supabase
      .from('lba_teams')
      .select('id, team_id, team_name, team_logo, created_at')
      .order('team_name');
    
    if (error) throw error;
    return (data || []).map(team => ({
      // Use team_id (references teams.id) instead of id (lba_teams.id) for draft picks FK
      id: team.team_id || team.id,
      name: team.team_name,
      logo: team.team_logo || null,
      created_at: team.created_at || new Date().toISOString(),
    }));
  },

  getById: async (id: string): Promise<Team | null> => {
    const { data, error } = await supabase
      .from('lba_teams')
      .select('id, team_id, team_name, team_logo, created_at')
      .eq('id', id)
      .single();
    
    if (error) return null;
    return {
      // Use team_id (references teams.id) instead of id (lba_teams.id) for draft picks FK
      id: data.team_id || data.id,
      name: data.team_name,
      logo: data.team_logo || null,
      created_at: data.created_at || new Date().toISOString(),
    };
  },
};

