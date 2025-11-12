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
};

