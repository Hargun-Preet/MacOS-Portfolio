"use client"

import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import type { Note } from "@/lib/notes-store"
import { Pin, Search } from "lucide-react"
import { format } from "date-fns"

type Props = {
  notes: Note[]
  selectedNoteId: string | null
  onSelectNote: (id: string) => void
  activeClass: string // NEW PROP for the yellow accent
}

export function NotesList({ notes, selectedNoteId, onSelectNote, activeClass }: Props) {
  const [query, setQuery] = useState("")

  const { pinned, others } = useMemo(() => {
    const filtered = notes.filter((n) => {
      if (!query.trim()) return true
      const q = query.toLowerCase()
      return n.title.toLowerCase().includes(q) || (n.plainText ?? "").toLowerCase().includes(q)
    })
    return {
      pinned: filtered.filter((n) => n.pinned),
      others: filtered.filter((n) => !n.pinned),
    }
  }, [notes, query])

  return (
    <section className="h-full flex flex-col">
      <div className="flex items-center gap-2 px-1 h-10 border-b border-neutral-300 dark:border-neutral-600">
        <div className="relative flex-1">
          <Search className="h-4 w-4 absolute left-2 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            aria-label="Search"
            placeholder="Search"
            className="w-full border-none focus:border-transparent focus:outline-none focus:ring-0 h-8 pl-8 pr-2 rounded-md bg-neutral-100 dark:bg-neutral-700/60 text-neutral-700 dark:text-neutral-400 placeholder:text-muted-foreground/70"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {pinned.length > 0 && (
          <>
            
            <ListSection title="Pinned">
              
            {pinned.map((n) => <NoteListItem key={n.id} note={n} active={n.id === selectedNoteId} onClick={() => onSelectNote(n.id)} activeClass={activeClass} />)}
          </ListSection>
          </>
        )}
        <ListSection title="Notes">
          {others.map((n) => <NoteListItem key={n.id} note={n} active={n.id === selectedNoteId} onClick={() => onSelectNote(n.id)} activeClass={activeClass} />)}
        </ListSection>
      </div>
    </section>
  )
}

function ListSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="py-2">
      <div className="px-3 pb-1 text-xs text-muted-foreground">{title}</div>
      <ul>{children}</ul>
    </div>
  )
}

function NoteListItem({ note, active, onClick, activeClass }: { note: Note; active?: boolean; onClick?: () => void; activeClass: string }) {
  return (
    <li>
      <button
        onClick={onClick}
        className={cn(
          "w-full px-3 py-2 text-left flex flex-col gap-1 border-b border-neutral-300 dark:border-neutral-600",
          active ? activeClass : "hover:bg-neutral-300 dark:hover:bg-neutral-800" // UPDATED to use the prop
        )}
      >
        <div className="flex items-center justify-between">
          <div className="font-medium text-sm truncate">{note.title || "Untitled"}</div>
          <div className="text-xs text-muted-foreground">{format(new Date(note.updatedAt), "MMM d")}</div>
        </div>
        <div className="text-xs text-muted-foreground truncate flex items-center gap-1">
          <span className="truncate">{note.plainText || " "}</span>
        </div>
      </button>
    </li>
  )
}
