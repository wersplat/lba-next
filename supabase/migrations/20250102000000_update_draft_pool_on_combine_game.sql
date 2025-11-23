-- Migration: Update draft_pool table when a player plays a combine game
-- This trigger automatically updates the draft_pool table with league_id and season_id
-- when a player_stats record is inserted or updated for a combine game

-- Create function to update draft_pool when player plays combine game
CREATE OR REPLACE FUNCTION update_draft_pool_on_combine_game()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  match_stage TEXT;
  match_league_id UUID;
  match_season_id UUID;
BEGIN
  -- Only proceed if player_id is not null
  IF NEW.player_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- Get match details (stage, league_id, season_id)
  SELECT m.stage, m.league_id, m.season_id
  INTO match_stage, match_league_id, match_season_id
  FROM matches m
  WHERE m.id = NEW.match_id;

  -- Only proceed if this is a combine game and we have league/season info
  IF match_stage = 'Combine' AND match_league_id IS NOT NULL AND match_season_id IS NOT NULL THEN
    -- Update draft_pool: insert or update the row with league_id and season_id
    INSERT INTO draft_pool (player_id, league_id, season, updated_at)
    VALUES (NEW.player_id, match_league_id, match_season_id, NOW())
    ON CONFLICT (player_id) 
    DO UPDATE SET
      league_id = COALESCE(EXCLUDED.league_id, draft_pool.league_id),
      season = COALESCE(EXCLUDED.season, draft_pool.season),
      updated_at = NOW();
  END IF;

  RETURN NEW;
END;
$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS trigger_update_draft_pool_on_combine_game ON player_stats;

-- Create trigger on player_stats table
CREATE TRIGGER trigger_update_draft_pool_on_combine_game
  AFTER INSERT OR UPDATE OF match_id, player_id
  ON player_stats
  FOR EACH ROW
  WHEN (NEW.player_id IS NOT NULL)
  EXECUTE FUNCTION update_draft_pool_on_combine_game();

-- Add comment to function
COMMENT ON FUNCTION update_draft_pool_on_combine_game() IS 
  'Updates draft_pool table with league_id and season_id when a player plays a combine game';

