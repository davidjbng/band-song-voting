"use client"

import { useState, useEffect } from "react"
import { Pencil } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field"
import type { SongWithVotes } from "@/lib/types"

interface EditSongDialogProps {
  song: SongWithVotes
  onEditSong: (songId: string, songData: {
    title: string
    artist: string
    spotify_url: string
    youtube_url: string
    tidal_url: string
  }) => Promise<void>
}

export function EditSongDialog({ song, onEditSong }: EditSongDialogProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: song.title,
    artist: song.artist || "",
    spotify_url: song.spotify_url || "",
    youtube_url: song.youtube_url || "",
    tidal_url: song.tidal_url || "",
  })

  // Aktualisiere formData wenn sich der Song ändert
  useEffect(() => {
    setFormData({
      title: song.title,
      artist: song.artist || "",
      spotify_url: song.spotify_url || "",
      youtube_url: song.youtube_url || "",
      tidal_url: song.tidal_url || "",
    })
  }, [song])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) return

    setIsSubmitting(true)
    try {
      await onEditSong(song.id, formData)
      setOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0"
        >
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Song bearbeiten</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Song bearbeiten</DialogTitle>
          <DialogDescription>
            Ändere die Details des Songs.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="edit-title">Titel *</FieldLabel>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="z.B. Bohemian Rhapsody"
                required
                className="text-base"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="edit-artist">Künstler</FieldLabel>
              <Input
                id="edit-artist"
                value={formData.artist}
                onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                placeholder="z.B. Queen"
                className="text-base"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="edit-spotify">Spotify Link</FieldLabel>
              <Input
                id="edit-spotify"
                type="url"
                value={formData.spotify_url}
                onChange={(e) => setFormData({ ...formData, spotify_url: e.target.value })}
                placeholder="https://open.spotify.com/..."
                className="text-base"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="edit-youtube">YouTube Link</FieldLabel>
              <Input
                id="edit-youtube"
                type="url"
                value={formData.youtube_url}
                onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                placeholder="https://youtube.com/..."
                className="text-base"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="edit-tidal">Tidal Link</FieldLabel>
              <Input
                id="edit-tidal"
                type="url"
                value={formData.tidal_url}
                onChange={(e) => setFormData({ ...formData, tidal_url: e.target.value })}
                placeholder="https://tidal.com/..."
                className="text-base"
              />
            </Field>
          </FieldGroup>

          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="min-h-[44px]">
              Abbrechen
            </Button>
            <Button type="submit" disabled={isSubmitting || !formData.title.trim()} className="min-h-[44px]">
              {isSubmitting ? "Wird gespeichert..." : "Speichern"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
