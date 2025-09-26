"use client"

import dynamic from "next/dynamic"
import { useState, useEffect, useMemo } from "react"
import { cn } from "@/lib/utils"
// import { NotesSidebar } from "@/components/notes/sidebar"
// import { ResizablePanels } from "@/components/notes/resizable-panels"
import { NotesList } from "./notes-components/note-list"
import { useNotesStore } from "@/lib/notes-store"
import { Button } from "@/components/ui/button"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"
import { Plus, Trash2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const NotesEditor = dynamic(() => import('./notes-components/editor').then(mod => mod.NotesEditor), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full">Loading editor...</div>
})

export const NotesWindowContent = () => {
  const { data, isLoading, addNote, deleteNote } = useNotesStore()
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)

  const [isNarrow, setIsNarrow] = useState(false)
  const [showList, setShowList] = useState(true)

  useEffect(() => {
    const onResize = () => setIsNarrow(window.innerWidth < 768)
    onResize()
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  // Initialize selection on first load
  useEffect(() => {
    if (!isLoading && data && !selectedNoteId) {
      const mostRecent = [...data.notes].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      )[0]
      if (mostRecent) setSelectedNoteId(mostRecent.id)
    }
  }, [isLoading, data, selectedNoteId])

  const notesAll = useMemo(() => {
    if (!data) return []
    return data.notes
  }, [data])

  if (isLoading || !data) {
    return (
      <main className="h-dvh w-dvw flex items-center justify-center">
        <div className="text-muted-foreground">Loading Notes…</div>
      </main>
    )
  }

  const handleNewNote = () => {
    const id = addNote(null)
    setSelectedNoteId(id)
    if (isNarrow) setShowList(false)
  }

  const handleDeleteSelected = () => {
    if (!selectedNoteId) return
    deleteNote(selectedNoteId)
    const remaining = data.notes.filter((n) => n.id !== selectedNoteId)
    setSelectedNoteId(remaining[0]?.id ?? null)
    if (isNarrow) setShowList(true)
  }

  const handleSelectNote = (id: string) => {
    setSelectedNoteId(id)
    if (isNarrow) setShowList(false)
  }

  return (
    <main className="h-dvh w-dvw bg-background text-foreground">
      {/* Top toolbar (window toolbar) */}
      <header
        className={cn("h-12 border-b border-border flex items-center justify-between px-3", "bg-card")}
        role="banner"
        aria-label="Notes toolbar"
      >
        <TooltipProvider>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNewNote}
                  aria-label="New Note"
                  className="notes-tint bg-transparent"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>New note</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeleteSelected}
                  disabled={!selectedNoteId}
                  aria-label="Delete Note"
                  className="notes-tint bg-transparent"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete selected</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
        <div className="text-sm text-muted-foreground">All iCloud</div>
        <div className="w-16" />
      </header>

      {/* Responsive content area */}
      {/* Wide screens: resizable 2-pane layout */}
      <div className="h-[calc(100dvh-3rem)]">
        <div className="hidden md:block h-full">
          <ResizablePanelGroup direction="horizontal" className="h-full w-full">
            <ResizablePanel defaultSize={35} minSize={25} maxSize={50} className="border-r border-border bg-card">
              <NotesList
                notes={notesAll}
                selectedNoteId={selectedNoteId}
                onSelectNote={handleSelectNote}
                onNewNote={handleNewNote}
              />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel minSize={50} className="bg-card">
              <NotesEditor noteId={selectedNoteId} onBack={undefined} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>

        {/* Narrow screens: show list OR editor */}
        <div className="md:hidden h-full">
          {showList ? (
            <NotesList
              notes={notesAll}
              selectedNoteId={selectedNoteId}
              onSelectNote={handleSelectNote}
              onNewNote={handleNewNote}
            />
          ) : (
            <NotesEditor noteId={selectedNoteId} onBack={() => setShowList(true)} />
          )}
        </div>
      </div>
    </main>
  )
}
