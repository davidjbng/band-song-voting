"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
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
import { Label } from "@/components/ui/label"
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field"

interface AddSongDialogProps {
  onAddSong: (song: {
    title: string
    artist: string
    spotify_url: string
    youtube_url: string
    tidal_url: string
  }) => Promise<void>
}

export function AddSongDialog({ onAddSong }: AddSongDialogProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    spotify_url: "",
    youtube_url: "",
    tidal_url: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) return

    setIsSubmitting(true)
    try {
      await onAddSong(formData)
      setFormData({
        title: "",
        artist: "",
        spotify_url: "",
        youtube_url: "",
        tidal_url: "",
      })
      setOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2 min-h-[44px]">
          <Plus className="h-5 w-5" />
          Song hinzufuegen
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Neuen Song hinzufuegen</DialogTitle>
          <DialogDescription>
            Fuege einen Song hinzu, ueber den die Band abstimmen soll.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="title">Titel *</FieldLabel>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="z.B. Bohemian Rhapsody"
                required
                className="text-base"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="artist">Kuenstler</FieldLabel>
              <Input
                id="artist"
                value={formData.artist}
                onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                placeholder="z.B. Queen"
                className="text-base"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="spotify">Spotify Link</FieldLabel>
              <Input
                id="spotify"
                type="url"
                value={formData.spotify_url}
                onChange={(e) => setFormData({ ...formData, spotify_url: e.target.value })}
                placeholder="https://open.spotify.com/..."
                className="text-base"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="youtube">YouTube Link</FieldLabel>
              <Input
                id="youtube"
                type="url"
                value={formData.youtube_url}
                onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                placeholder="https://youtube.com/..."
                className="text-base"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="tidal">Tidal Link</FieldLabel>
              <Input
                id="tidal"
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
              {isSubmitting ? "Wird hinzugefuegt..." : "Hinzufuegen"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
