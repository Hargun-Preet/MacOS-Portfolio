"use client"

import type React from "react"

import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import type { Note } from "@/lib/notes-store"
import { Pin, Search } from "lucide-react"
import { format } from "date-fns"

type Props = {
  notes: Note[]
  selectedNoteId: string | null
  onSelectNote: (id: string) => void
  onNewNote: () => void
}

export function NotesList({ notes, selectedNoteId, onSelectNote, onNewNote }: Props) {
  const [query, setQuery] = useState("")

  const { pinned, others } = useMemo(() => {
    const filtered = notes
      .filter((n) => {
        if (!query.trim()) return true
        const q = query.toLowerCase()
        return (
          n.title.toLowerCase().includes(q) ||
          (n.plainText ?? "").toLowerCase().includes(q) ||
          n.tags.some((t) => t.toLowerCase().includes(q))
        )
      })
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

    return {
      pinned: filtered.filter((n) => n.pinned),
      others: filtered.filter((n) => !n.pinned),
    }
  }, [notes, query])

  return (
    <section className="h-full flex flex-col">
      <div className="flex items-center gap-2 px-3 h-10 border-b border-border">
        <div className="relative flex-1">
          <Search className="h-4 w-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            aria-label="Search"
            placeholder="Search"
            className={cn(
              "w-full h-8 pl-8 pr-2 rounded-md",
              "bg-muted text-foreground placeholder:text-muted-foreground/70",
            )}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {pinned.length > 0 && (
          <ListSection title="Pinned">
            {pinned.map((n) => (
              <NoteListItem key={n.id} note={n} active={n.id === selectedNoteId} onClick={() => onSelectNote(n.id)} />
            ))}
          </ListSection>
        )}
        <ListSection title="Notes">
          {others.map((n) => (
            <NoteListItem key={n.id} note={n} active={n.id === selectedNoteId} onClick={() => onSelectNote(n.id)} />
          ))}
        </ListSection>
      </div>
    </section>
  )
}

function ListSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="py-2">
      <div className="px-3 pb-1 text-xs text-muted-foreground">{title}</div>
      <ul>{children}</ul>
    </div>
  )
}

function NoteListItem({
  note,
  active,
  onClick,
}: {
  note: Note
  active?: boolean
  onClick?: () => void
}) {
  return (
    <li>
      <button
        onClick={onClick}
        className={cn(
          "w-full px-3 py-2 text-left flex flex-col gap-1 border-b border-border",
          active ? "bg-muted" : "hover:bg-muted/60",
        )}
      >
        <div className="flex items-center justify-between">
          <div className="font-medium text-sm truncate">{note.title || "Untitled"}</div>
          <div className="text-xs text-muted-foreground">{format(new Date(note.updatedAt), "MMM d")}</div>
        </div>
        <div className="text-xs text-muted-foreground truncate flex items-center gap-1">
          {note.pinned && <Pin className="h-3 w-3 notes-tint" />}
          <span className="truncate">{note.plainText || " "}</span>
        </div>
        {note.tags.length > 0 && (
          <div className="flex gap-1 mt-1">
            {note.tags.slice(0, 3).map((t) => (
              <span key={t} className="text-[10px] px-1 py-0.5 rounded bg-accent text-accent-foreground">
                {t}
              </span>
            ))}
          </div>
        )}
      </button>
    </li>
  )
}
