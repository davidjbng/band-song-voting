"use client"

import { useState, useEffect } from "react"
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
  onCancel?: () => void
  currentName?: string
  isEditMode?: boolean
}

export function UserNameDialog({ open, onSubmit, onCancel, currentName, isEditMode = false }: UserNameDialogProps) {
  const [name, setName] = useState("")

  // Setze den aktuellen Namen wenn der Dialog geöffnet wird
  useEffect(() => {
    if (open && currentName) {
      setName(currentName)
    } else if (!open) {
      setName("")
    }
  }, [open, currentName])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onSubmit(name.trim())
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel?.()}>
      <DialogContent className="sm:max-w-[400px]" showCloseButton={isEditMode}>
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Name ändern" : "Willkommen!"}</DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? "Gib deinen neuen Namen ein."
              : "Gib deinen Namen ein, damit wir wissen, wer abstimmt."
            }
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
          <div className="flex gap-2 mt-4">
            {isEditMode && onCancel && (
              <Button
                type="button"
                variant="outline"
                className="flex-1 min-h-[44px]"
                onClick={onCancel}
              >
                Abbrechen
              </Button>
            )}
            <Button
              type="submit"
              className={isEditMode ? "flex-1 min-h-[44px]" : "w-full min-h-[44px]"}
              disabled={!name.trim()}
            >
              {isEditMode ? "Speichern" : "Los geht's"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
