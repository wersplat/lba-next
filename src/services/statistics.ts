import { supabase } from '../lib/supabase';

// League ID for statistics filtering
const STATS_LEAGUE_ID = 'ddf11c10-f58f-44c3-8f27-50cbad047c27';

export type LeagueStatistics = {
  total_teams: number;
  total_players: number;
  total_matches: number;
  average_points_per_game: number;
  top_scorer?: {
    player_id: string;
    player_name: string;
    total_points: number;
  };
};

export type CombinePlayerStats = {
  player_id: string;
  player_name: string;
  games_played: number;
  total_points: number;
  total_assists: number;
  total_rebounds: number;
  total_steals: number;
  total_blocks: number;
  total_turnovers: number;
  total_fgm: number;
  total_fga: number;
  total_ftm: number;
  total_fta: number;
  total_three_points_made: number;
  total_three_points_attempted: number;
  ppg: number;
  apg: number;
  rpg: number;
  spg: number;
  bpg: number;
  tpg: number;
  fg_percentage: number;
  ft_percentage: number;
  three_point_percentage: number;
};

export const statisticsApi = {
  getLeagueStats: async (): Promise<LeagueStatistics> => {
    // Get total teams filtered by league_id through draft_picks or league_team_rosters
    let teamCount = 0;
    try {
      // Try to get unique teams from draft_picks for this league
      const { data: draftPicks } = await supabase
        .from('draft_picks')
        .select('team_id')
        .eq('league_id', STATS_LEAGUE_ID);
      
      if (draftPicks) {
        const uniqueTeamIds = new Set(draftPicks.map((pick: any) => pick.team_id).filter(Boolean));
        teamCount = uniqueTeamIds.size;
      }
    } catch (err) {
      console.log('Error fetching teams from draft_picks, trying league_team_rosters');
      try {
        // Fallback: try league_team_rosters
        const { data: rosters } = await supabase
          .from('league_team_rosters')
          .select('team_id')
          .eq('league_id', STATS_LEAGUE_ID);
        
        if (rosters) {
          const uniqueTeamIds = new Set(rosters.map((roster: any) => roster.team_id).filter(Boolean));
          teamCount = uniqueTeamIds.size;
        }
      } catch (err2) {
        console.log('Error fetching teams from league_team_rosters');
      }
    }
    
    // Get total players filtered by league_id through draft_picks
    let playerCount = 0;
    try {
      const { data: draftPicks } = await supabase
        .from('draft_picks')
        .select('player_id')
        .eq('league_id', STATS_LEAGUE_ID);
      
      if (draftPicks) {
        const uniquePlayerIds = new Set(draftPicks.map((pick: any) => pick.player_id).filter(Boolean));
        playerCount = uniquePlayerIds.size;
      }
    } catch (err) {
      console.log('Error fetching players from draft_picks');
    }
    
    // Get total matches filtered by league_id
    let matchCount = 0;
    try {
      const result = await supabase
        .from('v_matches_with_primary_context')
        .select('*', { count: 'exact', head: true })
        .eq('league_id', STATS_LEAGUE_ID);
      matchCount = result.count || 0;
    } catch (err) {
      // Fallback to matches table if view doesn't exist
      const result = await supabase
        .from('matches')
        .select('*', { count: 'exact', head: true })
        .eq('league_id', STATS_LEAGUE_ID);
      matchCount = result.count || 0;
    }
    
    // Get player stats for top scorer filtered by league (if player_stats table exists)
    let topScorer = undefined;
    try {
      // Try to get top scorer from league-specific player stats
      const { data: playerStats } = await supabase
        .from('player_stats')
        .select('player_id, player_name, points, match_id')
        .order('points', { ascending: false })
        .limit(100);
      
      if (playerStats && playerStats.length > 0) {
        // Filter by matches in the specified league
        let matchIds;
        try {
          const result = await supabase
            .from('v_matches_with_primary_context')
            .select('id')
            .eq('league_id', STATS_LEAGUE_ID);
          matchIds = result.data;
        } catch (err) {
          const result = await supabase
            .from('matches')
            .select('id')
            .eq('league_id', STATS_LEAGUE_ID);
          matchIds = result.data;
        }
        
        const leagueMatchIds = new Set((matchIds || []).map((m: any) => m.id));
        const leaguePlayerStats = playerStats.filter((stat: any) => 
          leagueMatchIds.has(stat.match_id)
        );
        
        if (leaguePlayerStats.length > 0) {
          // Find player with most total points
          const playerTotals = new Map<string, { name: string; total: number }>();
          leaguePlayerStats.forEach((stat: any) => {
            const current = playerTotals.get(stat.player_id) || { name: stat.player_name || 'Unknown', total: 0 };
            playerTotals.set(stat.player_id, {
              name: current.name,
              total: current.total + (stat.points || 0),
            });
          });
          
          const topPlayer = Array.from(playerTotals.entries())
            .sort((a, b) => b[1].total - a[1].total)[0];
          
          if (topPlayer) {
            topScorer = {
              player_id: topPlayer[0],
              player_name: topPlayer[1].name,
              total_points: topPlayer[1].total,
            };
          }
        }
      }
    } catch (error) {
      // Table might not exist, ignore
      console.log('player_stats table not available');
    }
    
    // Calculate average points (if available) filtered by league
    let avgPoints = 0;
    try {
      let matchIds;
      try {
        const result = await supabase
          .from('v_matches_with_primary_context')
          .select('id')
          .eq('league_id', STATS_LEAGUE_ID);
        matchIds = result.data;
      } catch (err) {
        const result = await supabase
          .from('matches')
          .select('id')
          .eq('league_id', STATS_LEAGUE_ID);
        matchIds = result.data;
      }
      
      const leagueMatchIds = (matchIds || []).map((m: any) => m.id);
      
      if (leagueMatchIds.length > 0) {
        const { data: allStats } = await supabase
          .from('player_stats')
          .select('points')
          .in('match_id', leagueMatchIds);
        
        if (allStats && allStats.length > 0) {
          const totalPoints = allStats.reduce((sum, stat) => sum + (stat.points || 0), 0);
          avgPoints = totalPoints / allStats.length;
        }
      }
    } catch (error) {
      // Table might not exist, ignore
      console.log('player_stats table not available for average calculation');
    }
    
    return {
      total_teams: teamCount || 0,
      total_players: playerCount || 0,
      total_matches: matchCount || 0,
      average_points_per_game: avgPoints,
      top_scorer: topScorer,
    };
  },

  getCombineStats: async (): Promise<CombinePlayerStats[]> => {
    try {
      // First, get all matches with stage = 'Combine' and league_id = STATS_LEAGUE_ID
      let combineMatchIds: string[] = [];
      
      try {
        // Try v_matches_with_primary_context view first
        const { data: matches } = await supabase
          .from('v_matches_with_primary_context')
          .select('id, stage')
          .eq('league_id', STATS_LEAGUE_ID)
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
            .eq('league_id', STATS_LEAGUE_ID)
            .eq('stage', 'Combine');
          
          if (matches) {
            combineMatchIds = matches.map((m: any) => m.id);
          }
        } catch (err2) {
          console.log('Error fetching combine matches:', err2);
          return [];
        }
      }

      if (combineMatchIds.length === 0) {
        return [];
      }

      // Get all player_stats for combine matches
      const { data: playerStats, error } = await supabase
        .from('player_stats')
        .select('*')
        .in('match_id', combineMatchIds);

      if (error) {
        console.error('Error fetching combine player stats:', error);
        return [];
      }

      if (!playerStats || playerStats.length === 0) {
        return [];
      }

      // Aggregate stats by player_id
      const playerStatsMap = new Map<string, {
        player_id: string;
        player_name: string;
        match_ids: Set<string>;
        total_points: number;
        total_assists: number;
        total_rebounds: number;
        total_steals: number;
        total_blocks: number;
        total_turnovers: number;
        total_fgm: number;
        total_fga: number;
        total_ftm: number;
        total_fta: number;
        total_three_points_made: number;
        total_three_points_attempted: number;
      }>();

      playerStats.forEach((stat: any) => {
        const playerId = stat.player_id;
        if (!playerId) return;

        const existing = playerStatsMap.get(playerId) || {
          player_id: playerId,
          player_name: stat.player_name || 'Unknown Player',
          match_ids: new Set<string>(),
          total_points: 0,
          total_assists: 0,
          total_rebounds: 0,
          total_steals: 0,
          total_blocks: 0,
          total_turnovers: 0,
          total_fgm: 0,
          total_fga: 0,
          total_ftm: 0,
          total_fta: 0,
          total_three_points_made: 0,
          total_three_points_attempted: 0,
        };

        // Track unique matches for games_played
        if (stat.match_id) {
          existing.match_ids.add(stat.match_id);
        }

        // Sum all stats
        existing.total_points += stat.points || 0;
        existing.total_assists += stat.assists || 0;
        existing.total_rebounds += stat.rebounds || 0;
        existing.total_steals += stat.steals || 0;
        existing.total_blocks += stat.blocks || 0;
        existing.total_turnovers += stat.turnovers || 0;
        existing.total_fgm += stat.fgm || 0;
        existing.total_fga += stat.fga || 0;
        existing.total_ftm += stat.ftm || 0;
        existing.total_fta += stat.fta || 0;
        existing.total_three_points_made += stat.three_points_made || 0;
        existing.total_three_points_attempted += stat.three_points_attempted || 0;

        // Update player name if we have a better one
        if (stat.player_name && stat.player_name !== 'Unknown Player') {
          existing.player_name = stat.player_name;
        }

        playerStatsMap.set(playerId, existing);
      });

      // Calculate averages and percentages, then convert to array
      const combineStats: CombinePlayerStats[] = Array.from(playerStatsMap.values()).map((player) => {
        const games = player.match_ids.size || 1; // Avoid division by zero

        return {
          player_id: player.player_id,
          player_name: player.player_name,
          games_played: games,
          total_points: player.total_points,
          total_assists: player.total_assists,
          total_rebounds: player.total_rebounds,
          total_steals: player.total_steals,
          total_blocks: player.total_blocks,
          total_turnovers: player.total_turnovers,
          total_fgm: player.total_fgm,
          total_fga: player.total_fga,
          total_ftm: player.total_ftm,
          total_fta: player.total_fta,
          total_three_points_made: player.total_three_points_made,
          total_three_points_attempted: player.total_three_points_attempted,
          ppg: player.total_points / games,
          apg: player.total_assists / games,
          rpg: player.total_rebounds / games,
          spg: player.total_steals / games,
          bpg: player.total_blocks / games,
          tpg: player.total_turnovers / games,
          fg_percentage: player.total_fga > 0 ? (player.total_fgm / player.total_fga) * 100 : 0,
          ft_percentage: player.total_fta > 0 ? (player.total_ftm / player.total_fta) * 100 : 0,
          three_point_percentage: player.total_three_points_attempted > 0
            ? (player.total_three_points_made / player.total_three_points_attempted) * 100
            : 0,
        };
      });

      return combineStats;
    } catch (error) {
      console.error('Error in getCombineStats:', error);
      return [];
    }
  },
};

