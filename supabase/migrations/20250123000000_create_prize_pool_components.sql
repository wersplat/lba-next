-- Create prize_pool_components table
CREATE TABLE IF NOT EXISTS prize_pool_components (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id UUID NOT NULL REFERENCES league_seasons(id) ON DELETE CASCADE,
  base_pot INTEGER NOT NULL DEFAULT 1000,
  paid_tag_amount INTEGER,
  hof_upa_contributions INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(season_id)
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_prize_pool_components_season_id ON prize_pool_components(season_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_prize_pool_components_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_prize_pool_components_updated_at
  BEFORE UPDATE ON prize_pool_components
  FOR EACH ROW
  EXECUTE FUNCTION update_prize_pool_components_updated_at();

-- Add RLS policies
ALTER TABLE prize_pool_components ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access
CREATE POLICY "Allow public read access to prize_pool_components"
  ON prize_pool_components FOR SELECT
  USING (true);

