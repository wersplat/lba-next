import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const matchId = searchParams.get('match_id');

  if (!matchId) {
    return NextResponse.json(
      { error: 'match_id is required' },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabase
      .from('team_match_stats')
      .select(`
        team_id,
        points,
        rebounds,
        assists,
        steals,
        blocks,
        turnovers,
        fouls,
        field_goals_made,
        field_goals_attempted,
        three_points_made,
        three_points_attempted,
        free_throws_made,
        free_throws_attempted,
        plus_minus,
        grd,
        teams:teams!team_match_stats_team_id_fkey(name)
      `)
      .eq('match_id', matchId);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ teamStats: data || [] });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

