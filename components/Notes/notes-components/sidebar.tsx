"use client"

import type React from "react"

import { FolderPlus, FolderOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { NotesData } from "@/lib/notes-store"

type Props = {
  folders: NotesData["folders"]
  notes: NotesData["notes"]
  selectedFolderId: string | null
  onSelectFolder: (id: string | null) => void
  onNewFolder: () => void
}

export function NotesSidebar({ folders, notes, selectedFolderId, onSelectFolder, onNewFolder }: Props) {
  const totalCount = notes.length

  const countFor = (folderId: string) => notes.filter((n) => n.folderId === folderId).length

  return (
    <aside className="h-full flex flex-col">
      <div className="flex items-center justify-between px-3 h-10 border-b border-sidebar-border">
        <div className="text-sm font-medium">Folders</div>
        <Button variant="ghost" size="icon" onClick={onNewFolder} aria-label="New Folder">
          <FolderPlus className="h-4 w-4" />
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        <SidebarItem
          icon={<FolderOpen className="h-4 w-4" />}
          label="All iCloud"
          count={totalCount}
          active={selectedFolderId === null}
          onClick={() => onSelectFolder(null)}
        />
        <div className="px-2 pt-2 pb-1 text-xs text-muted-foreground">On My Mac</div>
        <ul className="space-y-1">
          {folders.map((f) => (
            <li key={f.id}>
              <SidebarItem
                label={f.name}
                count={countFor(f.id)}
                active={selectedFolderId === f.id}
                onClick={() => onSelectFolder(f.id)}
              />
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

function SidebarItem({
  icon,
  label,
  count,
  active,
  onClick,
}: {
  icon?: React.ReactNode
  label: string
  count?: number
  active?: boolean
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full px-3 py-2 text-left flex items-center justify-between rounded-md",
        active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-muted",
      )}
    >
      <span className="flex items-center gap-2">
        {icon}
        <span className="text-sm">{label}</span>
      </span>
      {typeof count === "number" ? <span className="text-xs text-muted-foreground">{count}</span> : null}
    </button>
  )
}
