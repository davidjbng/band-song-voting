"use client"

import { useState } from "react"
import { ChevronUp, ChevronDown, Music, ExternalLink, User } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { SongWithVotes } from "@/lib/types"

interface SongCardProps {
  song: SongWithVotes
  userName: string
  onVote: (songId: string, voteType: 1 | -1) => Promise<void>
  onUpdateArranger: (songId: string, arranger: string) => Promise<void>
  onDelete: (songId: string) => Promise<void>
}

export function SongCard({ song, userName, onVote, onUpdateArranger, onDelete }: SongCardProps) {
  const [isEditingArranger, setIsEditingArranger] = useState(false)
  const [arrangerValue, setArrangerValue] = useState(song.arranger || "")
  const [isVoting, setIsVoting] = useState(false)

  const handleVote = async (voteType: 1 | -1) => {
    if (isVoting) return
    setIsVoting(true)
    try {
      await onVote(song.id, voteType)
    } finally {
      setIsVoting(false)
    }
  }

  const handleArrangerSubmit = async () => {
    await onUpdateArranger(song.id, arrangerValue)
    setIsEditingArranger(false)
  }

  const SpotifyIcon = () => (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
    </svg>
  )

  const YouTubeIcon = () => (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  )

  const TidalIcon = () => (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <path d="M12.012 3.992L8.008 7.996 4.004 3.992 0 7.996 4.004 12l4.004-4.004L12.012 12l4.004-4.004L20.02 12l4.004-4.004-4.004-4.004-4.004 4.004-4.004-4.004zM12.012 12l-4.004 4.004L12.012 20l4.004-4.004L12.012 12z"/>
    </svg>
  )

  return (
    <Card className="bg-card border-border hover:border-muted-foreground/30 transition-colors">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Voting Section */}
          <div className="flex flex-col items-center gap-1 min-w-[56px]">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-11 w-11 rounded-full transition-all",
                song.user_vote === 1
                  ? "bg-green-500/20 text-green-500 ring-2 ring-green-500/50 hover:bg-green-500/30"
                  : "hover:bg-green-500/10 hover:text-green-500 text-muted-foreground"
              )}
              onClick={() => handleVote(1)}
              disabled={isVoting}
            >
              <ChevronUp className={cn("h-7 w-7", song.user_vote === 1 && "stroke-[3]")} />
            </Button>
            <span className={cn(
              "text-xl font-bold tabular-nums min-w-[2ch] text-center py-1",
              song.vote_score > 0 && "text-green-500",
              song.vote_score < 0 && "text-red-500",
              song.vote_score === 0 && "text-muted-foreground"
            )}>
              {song.vote_score > 0 ? `+${song.vote_score}` : song.vote_score}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-11 w-11 rounded-full transition-all",
                song.user_vote === -1
                  ? "bg-red-500/20 text-red-500 ring-2 ring-red-500/50 hover:bg-red-500/30"
                  : "hover:bg-red-500/10 hover:text-red-500 text-muted-foreground"
              )}
              onClick={() => handleVote(-1)}
              disabled={isVoting}
            >
              <ChevronDown className={cn("h-7 w-7", song.user_vote === -1 && "stroke-[3]")} />
            </Button>
          </div>

          {/* Song Info Section */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-semibold text-foreground truncate text-balance">
                  {song.title}
                </h3>
                {song.artist && (
                  <p className="text-sm text-muted-foreground truncate">
                    {song.artist}
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                onClick={() => onDelete(song.id)}
              >
                <span className="sr-only">Song löschen</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                  <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.519.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                </svg>
              </Button>
            </div>

            {/* Streaming Links */}
            <div className="flex gap-2 mt-3">
              {song.spotify_url && (
                <a
                  href={song.spotify_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-spotify/10 text-spotify hover:bg-spotify/20 transition-colors text-sm"
                >
                  <SpotifyIcon />
                  <span className="sr-only md:not-sr-only">Spotify</span>
                </a>
              )}
              {song.youtube_url && (
                <a
                  href={song.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-youtube/10 text-youtube hover:bg-youtube/20 transition-colors text-sm"
                >
                  <YouTubeIcon />
                  <span className="sr-only md:not-sr-only">YouTube</span>
                </a>
              )}
              {song.tidal_url && (
                <a
                  href={song.tidal_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-muted-foreground hover:bg-muted/80 transition-colors text-sm"
                >
                  <TidalIcon />
                  <span className="sr-only md:not-sr-only">Tidal</span>
                </a>
              )}
              {!song.spotify_url && !song.youtube_url && !song.tidal_url && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 text-muted-foreground text-sm">
                  <Music className="h-4 w-4" />
                  Keine Links
                </span>
              )}
            </div>

            {/* Arranger Section */}
            <div className="mt-3 pt-3 border-t border-border">
              {isEditingArranger ? (
                <div className="flex gap-2">
                  <Input
                    value={arrangerValue}
                    onChange={(e) => setArrangerValue(e.target.value)}
                    placeholder="Wer arrangiert?"
                    className="h-9 text-base"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleArrangerSubmit()
                      if (e.key === "Escape") setIsEditingArranger(false)
                    }}
                  />
                  <Button size="sm" onClick={handleArrangerSubmit} className="h-9">
                    OK
                  </Button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditingArranger(true)}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full text-left min-h-[44px]"
                >
                  <User className="h-4 w-4 shrink-0" />
                  {song.arranger ? (
                    <span>Arrangiert von: <span className="text-foreground font-medium">{song.arranger}</span></span>
                  ) : (
                    <span className="italic">Arranger hinzufügen...</span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
