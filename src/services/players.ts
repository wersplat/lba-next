import { supabase } from '../lib/supabase';
import { LEGENDS_LEAGUE_ID } from './leagues';
import { getCurrentSeasonId } from './seasons';
import type { Database } from './supabase';

// League ID for statistics filtering (same as STATS_LEAGUE_ID)
const STATS_LEAGUE_ID = 'ddf11c10-f58f-44c3-8f27-50cbad047c27';

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
    league_name: string | null;
    season_number: number | null;
    team_name: string | null;
    league_id: string | null;
    stage: string | null;
  }>;
  
  // League-specific stats (from scoped league)
  leagueStats: {
    ppg: number | null;
    apg: number | null;
    rpg: number | null;
    bpg: number | null;
    spg: number | null;
    games_played: number;
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
      league_name: string | null;
      season_number: number | null;
      team_name: string | null;
    }>;
  };
  
  // Outside league stats (non-league games, excluding combine)
  outsideLeagueStats: {
    ppg: number | null;
    apg: number | null;
    rpg: number | null;
    bpg: number | null;
    spg: number | null;
    games_played: number;
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
      league_name: string | null;
      season_number: number | null;
      team_name: string | null;
      stage: string | null;
    }>;
  };
  
  // Combine stats (combine games from scoped league)
  combineStats: {
    ppg: number | null;
    apg: number | null;
    rpg: number | null;
    bpg: number | null;
    spg: number | null;
    games_played: number;
    fg_percentage: number | null;
    three_point_percentage: number | null;
    ft_percentage: number | null;
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
      ftm: number | null;
      fta: number | null;
      three_points_made: number | null;
      three_points_attempted: number | null;
      created_at: string | null;
      league_name: string | null;
      season_number: number | null;
      team_name: string | null;
    }>;
  };
  
  // Team History (from draft picks and current team)
  teamHistory: Array<{
    team_id: string;
    team_name: string | null;
    team_logo: string | null;
    season_id: string | null;
    joined_at: string | null;
    team_type: 'lba' | 'regular';
  }>;
  
  // LBA Team History (from lba_teams)
  lbaTeamHistory: Array<{
    team_id: string;
    team_name: string | null;
    team_logo: string | null;
    season_id: string | null;
    joined_at: string | null;
  }>;
  
  // Draft Pool Status
  draftPoolStatus: {
    status: string | null;
    combine_games: number;
    eligibility_reason: 'status' | 'combine_games' | 'both' | null;
    is_eligible: boolean;
  } | null;
};

// Legacy Player type for draft/rankings (different from PlayerProfile)
export type Player = {
  id: string;
  name: string;
  position: string;
  team: string;
  available: boolean;
  photo_url?: string | null;
  created_at: string;
};

