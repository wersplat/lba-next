import { supabase } from '../lib/supabase';
import { LEGENDS_LEAGUE_ID } from './leagues';
import { getCurrentSeasonId } from './seasons';

export type PrizePoolComponent = {
  id: string;
  season_id: string;
  base_pot: number;
  paid_tag_amount: number | null;
  hof_upa_contributions: number | null;
  created_at: string;
  updated_at: string;
};

export type SeasonPrizePool = {
  season_id: string;
  season_number: number;
  start_date: string;
  end_date: string;
  base_pot: number;
  paid_tag_amount: number | null;
  hof_upa_contributions: number | null;
  total_prize_pool: number;
};

export const prizePoolApi = {
  getCurrentSeasonPrizePool: async (): Promise<SeasonPrizePool | null> => {
    try {
      const currentSeasonId = await getCurrentSeasonId();
      
      if (!currentSeasonId) {
        return null;
      }

      const { data, error } = await supabase
        .from('prize_pool_components')
        .select(`
          *,
          league_seasons!inner (
            id,
            season_number,
            start_date,
            end_date
          )
        `)
        .eq('season_id', currentSeasonId)
        .single();

      if (error) {
        // If no prize pool component exists for this season, return null
        if (error.code === 'PGRST116') {
          return null;
        }
        console.warn('Error fetching current season prize pool:', error);
        return null;
      }

      if (!data) {
        return null;
      }

      const season = (data as any).league_seasons;
      const basePot = data.base_pot || 0;
      const paidTag = data.paid_tag_amount || 0;
      const hofUpa = data.hof_upa_contributions || 0;
      const total = basePot + paidTag + hofUpa;

      return {
        season_id: data.season_id,
        season_number: season.season_number,
        start_date: season.start_date,
        end_date: season.end_date,
        base_pot: basePot,
        paid_tag_amount: data.paid_tag_amount,
        hof_upa_contributions: data.hof_upa_contributions,
        total_prize_pool: total,
      };
    } catch (err) {
      console.warn('Error fetching current season prize pool:', err);
      return null;
    }
  },

  getAllSeasonPrizePools: async (): Promise<SeasonPrizePool[]> => {
    try {
      const { data, error } = await supabase
        .from('league_seasons')
        .select(`
          id,
          season_number,
          start_date,
          end_date,
          prize_pool_components (
            base_pot,
            paid_tag_amount,
            hof_upa_contributions
          )
        `)
        .eq('league_id', LEGENDS_LEAGUE_ID)
        .order('season_number', { ascending: false });

      if (error) {
        console.warn('Error fetching all season prize pools:', error);
        return [];
      }

      if (!data || data.length === 0) {
        return [];
      }

      return data.map((season: any) => {
        const component = season.prize_pool_components?.[0] || null;
        const basePot = component?.base_pot || 0;
        const paidTag = component?.paid_tag_amount || 0;
        const hofUpa = component?.hof_upa_contributions || 0;
        const total = basePot + paidTag + hofUpa;

        return {
          season_id: season.id,
          season_number: season.season_number,
          start_date: season.start_date,
          end_date: season.end_date,
          base_pot: basePot,
          paid_tag_amount: component?.paid_tag_amount || null,
          hof_upa_contributions: component?.hof_upa_contributions || null,
          total_prize_pool: total,
        };
      });
    } catch (err) {
      console.warn('Error fetching all season prize pools:', err);
      return [];
    }
  },
};

