"use client"

import useSWR from "swr"

export type Folder = {
  id: string
  name: string
  createdAt: string
}

export type Note = {
  id: string
  folderId: string | null
  title: string
  content: string | null // HTML from TipTap
  plainText: string | null // for previews/search
  pinned: boolean
  tags: string[]
  createdAt: string
  updatedAt: string
}

export type NotesData = {
  folders: Folder[]
  notes: Note[]
}

const STORAGE_KEY = "notes.app.v1"

function nowISO() {
  return new Date().toISOString()
}

function uuid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID()
  return Math.random().toString(36).slice(2)
}

function defaultData(): NotesData {
  const folderId = uuid()
  const noteId = uuid()
  return {
    folders: [
      {
        id: folderId,
        name: "Notes",
        createdAt: nowISO(),
      },
    ],
    notes: [
      {
        id: noteId,
        folderId,
        title: "Welcome to Notes",
        content:
          "<p>This is a macOS-style Notes app. Use the toolbar above to format text, add checklists, code blocks, links, and images.</p><ul><li>Click + to create a new note</li><li>Drag the panel dividers to resize</li><li>Use the left sidebar to switch folders</li></ul>",
        plainText:
          "This is a macOS-style Notes app. Use the toolbar above to format text, add checklists, code blocks, links, and images.",
        pinned: true,
        tags: ["welcome", "getting-started"],
        createdAt: nowISO(),
        updatedAt: nowISO(),
      },
    ],
  }
}

function read(): NotesData {
  if (typeof window === "undefined") return defaultData()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const d = defaultData()
      localStorage.setItem(STORAGE_KEY, JSON.stringify(d))
      return d
    }
    const parsed = JSON.parse(raw) as NotesData
    // basic shape validation
    if (!Array.isArray(parsed.folders) || !Array.isArray(parsed.notes)) throw new Error("bad")
    return parsed
  } catch {
    const d = defaultData()
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(d))
    }
    return d
  }
}

function write(data: NotesData) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function useNotesStore() {
  const { data, isLoading, mutate } = useSWR<NotesData>("notes-data", async () => read(), {
    revalidateOnFocus: false,
  })

  const set = (updater: (d: NotesData) => NotesData) => {
    const next = updater(read())
    write(next)
    mutate(next, { revalidate: false })
  }

  const addFolder = (name: string) => {
    const id = uuid()
    set((d) => ({
      ...d,
      folders: [...d.folders, { id, name, createdAt: nowISO() }],
    }))
    return id
  }

  const renameFolder = (id: string, name: string) => {
    set((d) => ({
      ...d,
      folders: d.folders.map((f) => (f.id === id ? { ...f, name } : f)),
    }))
  }

  const deleteFolder = (id: string) => {
    set((d) => {
      const remainingNotes = d.notes.map((n) => (n.folderId === id ? { ...n, folderId: null } : n))
      return {
        folders: d.folders.filter((f) => f.id !== id),
        notes: remainingNotes,
      }
    })
  }

  const addNote = (folderId: string | null) => {
    const id = uuid()
    const newNote: Note = {
      id,
      folderId: folderId ?? null,
      title: "",
      content: "",
      plainText: "",
      pinned: false,
      tags: [],
      createdAt: nowISO(),
      updatedAt: nowISO(),
    }
    set((d) => ({
      ...d,
      notes: [newNote, ...d.notes],
    }))
    return id
  }

  const updateNote = (id: string, patch: Partial<Omit<Note, "id" | "createdAt">>) => {
    set((d) => ({
      ...d,
      notes: d.notes.map((n) => (n.id === id ? { ...n, ...patch, updatedAt: nowISO() } : n)),
    }))
  }

  const moveNoteToFolder = (id: string, folderId: string | null) => {
    updateNote(id, { folderId })
  }

  const togglePin = (id: string) => {
    set((d) => ({
      ...d,
      notes: d.notes.map((n) => (n.id === id ? { ...n, pinned: !n.pinned, updatedAt: nowISO() } : n)),
    }))
  }

  const deleteNote = (id: string) => {
    set((d) => ({
      ...d,
      notes: d.notes.filter((n) => n.id !== id),
    }))
  }

  return {
    data,
    isLoading,
    addFolder,
    renameFolder,
    deleteFolder,
    addNote,
    updateNote,
    moveNoteToFolder,
    togglePin,
    deleteNote,
  }
}
