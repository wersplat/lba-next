import { supabase } from '../lib/supabase';
import { LEGENDS_LEAGUE_ID } from './supabase';
import type { Database } from './supabase';

type PlayerRow = Database['public']['Tables']['players']['Row'];
type PlayerPublicProfileRow = Database['public']['Views']['player_public_profile']['Row'];
type DraftPickRow = Database['public']['Tables']['draft_picks']['Row'];
type PlayerAwardRow = Database['public']['Tables']['player_awards']['Row'];
type PlayerStatsRow = Database['public']['Tables']['player_stats']['Row'];
type TeamRow = Database['public']['Tables']['teams']['Row'];

export type PlayerProfile = {
  // Basic Info
  id: string;
  gamertag: string;
  alternate_gamertag: string | null;
  position: string | null;
  currentTeamName: string | null;
  current_team_id: string | null;
  is_rookie: boolean | null;
  salary_tier: string | null;
  created_at: string | null;
  
  // Social Media
  twitch: string | null;
  twitter_id: string | null;
  discord_id: string | null;
  discord_id_no: string | null;
  crewName: string | null;
  crew_affiliation: string | null;
  
  // Stats from player_public_profile
  ppg: number | null;
  apg: number | null;
  rpg: number | null;
  bpg: number | null;
  spg: number | null;
  games_played: number | null;
  performance_score: number | null;
  player_rank_score: number | null;
  player_rp: number | null;
  monthly_value: number | null;
  
  // Draft Info
  draftPicks: Array<{
    id: string;
    pick_number: number;
    season_id: string | null;
    team_id: string;
    team_name: string | null;
    league_id: string | null;
    created_at: string | null;
  }>;
  
  // Awards
  awards: Array<{
    id: string;
    title: string;
    tier: string;
    awarded_at: string;
    season_id: string | null;
    match_id: string | null;
    asset_png_url: string | null;
    asset_svg_url: string | null;
    nft_mint_id: string | null;
  }>;
  
  // Recent Game Stats
  recentGames: Array<{
    id: string;
    match_id: string;
    points: number | null;
    assists: number | null;
    rebounds: number | null;
    steals: number | null;
    blocks: number | null;
    turnovers: number | null;
    fgm: number | null;
    fga: number | null;
    three_points_made: number | null;
    three_points_attempted: number | null;
    created_at: string | null;
  }>;
  
  // Team History (from draft picks and current team)
  teamHistory: Array<{
    team_id: string;
    team_name: string | null;
    team_logo: string | null;
    season_id: string | null;
    joined_at: string | null;
  }>;
};