export const playersApi = {
  getAll: async (): Promise<Player[]> => {
    // Fetch from draft_pool filtered by league_id and status = 'available'
    const { data, error } = await supabase
      .from('draft_pool')
      .select(`
        player_id,
        player:players!draft_pool_player_id_fkey (
          id,
          gamertag,
          position,
          currentTeamName,
          created_at
        )
      `)
      .eq('league_id', LEGENDS_LEAGUE_ID)
      .eq('status', 'available')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    type DraftPoolWithPlayer = {
      player_id: string;
      player: {
        id: string;
        gamertag: string;
        position: string | null;
        currentTeamName: string | null;
        created_at: string | null;
      } | null;
    };
    
    return ((data || []) as unknown as DraftPoolWithPlayer[])
      .map((item) => {
        const player = item.player;
        if (!player) return null;
        return {
          id: player.id,
          name: player.gamertag,
          position: player.position || '',
          team: player.currentTeamName || '',
          available: true,
          created_at: player.created_at || new Date().toISOString(),
        };
      })
      .filter((p): p is Player => p !== null)
      .sort((a, b) => a.name.localeCompare(b.name));
  },

  getAvailable: async (): Promise<Player[]> => {
    // Fetch from draft_pool filtered by league_id and status = 'available'
    const { data, error } = await supabase
      .from('draft_pool')
      .select(`
        player_id,
        player:players!draft_pool_player_id_fkey (
          id,
          gamertag,
          position,
          currentTeamName,
          created_at
        )
      `)
      .eq('league_id', LEGENDS_LEAGUE_ID)
      .eq('status', 'available')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    type DraftPoolWithPlayer = {
      player_id: string;
      player: {
        id: string;
        gamertag: string;
        position: string | null;
        currentTeamName: string | null;
        created_at: string | null;
      } | null;
    };
    
    return ((data || []) as unknown as DraftPoolWithPlayer[])
      .map((item) => {
        const player = item.player;
        if (!player) return null;
        return {
          id: player.id,
          name: player.gamertag,
          position: player.position || '',
          team: player.currentTeamName || '',
          available: true,
          created_at: player.created_at || new Date().toISOString(),
        };
      })
      .filter((p): p is Player => p !== null)
      .sort((a, b) => a.name.localeCompare(b.name));
  },

  draftPlayer: async (playerId: string, teamId: string, pickNumber: number, authenticatedSupabase?: typeof supabase): Promise<void> => {
    // Get player details first
    const { data: player, error: playerError } = await supabase
      .from('players')
      .select('id, gamertag, position')
      .eq('id', playerId)
      .single();
    
    if (playerError || !player) {
      throw new Error('Player not found');
    }

    // Get current season ID
    const seasonId = await getCurrentSeasonId();

    // Create draft pick with league_id and season_id
    const { error: pickError } = await supabase
      .from('draft_picks')
      .insert([
        {
          pick_number: pickNumber,
          team_id: teamId,
          player_id: playerId,
          player_name: player.gamertag,
          player_position: player.position || '',
          league_id: LEGENDS_LEAGUE_ID,
          season_id: seasonId,
        },
      ]);
    
    if (pickError) throw pickError;

    // Mark player as assigned in draft pool (requires authenticated client)
    if (authenticatedSupabase) {
      const { draftPoolApi } = await import('./draftPool');
      try {
        await draftPoolApi.markAsAssigned(playerId, authenticatedSupabase, seasonId || undefined);
      } catch (error) {
        // Log error but don't fail the draft if draft pool update fails
        // The draft pick was created successfully, so we continue
        console.error('Failed to mark player as assigned in draft pool:', error);
      }
    } else {
      console.warn('Authenticated supabase client not provided, skipping draft pool update');
    }
  },

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
      
      // Fetch draft picks with teams (draft_picks.team_id FK points to teams.id)
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
      
      // Fetch corresponding lba_teams data for each team_id
      const teamIds = [...new Set((draftPicksData || []).map((pick: any) => pick.team_id).filter(Boolean))];
      const { data: lbaTeamsData } = teamIds.length > 0 ? await supabase
        .from('lba_teams')
        .select('id, team_id, team_name, team_logo')
        .in('team_id', teamIds) : { data: [] };
      
      // Create a map of team_id -> lba_team data
      const lbaTeamsMap = new Map((lbaTeamsData || []).map((lt: any) => [lt.team_id, lt]));
      
      const draftPicks = (draftPicksData || []).map((pick: any) => {
        const lbaTeam = pick.team_id ? lbaTeamsMap.get(pick.team_id) : null;
        return {
          id: pick.id,
          pick_number: pick.pick_number,
          season_id: pick.season_id,
          team_id: pick.team_id,
          team_name: lbaTeam?.team_name || pick.team?.name || null,
          league_id: pick.league_id,
          created_at: pick.created_at,
        };
      });
      
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
      
      // Fetch recent game stats with league, season, team, and stage info
      const { data: recentGamesData } = await supabase
        .from('player_stats')
        .select(`
          *,
          match:matches!player_stats_match_id_fkey (
            league_id,
            stage,
            season_id,
            season:league_seasons!matches_season_id_fkey (
              league_name,
              season_number
            )
          ),
          team:teams!player_stats_team_id_fkey (
            name
          )
        `)
        .eq('player_id', playerId)
        .order('created_at', { ascending: false })
        .limit(50); // Fetch more to separate into league and outside league
      
      const recentGames = (recentGamesData || []).map((game: any) => {
        // Handle match as array or single object
        const match = Array.isArray(game.match) ? game.match[0] : game.match;
        // Handle season as array or single object
        const season = match?.season ? (Array.isArray(match.season) ? match.season[0] : match.season) : null;
        // Handle team as array or single object
        const team = Array.isArray(game.team) ? game.team[0] : game.team;
        return {
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
          ftm: game.ftm,
          fta: game.fta,
          three_points_made: game.three_points_made,
          three_points_attempted: game.three_points_attempted,
          created_at: game.created_at,
          league_name: season?.league_name || null,
          season_number: season?.season_number || null,
          team_name: team?.name || null,
          league_id: match?.league_id || null,
          stage: match?.stage || null,
        };
      });
      
      // Separate games into league stats, combine stats, and outside league stats
      const leagueGames = recentGames.filter((game) => 
        game.league_id === STATS_LEAGUE_ID && game.stage !== 'Combine'
      );
      const combineGames = recentGames.filter((game) => 
        game.league_id === STATS_LEAGUE_ID && game.stage === 'Combine'
      );
      const outsideLeagueGames = recentGames.filter((game) => 
        game.league_id !== STATS_LEAGUE_ID && game.stage !== 'Combine'
      );
      
      // Calculate league stats averages
      const calculateAverages = (games: typeof recentGames) => {
        if (games.length === 0) {
          return {
            ppg: null,
            apg: null,
            rpg: null,
            bpg: null,
            spg: null,
            games_played: 0,
          };
        }
        
        const totals = games.reduce((acc, game) => ({
          points: acc.points + (game.points || 0),
          assists: acc.assists + (game.assists || 0),
          rebounds: acc.rebounds + (game.rebounds || 0),
          blocks: acc.blocks + (game.blocks || 0),
          steals: acc.steals + (game.steals || 0),
        }), { points: 0, assists: 0, rebounds: 0, blocks: 0, steals: 0 });
        
        const gameCount = games.length;
        return {
          ppg: totals.points / gameCount,
          apg: totals.assists / gameCount,
          rpg: totals.rebounds / gameCount,
          bpg: totals.blocks / gameCount,
          spg: totals.steals / gameCount,
          games_played: gameCount,
        };
      };
      
      const leagueStatsData = calculateAverages(leagueGames);
      const outsideLeagueStatsData = calculateAverages(outsideLeagueGames);
      
      // Calculate combine stats with shooting percentages
      const calculateCombineStats = (games: Array<typeof recentGames[0] & { ftm?: number | null; fta?: number | null }>) => {
        if (games.length === 0) {
          return {
            ppg: null,
            apg: null,
            rpg: null,
            bpg: null,
            spg: null,
            games_played: 0,
            fg_percentage: null,
            three_point_percentage: null,
            ft_percentage: null,
          };
        }
        
        const totals = games.reduce((acc, game: any) => ({
          points: acc.points + (game.points || 0),
          assists: acc.assists + (game.assists || 0),
          rebounds: acc.rebounds + (game.rebounds || 0),
          blocks: acc.blocks + (game.blocks || 0),
          steals: acc.steals + (game.steals || 0),
          fgm: acc.fgm + (game.fgm || 0),
          fga: acc.fga + (game.fga || 0),
          ftm: acc.ftm + (game.ftm || 0),
          fta: acc.fta + (game.fta || 0),
          three_points_made: acc.three_points_made + (game.three_points_made || 0),
          three_points_attempted: acc.three_points_attempted + (game.three_points_attempted || 0),
        }), { 
          points: 0, assists: 0, rebounds: 0, blocks: 0, steals: 0,
          fgm: 0, fga: 0, ftm: 0, fta: 0, three_points_made: 0, three_points_attempted: 0
        });
        
        const gameCount = games.length;
        return {
          ppg: totals.points / gameCount,
          apg: totals.assists / gameCount,
          rpg: totals.rebounds / gameCount,
          bpg: totals.blocks / gameCount,
          spg: totals.steals / gameCount,
          games_played: gameCount,
          fg_percentage: totals.fga > 0 ? (totals.fgm / totals.fga) * 100 : null,
          three_point_percentage: totals.three_points_attempted > 0 
            ? (totals.three_points_made / totals.three_points_attempted) * 100 
            : null,
          ft_percentage: totals.fta > 0 ? (totals.ftm / totals.fta) * 100 : null,
        };
      };
      
      const combineStatsData = calculateCombineStats(combineGames);
      
      // Format games for return (keep league_id and stage for recentGames)
      const formattedRecentGames = recentGames.slice(0, 10).map((game) => ({
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
        league_name: game.league_name,
        season_number: game.season_number,
        team_name: game.team_name,
        league_id: game.league_id,
        stage: game.stage,
      }));
      
      // Format league games
      const formattedLeagueGames = leagueGames.slice(0, 10).map(({ league_id, stage, ...rest }) => rest);
      
      // Format outside league games
      const formattedOutsideLeagueGames = outsideLeagueGames.slice(0, 10).map((game) => ({
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
        league_name: game.league_name,
        season_number: game.season_number,
        team_name: game.team_name,
        stage: game.stage,
      }));
      
      // Format combine games
      const formattedCombineGames = combineGames.slice(0, 10).map((game) => ({
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
        ftm: game.ftm,
        fta: game.fta,
        three_points_made: game.three_points_made,
        three_points_attempted: game.three_points_attempted,
        created_at: game.created_at,
        league_name: game.league_name,
        season_number: game.season_number,
        team_name: game.team_name,
      }));
      
      // Build regular team history (for teams from 'teams' table)
      const teamHistoryMap = new Map<string, {
        team_id: string;
        team_name: string | null;
        team_logo: string | null;
        season_id: string | null;
        joined_at: string | null;
        team_type: 'regular';
      }>();
      
      // Add current regular team if it exists in the 'teams' table
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
            team_type: 'regular',
          });
        }
      }
      
      // Build LBA team history from draft picks
      // Note: draft_picks.team_id FK points to teams.id, which matches lba_teams.team_id
      const lbaTeamHistoryMap = new Map<string, {
        team_id: string;
        team_name: string | null;
        team_logo: string | null;
        season_id: string | null;
        joined_at: string | null;
      }>();
      
      // Add LBA teams from draft picks (using data already fetched above)
      if (draftPicksData) {
        draftPicksData.forEach((pick: any) => {
          if (pick.team_id && !lbaTeamHistoryMap.has(pick.team_id)) {
            const lbaTeam = lbaTeamsMap.get(pick.team_id);
            lbaTeamHistoryMap.set(pick.team_id, {
              team_id: pick.team_id,
              team_name: lbaTeam?.team_name || pick.team?.name || null,
              team_logo: lbaTeam?.team_logo || pick.team?.logo_url || null,
              season_id: pick.season_id,
              joined_at: pick.created_at,
            });
          }
        });
      }
      
      // Add current LBA team if different (check by team_id, not lba_teams.id)
      if (player.current_team_id && !lbaTeamHistoryMap.has(player.current_team_id)) {
        // First check if it's a teams.id that has a corresponding lba_team
        const { data: currentLbaTeamData } = await supabase
          .from('lba_teams')
          .select('id, team_id, team_name, team_logo')
          .eq('team_id', player.current_team_id)
          .single();
        
        if (currentLbaTeamData) {
          lbaTeamHistoryMap.set(player.current_team_id, {
            team_id: player.current_team_id,
            team_name: currentLbaTeamData.team_name || null,
            team_logo: currentLbaTeamData.team_logo || null,
            season_id: null,
            joined_at: null,
          });
        }
      }
      
      const teamHistory = Array.from(teamHistoryMap.values());
      const lbaTeamHistory = Array.from(lbaTeamHistoryMap.values());
      
      // Fetch draft pool status and calculate combine games
      let draftPoolStatus: PlayerProfile['draftPoolStatus'] = null;
      try {
        // Get draft pool entry for this player
        const { data: draftPoolData } = await supabase
          .from('draft_pool')
          .select('status')
          .eq('player_id', playerId)
          .eq('league_id', LEGENDS_LEAGUE_ID)
          .single();
        
        // Count combine games (same logic as draftPoolApi.getEligiblePlayers)
        let combineMatchIds: string[] = [];
        try {
          const { data: matches } = await supabase
            .from('v_matches_with_primary_context')
            .select('id, stage')
            .eq('league_id', LEGENDS_LEAGUE_ID)
            .eq('stage', 'Combine');
          
          if (matches) {
            combineMatchIds = matches.map((m: any) => m.id);
          }
        } catch (err) {
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
        
        let combineGames = 0;
        if (combineMatchIds.length > 0) {
          const { data: playerStats } = await supabase
            .from('player_stats')
            .select('match_id')
            .eq('player_id', playerId)
            .in('match_id', combineMatchIds);
          
          if (playerStats) {
            const uniqueMatches = new Set(playerStats.map((stat: any) => stat.match_id));
            combineGames = uniqueMatches.size;
          }
        }
        
        const status = draftPoolData?.status?.toLowerCase() || null;
        const hasEligibleStatus = status === 'eligible';
        const hasEnoughCombineGames = combineGames >= 5;
        const isEligible = hasEligibleStatus || hasEnoughCombineGames;
        
        let eligibilityReason: 'status' | 'combine_games' | 'both' | null = null;
        if (isEligible) {
          if (hasEligibleStatus && hasEnoughCombineGames) {
            eligibilityReason = 'both';
          } else if (hasEligibleStatus) {
            eligibilityReason = 'status';
          } else {
            eligibilityReason = 'combine_games';
          }
        }
        
        draftPoolStatus = {
          status: draftPoolData?.status || null,
          combine_games: combineGames,
          eligibility_reason: eligibilityReason,
          is_eligible: isEligible,
        };
      } catch (error) {
        console.log('Error fetching draft pool status:', error);
        // draftPoolStatus remains null if there's an error
      }
      
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
        recentGames: formattedRecentGames,
        leagueStats: {
          ...leagueStatsData,
          recentGames: formattedLeagueGames,
        },
        outsideLeagueStats: {
          ...outsideLeagueStatsData,
          recentGames: formattedOutsideLeagueGames,
        },
        combineStats: {
          ...combineStatsData,
          recentGames: formattedCombineGames,
        },
        teamHistory,
        lbaTeamHistory,
        draftPoolStatus,
      };
    } catch (error) {
      console.error('Error fetching player profile:', error);
      return null;
    }
  },
};

