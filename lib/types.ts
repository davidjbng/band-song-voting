export interface Song {
  id: string
  title: string
  artist: string | null
  spotify_url: string | null
  youtube_url: string | null
  tidal_url: string | null
  arranger: string | null
  created_at: string
  created_by: string | null
}

export interface Vote {
  id: string
  song_id: string
  voter_name: string
  vote_type: -1 | 1
  created_at: string
}

export interface SongWithVotes extends Song {
  votes: Vote[]
  vote_score: number
  user_vote: -1 | 1 | null
}
