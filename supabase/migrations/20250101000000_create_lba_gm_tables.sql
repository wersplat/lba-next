-- Create enum for accolade types
CREATE TYPE gm_accolade_type AS ENUM ('2k', 'real_life');

-- Create lba_gm table
CREATE TABLE IF NOT EXISTS lba_gm (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_org_id TEXT,
  clerk_profile_id TEXT,
  player_id UUID REFERENCES players(id) ON DELETE SET NULL,
  lba_team_id UUID UNIQUE REFERENCES lba_teams(id) ON DELETE SET NULL,
  twitter TEXT,
  twitch TEXT,
  discord_id TEXT,
  discord_username TEXT,
  past_2k_experience_text TEXT,
  past_2k_experience_json JSONB,
  total_wins INTEGER DEFAULT 0,
  total_losses INTEGER DEFAULT 0,
  championships INTEGER DEFAULT 0,
  playoff_appearances INTEGER DEFAULT 0,
  division_titles INTEGER DEFAULT 0,
  conference_titles INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create lba_gm_accolades table
CREATE TABLE IF NOT EXISTS lba_gm_accolades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gm_id UUID NOT NULL REFERENCES lba_gm(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type gm_accolade_type NOT NULL,
  awarded_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create lba_gm_2k_experience table
CREATE TABLE IF NOT EXISTS lba_gm_2k_experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gm_id UUID NOT NULL REFERENCES lba_gm(id) ON DELETE CASCADE,
  league_name TEXT NOT NULL,
  season TEXT,
  team_name TEXT,
  role TEXT,
  achievements TEXT,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_lba_gm_clerk_org_id ON lba_gm(clerk_org_id);
CREATE INDEX IF NOT EXISTS idx_lba_gm_clerk_profile_id ON lba_gm(clerk_profile_id);
CREATE INDEX IF NOT EXISTS idx_lba_gm_player_id ON lba_gm(player_id);
CREATE INDEX IF NOT EXISTS idx_lba_gm_lba_team_id ON lba_gm(lba_team_id);
CREATE INDEX IF NOT EXISTS idx_lba_gm_accolades_gm_id ON lba_gm_accolades(gm_id);
CREATE INDEX IF NOT EXISTS idx_lba_gm_2k_experience_gm_id ON lba_gm_2k_experience(gm_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_lba_gm_updated_at
  BEFORE UPDATE ON lba_gm
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies (if RLS is enabled)
ALTER TABLE lba_gm ENABLE ROW LEVEL SECURITY;
ALTER TABLE lba_gm_accolades ENABLE ROW LEVEL SECURITY;
ALTER TABLE lba_gm_2k_experience ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access
CREATE POLICY "Allow public read access to lba_gm"
  ON lba_gm FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to lba_gm_accolades"
  ON lba_gm_accolades FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to lba_gm_2k_experience"
  ON lba_gm_2k_experience FOR SELECT
  USING (true);

