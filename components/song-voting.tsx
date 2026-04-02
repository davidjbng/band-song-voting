"use client"

// Band Song Voting Component
import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { SongCard } from "@/components/song-card"
import { AddSongDialog } from "@/components/add-song-dialog"
import { UserNameDialog } from "@/components/user-name-dialog"
import { Empty, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import { Spinner } from "@/components/ui/spinner"
import { Music } from "lucide-react"
import type { Song, Vote, SongWithVotes } from "@/lib/types"

const USER_NAME_KEY = "band-voting-user-name"

export function SongVoting() {
  const [songs, setSongs] = useState<SongWithVotes[]>([])
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState<string | null>(null)
  const [showNameDialog, setShowNameDialog] = useState(false)

  const supabase = createClient()

  // Load user name from localStorage
  useEffect(() => {
    const storedName = localStorage.getItem(USER_NAME_KEY)
    if (storedName) {
      setUserName(storedName)
    } else {
      setShowNameDialog(true)
    }
  }, [])

  // Fetch songs with votes
  const fetchSongs = useCallback(async () => {
    const { data: songsData, error: songsError } = await supabase
      .from("songs")
      .select("*")
      .order("created_at", { ascending: false })

    if (songsError) {
      console.error("Error fetching songs:", songsError)
      return
    }

    const { data: votesData, error: votesError } = await supabase
      .from("votes")
      .select("*")

    if (votesError) {
      console.error("Error fetching votes:", votesError)
      return
    }

    // Combine songs with their votes
    const songsWithVotes: SongWithVotes[] = (songsData as Song[]).map((song) => {
      const songVotes = (votesData as Vote[]).filter((v) => v.song_id === song.id)
      const voteScore = songVotes.reduce((acc, v) => acc + v.vote_type, 0)
      const userVote = userName
        ? songVotes.find((v) => v.voter_name === userName)?.vote_type || null
        : null

      return {
        ...song,
        votes: songVotes,
        vote_score: voteScore,
        user_vote: userVote as -1 | 1 | null,
      }
    })

    // Sort by vote score (descending)
    songsWithVotes.sort((a, b) => b.vote_score - a.vote_score)

    setSongs(songsWithVotes)
    setLoading(false)
  }, [supabase, userName])

  // Initial fetch and realtime subscription
  useEffect(() => {
    if (!userName) return

    fetchSongs()

    // Subscribe to realtime changes
    const songsChannel = supabase
      .channel("songs-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "songs" },
        () => fetchSongs()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "votes" },
        () => fetchSongs()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(songsChannel)
    }
  }, [userName, fetchSongs, supabase])

  const handleNameSubmit = (name: string) => {
    localStorage.setItem(USER_NAME_KEY, name)
    setUserName(name)
    setShowNameDialog(false)
  }

  const handleAddSong = async (songData: {
    title: string
    artist: string
    spotify_url: string
    youtube_url: string
    tidal_url: string
  }) => {
    const { error } = await supabase.from("songs").insert({
      title: songData.title,
      artist: songData.artist || null,
      spotify_url: songData.spotify_url || null,
      youtube_url: songData.youtube_url || null,
      tidal_url: songData.tidal_url || null,
      created_by: userName,
    })

    if (error) {
      console.error("Error adding song:", error)
    }
  }

  const handleVote = async (songId: string, voteType: 1 | -1) => {
    if (!userName) return

    // Check if user already voted
    const existingVote = songs
      .find((s) => s.id === songId)
      ?.votes.find((v) => v.voter_name === userName)

    if (existingVote) {
      if (existingVote.vote_type === voteType) {
        // Remove vote if clicking the same button
        await supabase.from("votes").delete().eq("id", existingVote.id)
      } else {
        // Update vote if clicking different button
        await supabase
          .from("votes")
          .update({ vote_type: voteType })
          .eq("id", existingVote.id)
      }
    } else {
      // Create new vote
      await supabase.from("votes").insert({
        song_id: songId,
        voter_name: userName,
        vote_type: voteType,
      })
    }
  }

  const handleUpdateArranger = async (songId: string, arranger: string) => {
    await supabase
      .from("songs")
      .update({ arranger: arranger || null })
      .eq("id", songId)
  }

  const handleDeleteSong = async (songId: string) => {
    await supabase.from("songs").delete().eq("id", songId)
  }

  if (!userName) {
    return <UserNameDialog open={showNameDialog} onSubmit={handleNameSubmit} />
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Music className="h-5 w-5" />
              </div>
              <div>
                <h1 className="font-semibold text-lg text-foreground">Band Voting</h1>
                <p className="text-xs text-muted-foreground">Hallo, {userName}</p>
              </div>
            </div>
            <AddSongDialog onAddSong={handleAddSong} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner className="h-8 w-8" />
          </div>
        ) : songs.length === 0 ? (
          <Empty className="py-20">
            <EmptyMedia variant="icon">
              <Music className="h-10 w-10" />
            </EmptyMedia>
            <EmptyTitle>Noch keine Songs</EmptyTitle>
            <EmptyDescription>
              Fuege den ersten Song hinzu, ueber den die Band abstimmen soll.
            </EmptyDescription>
          </Empty>
        ) : (
          <div className="flex flex-col gap-4 max-w-2xl mx-auto">
            {songs.map((song) => (
              <SongCard
                key={song.id}
                song={song}
                userName={userName}
                onVote={handleVote}
                onUpdateArranger={handleUpdateArranger}
                onDelete={handleDeleteSong}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
