import { supabase } from '../lib/supabase';

// Legends Basketball Association League ID
export const LEGENDS_LEAGUE_ID = 'ddf11c10-f58f-44c3-8f27-50cbad047c27';

export type LeagueInfo = {
  id: string;
  league: string | null;
  color_primary: string | null;
  color_secondary: string | null;
  color_accent: string | null;
  lg_logo_url: string | null;
  banner_url: string | null;
  lg_url: string | null;
  lg_discord: string | null;
  lg_rules_url: string | null;
  twitch_url: string | null;
  twitter_id: string | null;
  sponsor_info: string | null;
  theme_json: any | null;
  org_id: string | null;
  org_slug: string | null;
  created_at: string;
};

export const leaguesApi = {
  getLegendsLeagueInfo: async (): Promise<LeagueInfo | null> => {
    try {
      const { data, error } = await supabase
        .from('leagues_info')
        .select('*')
        .eq('id', LEGENDS_LEAGUE_ID)
        .single();

      if (error) {
        console.error('Error fetching league info:', error);
        return null;
      }

      return data as LeagueInfo;
    } catch (err) {
      console.error('Exception fetching league info:', err);
      return null;
    }
  },
};

