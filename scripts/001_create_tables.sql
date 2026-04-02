-- Band Song Voting App - Database Schema

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

-- Votes table: Votes pro Song und Benutzer
CREATE TABLE IF NOT EXISTS votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  song_id UUID NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
  voter_name TEXT NOT NULL,
  vote_type INTEGER NOT NULL CHECK (vote_type IN (-1, 1)),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(song_id, voter_name)
);

-- Enable Row Level Security
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for songs (permissive - no auth required)
CREATE POLICY "Allow all to read songs" ON songs FOR SELECT USING (true);
CREATE POLICY "Allow all to insert songs" ON songs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all to update songs" ON songs FOR UPDATE USING (true);
CREATE POLICY "Allow all to delete songs" ON songs FOR DELETE USING (true);

-- RLS Policies for votes (permissive - no auth required)
CREATE POLICY "Allow all to read votes" ON votes FOR SELECT USING (true);
CREATE POLICY "Allow all to insert votes" ON votes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all to update votes" ON votes FOR UPDATE USING (true);
CREATE POLICY "Allow all to delete votes" ON votes FOR DELETE USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_votes_song_id ON votes(song_id);
CREATE INDEX IF NOT EXISTS idx_votes_voter_name ON votes(voter_name);
