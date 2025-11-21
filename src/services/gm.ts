import { supabase } from '../lib/supabase';
import type { Database } from './supabase';

export type GMAccoladeType = '2k' | 'real_life';

export type GMAccolade = {
  id: string;
  gm_id: string;
  title: string;
  description: string | null;
  type: GMAccoladeType;
  awarded_at: string;
  created_at: string;
};

export type GM2KExperience = {
  id: string;
  gm_id: string;
  league_name: string;
  season: string | null;
  team_name: string | null;
  role: string | null;
  achievements: string | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
};

export type GMProfile = {
  // Basic Info
  id: string;
  clerk_org_id: string | null;
  clerk_profile_id: string | null;
  player_id: string | null;
  lba_team_id: string | null;
  
  // Social Connections
  twitter: string | null;
  twitch: string | null;
  discord_id: string | null;
  discord_username: string | null;
  
  // Past 2K Experience
  past_2k_experience_text: string | null;
  past_2k_experience_json: Record<string, unknown> | null;
  
  // Team Stats
  total_wins: number;
  total_losses: number;
  championships: number;
  playoff_appearances: number;
  division_titles: number;
  conference_titles: number;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  
  // Related Data
  team: {
    id: string;
    team_id: string | null;
    team_name: string;
    team_logo: string | null;
    lba_division: string | null;
  } | null;
  
  player: {
    id: string;
    gamertag: string;
    position: string | null;
    currentTeamName: string | null;
  } | null;
  
  accolades: GMAccolade[];
  experience: GM2KExperience[];
};

export const gmApi = {
  getById: async (gmId: string): Promise<GMProfile | null> => {
    const { data: gm, error: gmError } = await supabase
      .from('lba_gm')
      .select(`
        *,
        team:lba_teams (
          id,
          team_id,
          team_name,
          team_logo,
          lba_division
        ),
        player:players (
          id,
          gamertag,
          position,
          currentTeamName
        )
      `)
      .eq('id', gmId)
      .single();
    
    if (gmError || !gm) return null;
    
    // Fetch accolades
    const { data: accolades, error: accoladesError } = await supabase
      .from('lba_gm_accolades')
      .select('*')
      .eq('gm_id', gmId)
      .order('awarded_at', { ascending: false });
    
    if (accoladesError) {
      console.error('Error fetching GM accolades:', accoladesError);
    }
    
    // Fetch 2K experience
    const { data: experience, error: experienceError } = await supabase
      .from('lba_gm_2k_experience')
      .select('*')
      .eq('gm_id', gmId)
      .order('start_date', { ascending: false });
    
    if (experienceError) {
      console.error('Error fetching GM experience:', experienceError);
    }
    
    return {
      id: gm.id,
      clerk_org_id: gm.clerk_org_id,
      clerk_profile_id: gm.clerk_profile_id,
      player_id: gm.player_id,
      lba_team_id: gm.lba_team_id,
      twitter: gm.twitter,
      twitch: gm.twitch,
      discord_id: gm.discord_id,
      discord_username: gm.discord_username,
      past_2k_experience_text: gm.past_2k_experience_text,
      past_2k_experience_json: gm.past_2k_experience_json as Record<string, unknown> | null,
      total_wins: gm.total_wins || 0,
      total_losses: gm.total_losses || 0,
      championships: gm.championships || 0,
      playoff_appearances: gm.playoff_appearances || 0,
      division_titles: gm.division_titles || 0,
      conference_titles: gm.conference_titles || 0,
      created_at: gm.created_at,
      updated_at: gm.updated_at,
      team: gm.team ? {
        id: gm.team.id,
        team_id: gm.team.team_id,
        team_name: gm.team.team_name,
        team_logo: gm.team.team_logo,
        lba_division: gm.team.lba_division,
      } : null,
      player: gm.player ? {
        id: gm.player.id,
        gamertag: gm.player.gamertag,
        position: gm.player.position,
        currentTeamName: gm.player.currentTeamName,
      } : null,
      accolades: (accolades || []) as GMAccolade[],
      experience: (experience || []) as GM2KExperience[],
    };
  },

  getByTeamId: async (teamId: string): Promise<GMProfile | null> => {
    const { data: gm, error } = await supabase
      .from('lba_gm')
      .select('id')
      .eq('lba_team_id', teamId)
      .single();
    
    if (error || !gm) return null;
    
    return gmApi.getById(gm.id);
  },

  getByClerkId: async (clerkOrgId?: string, clerkProfileId?: string): Promise<GMProfile | null> => {
    let query = supabase.from('lba_gm').select('id');
    
    if (clerkOrgId) {
      query = query.eq('clerk_org_id', clerkOrgId);
    } else if (clerkProfileId) {
      query = query.eq('clerk_profile_id', clerkProfileId);
    } else {
      return null;
    }
    
    const { data: gm, error } = await query.single();
    
    if (error || !gm) return null;
    
    return gmApi.getById(gm.id);
  },

  getByPlayerId: async (playerId: string): Promise<GMProfile | null> => {
    const { data: gm, error } = await supabase
      .from('lba_gm')
      .select('id')
      .eq('player_id', playerId)
      .single();
    
    if (error || !gm) return null;
    
    return gmApi.getById(gm.id);
  },
};