export const playersApi = {
  getPlayerProfile: async (playerId: string): Promise<PlayerProfile | null> => {
    try {
      // Fetch basic player info
      const { data: playerData, error: playerError } = await supabase
        .from('players')
        .select('*')
        .eq('id', playerId)
        .single();
      
      if (playerError || !playerData) {
        console.error('Error fetching player:', playerError);
        return null;
      }
      
      const player = playerData as PlayerRow;
      
      // Fetch player public profile stats
      const { data: profileData } = await supabase
        .from('player_public_profile')
        .select('*')
        .eq('player_id', playerId)
        .single();
      
      const profile = profileData as PlayerPublicProfileRow | null;
      
      // Fetch draft picks
      const { data: draftPicksData } = await supabase
        .from('draft_picks')
        .select(`
          *,
          team:teams!draft_picks_team_id_fkey (
            id,
            name,
            logo_url
          )
        `)
        .eq('player_id', playerId)
        .order('pick_number', { ascending: true });
      
      const draftPicks = (draftPicksData || []).map((pick: any) => ({
        id: pick.id,
        pick_number: pick.pick_number,
        season_id: pick.season_id,
        team_id: pick.team_id,
        team_name: pick.team?.name || null,
        league_id: pick.league_id,
        created_at: pick.created_at,
      }));
      
      // Fetch player awards
      const { data: awardsData } = await supabase
        .from('player_awards')
        .select('*')
        .eq('player_id', playerId)
        .order('awarded_at', { ascending: false })
        .limit(50);
      
      const awards = (awardsData || []).map((award: PlayerAwardRow) => ({
        id: award.id,
        title: award.title,
        tier: award.tier,
        awarded_at: award.awarded_at,
        season_id: award.season_id,
        match_id: award.match_id,
        asset_png_url: award.asset_png_url,
        asset_svg_url: award.asset_svg_url,
        nft_mint_id: award.nft_mint_id,
      }));
      
      // Fetch recent game stats (last 10 games)
      const { data: recentGamesData } = await supabase
        .from('player_stats')
        .select('*')
        .eq('player_id', playerId)
        .order('created_at', { ascending: false })
        .limit(10);
      
      const recentGames = (recentGamesData || []).map((game: PlayerStatsRow) => ({
        id: game.id,
        match_id: game.match_id,
        points: game.points,
        assists: game.assists,
        rebounds: game.rebounds,
        steals: game.steals,
        blocks: game.blocks,
        turnovers: game.turnovers,
        fgm: game.fgm,
        fga: game.fga,
        three_points_made: game.three_points_made,
        three_points_attempted: game.three_points_attempted,
        created_at: game.created_at,
      }));
      
      // Build team history from draft picks and current team
      const teamHistoryMap = new Map<string, {
        team_id: string;
        team_name: string | null;
        team_logo: string | null;
        season_id: string | null;
        joined_at: string | null;
      }>();
      
      // Add teams from draft picks
      draftPicks.forEach((pick) => {
        if (pick.team_id && !teamHistoryMap.has(pick.team_id)) {
          const teamInfo = (draftPicksData || []).find((p: any) => p.team_id === pick.team_id);
          teamHistoryMap.set(pick.team_id, {
            team_id: pick.team_id,
            team_name: teamInfo?.team?.name || null,
            team_logo: teamInfo?.team?.logo_url || null,
            season_id: pick.season_id,
            joined_at: pick.created_at,
          });
        }
      });
      
      // Add current team if different
      if (player.current_team_id && !teamHistoryMap.has(player.current_team_id)) {
        const { data: currentTeamData } = await supabase
          .from('teams')
          .select('id, name, logo_url')
          .eq('id', player.current_team_id)
          .single();
        
        if (currentTeamData) {
          teamHistoryMap.set(player.current_team_id, {
            team_id: player.current_team_id,
            team_name: currentTeamData.name || null,
            team_logo: currentTeamData.logo_url || null,
            season_id: null,
            joined_at: null,
          });
        }
      }
      
      const teamHistory = Array.from(teamHistoryMap.values());
      
      return {
        id: player.id,
        gamertag: player.gamertag,
        alternate_gamertag: player.alternate_gamertag,
        position: player.position,
        currentTeamName: player.currentTeamName,
        current_team_id: player.current_team_id,
        is_rookie: player.is_rookie,
        salary_tier: player.salary_tier,
        created_at: player.created_at,
        twitch: player.twitch,
        twitter_id: player.twitter_id,
        discord_id: player.discord_id,
        discord_id_no: player.discord_id_no,
        crewName: player.crewName,
        crew_affiliation: player.crew_affiliation,
        ppg: profile?.ppg || null,
        apg: profile?.apg || null,
        rpg: profile?.rpg || null,
        bpg: profile?.bpg || null,
        spg: profile?.spg || null,
        games_played: profile?.games_played || null,
        performance_score: profile?.performance_score || null,
        player_rank_score: profile?.player_rank_score || null,
        player_rp: profile?.player_rp || null,
        monthly_value: profile?.monthly_value || null,
        draftPicks,
        awards,
        recentGames,
        teamHistory,
      };
    } catch (error) {
      console.error('Error fetching player profile:', error);
      return null;
    }
  },
};

