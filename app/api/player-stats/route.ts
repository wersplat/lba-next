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
      .from('player_stats')
      .select('player_name, team_id, points, assists, rebounds, steals, blocks, turnovers, fouls, fgm, fga, three_points_made, three_points_attempted, ftm, fta, plus_minus, grd, slot_index')
      .eq('match_id', matchId)
      .order('slot_index', { ascending: true });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ playerStats: data || [] });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

