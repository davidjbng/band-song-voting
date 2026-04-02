"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel } from "@/components/ui/field"

interface UserNameDialogProps {
  open: boolean
  onSubmit: (name: string) => void
}

export function UserNameDialog({ open, onSubmit }: UserNameDialogProps) {
  const [name, setName] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onSubmit(name.trim())
    }
  }

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[400px]" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Willkommen!</DialogTitle>
          <DialogDescription>
            Gib deinen Namen ein, damit wir wissen, wer abstimmt.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-4">
          <Field>
            <FieldLabel htmlFor="userName">Dein Name</FieldLabel>
            <Input
              id="userName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="z.B. Max"
              autoFocus
              required
              className="text-base"
            />
          </Field>
          <Button
            type="submit"
            className="w-full mt-4 min-h-[44px]"
            disabled={!name.trim()}
          >
            Los geht&apos;s
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
