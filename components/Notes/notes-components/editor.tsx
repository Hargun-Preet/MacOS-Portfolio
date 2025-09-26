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
} from "lucide-react"
import { cn } from "@/lib/utils"

import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import UnderlineExt from "@tiptap/extension-underline"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import TextAlign from "@tiptap/extension-text-align"
import TaskList from "@tiptap/extension-task-list"
import TaskItem from "@tiptap/extension-task-item"
import Placeholder from "@tiptap/extension-placeholder"
import Highlight from "@tiptap/extension-highlight" // annotations/highlight
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
        }),
        UnderlineExt,
        Link.configure({ openOnClick: false }),
        Image,
        TaskList,
        TaskItem.configure({
          nested: true,
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
      <section className="h-full flex items-center justify-center text-muted-foreground">
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
    <section className="h-full flex flex-col">
      {/* Title bar */}
      <div className="px-4 py-2 border-b border-border bg-card flex items-center gap-2">
        {onBack ? (
          <Button variant="ghost" size="icon" className="md:hidden" onClick={onBack} aria-label="Back to list">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        ) : null}
        <input
          className={cn("w-full bg-transparent outline-none text-lg font-medium", "placeholder:text-muted-foreground")}
          placeholder="Title"
          value={note.title}
          onChange={(e) => updateNote(note.id, { title: e.target.value })}
          aria-label="Note title"
        />
      </div>

      {/* Formatting toolbar */}
      <TooltipProvider>
        <div
          className={cn("h-10 border-b border-border bg-card", "flex items-center gap-1 px-2 toolbar-scroll")}
          role="toolbar"
          aria-label="Formatting"
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                pressed={note.pinned}
                onPressedChange={() => togglePin(note.id)}
                aria-label="Pin note"
                className="notes-tool"
              >
                <Pin className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Pin</TooltipContent>
          </Tooltip>

          <div className="w-px h-6 bg-border mx-1" aria-hidden="true" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => editor?.chain().focus().undo().run()}
                aria-label="Undo"
                className="notes-tool"
              >
                <Undo2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => editor?.chain().focus().redo().run()}
                aria-label="Redo"
                className="notes-tool"
              >
                <Redo2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Redo</TooltipContent>
          </Tooltip>

          <div className="w-px h-6 bg-border mx-1" aria-hidden="true" />

          {/* Basic marks */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                className="notes-tool"
                pressed={!!editor?.isActive("bold")}
                onPressedChange={apply(() => editor?.chain().focus().toggleBold().run())}
                aria-label="Bold"
              >
                <Bold className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Bold</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                className="notes-tool"
                pressed={!!editor?.isActive("italic")}
                onPressedChange={apply(() => editor?.chain().focus().toggleItalic().run())}
                aria-label="Italic"
              >
                <Italic className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Italic</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                className="notes-tool"
                pressed={!!editor?.isActive("underline")}
                onPressedChange={apply(() => editor?.chain().focus().toggleUnderline().run())}
                aria-label="Underline"
              >
                <Underline className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Underline</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                className="notes-tool"
                pressed={!!editor?.isActive("strike")}
                onPressedChange={apply(() => editor?.chain().focus().toggleStrike().run())}
                aria-label="Strikethrough"
              >
                <Strikethrough className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Strikethrough</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                className="notes-tool"
                pressed={!!editor?.isActive("code")}
                onPressedChange={apply(() => editor?.chain().focus().toggleCode().run())}
                aria-label="Inline code"
              >
                <Braces className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Inline code</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                className="notes-tool"
                pressed={!!editor?.isActive("highlight")}
                onPressedChange={apply(() => editor?.chain().focus().toggleHighlight().run())}
                aria-label="Highlight"
              >
                <Highlighter className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Highlight</TooltipContent>
          </Tooltip>

          {/* Formatting dropdown (Aa) */}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="notes-tool gap-1">
                    <Type className="h-4 w-4" />
                    Aa
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>Text styles</TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => editor?.chain().focus().setParagraph().run()}>Body</DropdownMenuItem>
              <DropdownMenuItem onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}>
                Title (H1)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>
                Heading (H2)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}>
                Subheading (H3)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => editor?.chain().focus().toggleBlockquote().run()}>
                Quote
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => editor?.chain().focus().toggleCodeBlock().run()}>
                Code Block
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Lists dropdown */}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="notes-tool">
                    <ListIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>Lists</TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => editor?.chain().focus().toggleBulletList().run()}>
                Bulleted list
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => editor?.chain().focus().toggleOrderedList().run()}>
                Numbered list
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => editor?.chain().focus().toggleTaskList().run()}>
                Checklist
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Alignment dropdown */}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="notes-tool">
                    <AlignJustify className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>Alignment</TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => editor?.chain().focus().setTextAlign("left").run()}>
                Left
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => editor?.chain().focus().setTextAlign("center").run()}>
                Center
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => editor?.chain().focus().setTextAlign("right").run()}>
                Right
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="w-px h-6 bg-border mx-1" aria-hidden="true" />

          {/* Link / Image */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={setLink} aria-label="Link" className="notes-tool">
                <LinkIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Insert/edit link</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={addImage} aria-label="Insert image" className="notes-tool">
                <ImageIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Insert image</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>

      {/* Editor area */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="tiptap">
          <EditorContent editor={editor} />
        </div>
      </div>
    </section>
  )
}
