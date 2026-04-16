"use client"

// Song Voting Component with realtime updates
import { useState, useEffect, useCallback, useMemo } from "react"
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
  const [isEditingName, setIsEditingName] = useState(false)

  // Supabase client nur einmal erstellen
  const supabase = useMemo(() => createClient(), [])

  // Lade Username aus localStorage
  useEffect(() => {
    const storedName = localStorage.getItem(USER_NAME_KEY)
    if (storedName) {
      setUserName(storedName)
    } else {
      setShowNameDialog(true)
    }
  }, [])

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

    // Hole aktuellen Username
    const currentUserName = localStorage.getItem(USER_NAME_KEY)

    // Kombiniere Songs mit ihren Votes
    const songsWithVotes: SongWithVotes[] = (songsData || []).map((song: Song) => {
      const songVotes = (votesData || []).filter((v: Vote) => v.song_id === song.id)
      const vote_score = songVotes.reduce((sum: number, v: Vote) => sum + v.vote_type, 0)
      const userVote = currentUserName 
        ? songVotes.find((v: Vote) => v.voter_name === currentUserName)
        : null
      return {
        ...song,
        votes: songVotes,
        vote_score,
        user_vote: userVote ? (userVote.vote_type as -1 | 1) : null,
      }
    })

    // Sortiere nach Votes (höchste zuerst)
    songsWithVotes.sort((a, b) => b.vote_score - a.vote_score)

    setSongs(songsWithVotes)
    setLoading(false)
  }, [supabase])

  // Initial fetch
  useEffect(() => {
    fetchSongs()
  }, [fetchSongs])

  // Realtime subscription
  useEffect(() => {
    const songsChannel = supabase
      .channel("songs-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "songs" },
        () => {
          fetchSongs()
        }
      )
      .subscribe()

    const votesChannel = supabase
      .channel("votes-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "votes" },
        () => {
          fetchSongs()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(songsChannel)
      supabase.removeChannel(votesChannel)
    }
  }, [supabase, fetchSongs])

  const handleSetUserName = (name: string) => {
    localStorage.setItem(USER_NAME_KEY, name)
    setUserName(name)
    setShowNameDialog(false)
    setIsEditingName(false)
    // Votes neu laden um user_vote korrekt anzuzeigen
    fetchSongs()
  }

  const handleCancelNameEdit = () => {
    setIsEditingName(false)
  }

  const handleOpenNameEdit = () => {
    setIsEditingName(true)
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
    } else {
      // Sofort aktualisieren
      await fetchSongs()
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

    // Sofort aktualisieren
    await fetchSongs()
  }

  const handleUpdateArranger = async (songId: string, arranger: string) => {
    await supabase
      .from("songs")
      .update({ arranger: arranger || null })
      .eq("id", songId)

    // Sofort aktualisieren
    await fetchSongs()
  }

  const handleDeleteSong = async (songId: string) => {
    await supabase.from("songs").delete().eq("id", songId)

    // Sofort aktualisieren
    await fetchSongs()
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Initial Name Dialog */}
      <UserNameDialog
        open={showNameDialog && !isEditingName}
        onSubmit={handleSetUserName}
      />

      {/* Name Edit Dialog */}
      <UserNameDialog
        open={isEditingName}
        onSubmit={handleSetUserName}
        onCancel={handleCancelNameEdit}
        currentName={userName || ""}
        isEditMode
      />

      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-xl font-bold text-foreground">Band Song Battle</h1>
            {userName && (
              <button 
                onClick={handleOpenNameEdit}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                {userName}
                <span className="text-xs">(ändern)</span>
              </button>
            )}
          </div>
          <AddSongDialog onAddSong={handleAddSong} />
        </div>
      </header>

      {/* Song List */}
      <main className="mx-auto max-w-2xl px-4 py-6">
        {songs.length === 0 ? (
          <Empty className="py-20">
            <EmptyMedia variant="icon">
              <Music className="h-10 w-10" />
            </EmptyMedia>
            <EmptyTitle>Noch keine Songs</EmptyTitle>
            <EmptyDescription>
              Füge den ersten Song hinzu, über den die Band abstimmen soll.
            </EmptyDescription>
          </Empty>
        ) : (
          <div className="flex flex-col gap-4">
            {songs.map((song) => (
              <SongCard
                key={song.id}
                song={song}
                userName={userName || ""}
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
