-- Songs table: Haupttabelle für Songs
CREATE TABLE IF NOT EXISTS songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  artist TEXT,
  spotify_url TEXT,
  youtube_url TEXT,
  tidal_url TEXT,
  arranger TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by TEXT
);

-- Enable Row Level Security
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for songs (permissive - no auth required)
CREATE POLICY "Allow all to read songs" ON songs FOR SELECT USING (true);
CREATE POLICY "Allow all to insert songs" ON songs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all to update songs" ON songs FOR UPDATE USING (true);
CREATE POLICY "Allow all to delete songs" ON songs FOR DELETE USING (true);
