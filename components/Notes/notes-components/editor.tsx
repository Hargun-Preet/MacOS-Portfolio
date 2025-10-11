"use client"

import { useEffect, useMemo, useState } from "react"
import { useNotesStore } from "@/lib/notes-store"
import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  ListIcon,
  LinkIcon,
  ImageIcon,
  Pin,
  Highlighter,
  Braces,
  ArrowLeft,
  Redo2,
  Undo2,
  Type,
  AlignJustify,
  ALargeSmall,
  Pilcrow,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
  List,
  ListOrdered,
  ListCheck,
  Table2,
  Trash2,
  Columns2,
  Rows2,
  MoreVertical,
  ArrowLeftToLine,
  ArrowRightToLine,
  ArrowUpToLine,
  ArrowDownToLine,
  ListX,
  Table,
} from "lucide-react"
import { cn } from "@/lib/utils"

import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import UnderlineExt from "@tiptap/extension-underline"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import TextAlign from "@tiptap/extension-text-align"
import {ListKit} from '@tiptap/extension-list'
import { TableKit } from '@tiptap/extension-table'
import Placeholder from "@tiptap/extension-placeholder"
import Highlight from "@tiptap/extension-highlight" // annotations/highlight
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function NotesEditor({ noteId, onBack }: { noteId: string | null; onBack?: () => void }) {
  const { data, updateNote, togglePin } = useNotesStore()

  const note = useMemo(() => data?.notes.find((n) => n.id === noteId) ?? null, [data, noteId])
  const [isMounted, setIsMounted] = useState(false)

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          heading: { levels: [1, 2, 3] },
          codeBlock: true,
          // Add this line to enable the base list item functionality
          listItem: false, 
          // It's also good practice to enable the other lists if you use them
          bulletList: false,
          orderedList: false,
        }),
        UnderlineExt,
        Link.configure({ openOnClick: false }),
        Image,
        ListKit,
        TableKit.configure({
          table: { resizable: true },
        }),
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
        Highlight, //
        Placeholder.configure({
          placeholder: "Start writing…",
        }),
      ],
      content: note?.content ?? "",
      autofocus: false,
      editable: !!note,
      onUpdate: ({ editor }) => {
        if (!note) return
        const html = editor.getHTML()
        const text = editor.state.doc.textContent
        updateNote(note.id, {
          content: html,
          plainText: text,
        })
      },
      immediatelyRender: false
    },
    [note?.id],
  )

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Don't render until client-side
  if (!isMounted || !noteId) {
    return null
  }

  if (editor && note && editor.getHTML() !== (note.content ?? "")) {
    const cur = editor.getHTML()
    if (cur !== (note.content ?? "")) {
      editor.commands.setContent(note.content ?? "", false)
    }
  }

  if (!note) {
    return (
      <section className="h-full flex items-center justify-center text-neutral-500">
        Select a note to view and edit
      </section>
    )
  }

  const apply = (cmd: () => void) => () => cmd()

  const setLink = () => {
    if (!editor) return
    const prev = editor.getAttributes("link").href
    const url = window.prompt("Set link URL", prev || "https://")
    if (url === null) return
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
  }

  const addImage = () => {
    if (!editor) return
    const url = window.prompt("Image URL", "")
    if (!url) return
    editor.chain().focus().setImage({ src: url, alt: "Note image" }).run()
  }

  return (
    <section className="h-full flex flex-col border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-black dark:text-white">
      {/* Title bar */}
      <div className="px-4 py-2 border-b border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-black dark:text-white flex items-center gap-2">
        {onBack ? (
          <button className="md:hidden p-2 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-700/50" onClick={onBack} aria-label="Back to list">
            <ArrowLeft className="h-4 w-4" />
          </button>
        ) : null}
        <input
          className={cn("w-full bg-transparent outline-none text-lg font-medium", "placeholder:text-muted-foreground")}
          placeholder="Title"
          value={note.title}
          onChange={(e) => updateNote(note.id, { title: e.target.value })}
          aria-label="Note title"
        />

        <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => editor?.chain().focus().undo().run()}
                aria-label="Undo"
                className=" p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700/50 text-yellow-400 dark:hover:text-yellow-300"
              >
                <Undo2 className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="z-[9999]">Undo</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => editor?.chain().focus().redo().run()}
                aria-label="Redo"
                className=" p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700/50 text-yellow-400 dark:hover:text-yellow-300"
              >
                <Redo2 className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="z-[9999]">Redo</TooltipContent>
          </Tooltip>
      </div>

      {/* Formatting toolbar */}
      <TooltipProvider>
        <div
          className={cn("h-auto min-h-10 flex items-center flex-wrap border-b border-neutral-300 dark:border-neutral-600 bg-card", "flex items-center gap-1 px-2 toolbar-scroll")}
          role="toolbar"
          aria-label="Formatting"
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                pressed={note.pinned}
                onPressedChange={() => togglePin(note.id)}
                aria-label="Pin note"
                className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700/50 text-yellow-400 dark:hover:text-yellow-300"
              >
                <Pin className="h-6 w-6" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent className="z-[9999]">Pin</TooltipContent>
          </Tooltip>

          <div className="w-px h-6 bg-neutral-300 dark:bg-neutral-600 mx-1" aria-hidden="true" />

          {/* Basic marks */}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <button className=" gap-1">
                    <Type className="h-8 w-8 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700/50 text-yellow-400 dark:hover:text-yellow-300" />
                  </button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent className="z-[9999] ">Font</TooltipContent>
            </Tooltip>
            <DropdownMenuContent className="z-[9999]" align="start">
              <DropdownMenuItem onClick={() => editor?.chain().focus().toggleBold().run()}>
                <Bold className="h-4 w-4" />
                Bold
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => editor?.chain().focus().toggleItalic().run()}>
                <Italic className="h-4 w-4" />
                Italic
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => editor?.chain().focus().toggleUnderline().run()}>
                <Underline className="h-4 w-4" />
                Underline
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => editor?.chain().focus().toggleStrike().run()}>
                <Strikethrough className="h-4 w-4" />
                Strikethrough
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => editor?.chain().focus().toggleCode().run()}>
                <Braces className="h-4 w-4" />
                Inline Code
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => editor?.chain().focus().toggleHighlight().run()}>
                <Highlighter className="h-4 w-4" />
                Highlight
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Formatting dropdown (Aa) */}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <button className="h-8 w-8 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700/50 text-yellow-400 dark:hover:text-yellow-300 gap-1">
                    Aa
                  </button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent className="z-[9999]">Styles</TooltipContent>
            </Tooltip>
            <DropdownMenuContent className="z-[9999]" align="start">
              <DropdownMenuItem onClick={() => editor?.chain().focus().setParagraph().run()}>
                <Pilcrow className="h-4 w-4" />
                Body
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}>
                <Heading1 className="h-4 w-4" />
                Title
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>
                <Heading2 className="h-4 w-4" />
                Heading
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}>
                <Heading3 className="h-4 w-4" />
                Subheading
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => editor?.chain().focus().toggleBlockquote().run()}>
                <Quote className="h-4 w-4" />
                Quote
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => editor?.chain().focus().toggleCodeBlock().run()}>
                <Code className="h-4 w-4" />
                Code Block
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Lists dropdown */}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <button className="">
                    <ListIcon className="h-8 w-8 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700/50 text-yellow-400 dark:hover:text-yellow-300" />
                  </button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent className="z-[9999]">Lists</TooltipContent>
            </Tooltip>
            <DropdownMenuContent className="z-[9999]" align="start">
              <DropdownMenuItem onClick={() => editor?.chain().focus().toggleBulletList().run()}>
                <List className="h-4 w-4" />
                Bulleted list
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => editor?.chain().focus().toggleOrderedList().run()}>
                <ListOrdered className="h-4 w-4" />
                Numbered list
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => editor?.chain().focus().toggleTaskList().run()}>
                <ListCheck className="h-4 w-4" />
                Checklist
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Alignment dropdown */}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <button className="h-8 w-8 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700/50 text-yellow-400 dark:hover:text-yellow-300">
                    <AlignJustify className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent className="z-[9999]">Align</TooltipContent>
            </Tooltip>
            <DropdownMenuContent className="z-[9999]" align="start">
              <DropdownMenuItem onClick={() => editor?.chain().focus().setTextAlign("left").run()}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-text-align-start-icon lucide-text-align-start"><path d="M21 5H3"/><path d="M15 12H3"/><path d="M17 19H3"/></svg>
                Left
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => editor?.chain().focus().setTextAlign("center").run()}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-text-align-center-icon lucide-text-align-center"><path d="M21 5H3"/><path d="M17 12H7"/><path d="M19 19H5"/></svg>
                Center
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => editor?.chain().focus().setTextAlign("right").run()}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-text-align-end-icon lucide-text-align-end"><path d="M21 5H3"/><path d="M21 12H9"/><path d="M21 19H7"/></svg>
                Right
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                        <button className="h-8 w-8 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700/50 text-yellow-400 dark:hover:text-yellow-300">
                            <Table className="h-4 w-4" />
                        </button>
                    </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent className="z-[9999]">Tables</TooltipContent>
            </Tooltip>
            <DropdownMenuContent className="z-[9999]" align="start">
              <DropdownMenuItem onClick={() => editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
                  <Table2 className="h-4 w-4 mr-2" />
                  Insert table
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => editor?.chain().focus().addColumnBefore().run()} disabled={!editor?.can().addColumnBefore()}>
                  <ArrowLeftToLine className="h-4 w-4 mr-2" />
                  Add column before
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => editor?.chain().focus().addColumnAfter().run()} disabled={!editor?.can().addColumnAfter()}>
                  <ArrowRightToLine className="h-4 w-4 mr-2" />
                  Add column after
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => editor?.chain().focus().deleteColumn().run()} disabled={!editor?.can().deleteColumn()}>
                  <ListX className="h-4 w-4 mr-2 rotate-90" />
                  Delete column
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => editor?.chain().focus().addRowBefore().run()} disabled={!editor?.can().addRowBefore()}>
                  <ArrowUpToLine className="h-4 w-4 mr-2" />
                  Add row before
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => editor?.chain().focus().addRowAfter().run()} disabled={!editor?.can().addRowAfter()}>
                  <ArrowDownToLine className="h-4 w-4 mr-2" />
                  Add row after
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => editor?.chain().focus().deleteRow().run()} disabled={!editor?.can().deleteRow()}>
                  <ListX className="h-4 w-4 mr-2" />
                  Delete row
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => editor?.chain().focus().deleteTable().run()} disabled={!editor?.can().deleteTable()}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete table
              </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

          <div className="w-px h-6 bg-neutral-300 dark:bg-neutral-600 mx-1" aria-hidden="true" />

          {/* Link / Image */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button onClick={setLink} aria-label="Link" className="h-8 w-8 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700/50 text-yellow-400 dark:hover:text-yellow-300">
                <LinkIcon className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="z-[9999]">Insert/edit link</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button onClick={addImage} aria-label="Insert image" className="h-8 w-8 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700/50 text-yellow-400 dark:hover:text-yellow-300">
                <ImageIcon className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="z-[9999]">Insert image</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>

      {/* Editor area */}
      <div className="notes-editor-container flex-1 overflow-y-auto overflow-x-auto px-4 py-4 bg-white dark:bg-neutral-900 border-neutral-300">
        <div className="tiptap">
          <EditorContent editor={editor} />
        </div>
      </div>
    </section>
  )
}
