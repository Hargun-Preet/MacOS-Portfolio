"use client"

import dynamic from "next/dynamic"
import { useState, useEffect, useMemo } from "react"
import { cn } from "@/lib/utils"
import { NotesList } from "./notes-components/note-list"
import { useNotesStore } from "@/lib/notes-store"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"
import { Plus, Trash2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const NotesEditor = dynamic(() => import('./notes-components/editor').then(mod => mod.NotesEditor), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full text-muted-foreground">Loading Editor...</div>
})

export const NotesWindowContent = ({ isMaximized }: { isMaximized?: boolean }) => {
  const { data, isLoading, addNote, deleteNote } = useNotesStore()
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && data && !selectedNoteId && data.notes.length > 0) {
      const mostRecent = [...data.notes].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0]
      if (mostRecent) setSelectedNoteId(mostRecent.id)
    }
  }, [isLoading, data, selectedNoteId])

  const allNotes = useMemo(() => {
    if (!data) return []
    return [...data.notes].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [data])

  if (isLoading || !data) {
    return <main className="h-full w-full flex items-center justify-center"><div className="text-muted-foreground">Loading Notes…</div></main>
  }
  
  const handleNewNote = () => {
    const id = addNote(null)
    setSelectedNoteId(id)
  }

  const handleDeleteSelected = () => {
    if (!selectedNoteId) return
    const remainingNotes = allNotes.filter((n) => n.id !== selectedNoteId)
    deleteNote(selectedNoteId)
    setSelectedNoteId(remainingNotes[0]?.id ?? null)
  }

  return (
    <TooltipProvider>
      <main className="h-full w-full bg-background text-foreground flex flex-col">
        <ResizablePanelGroup direction="horizontal" className="h-full w-full">
          <ResizablePanel 
            defaultSize={isMaximized ? 30 : 35} 
            minSize={25} 
            maxSize={40} 
            className="flex flex-col bg-white dark:bg-neutral-900 text-black dark:text-white"
          >
            <header className="flex items-center justify-between p-1 h-10 border-b border-neutral-300 dark:border-neutral-600 flex-shrink-0">
                <h2 className="text-xs font-semibold pl-2">All Notes</h2>
                <div className="flex items-center gap-1">
                    <Tooltip>
                        <TooltipTrigger asChild><button className="p-2 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-700/50" onClick={handleNewNote}><Plus className="h-4 w-4" /></button></TooltipTrigger>
                        <TooltipContent className="z-[9999]">New Note</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild><button className="p-2 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-700/50" onClick={handleDeleteSelected} disabled={!selectedNoteId}><Trash2 className="h-4 w-4" /></button></TooltipTrigger>
                        <TooltipContent className="z-[9999]">Delete Note</TooltipContent>
                    </Tooltip>
                </div>
            </header>
            {/* Pass the yellow accent class to the NotesList */}
            <NotesList
              notes={allNotes}
              selectedNoteId={selectedNoteId}
              onSelectNote={setSelectedNoteId}
              activeClass="bg-yellow-400 hover:bg-yellow-500 dark:hover:bg-yellow-300 border-neutral-300 dark:border-neutral-600 text-white dark:bg-yellow-400/90"
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={30}>
            <NotesEditor noteId={selectedNoteId} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </TooltipProvider>
  )
}
