"use client"

import type React from "react"

import { useRef, useState } from "react"
import { cn } from "@/lib/utils"

type Props = {
  initialLeft?: number
  initialMiddle?: number
  minLeft?: number
  minMiddle?: number
  className?: string
  children: [React.ReactNode, React.ReactNode, React.ReactNode]
}

export function ResizablePanels({
  initialLeft = 260,
  initialMiddle = 360,
  minLeft = 220,
  minMiddle = 300,
  className,
  children,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [leftWidth, setLeftWidth] = useState(initialLeft)
  const [middleWidth, setMiddleWidth] = useState(initialMiddle)
  const [dragging, setDragging] = useState<null | "left" | "middle">(null)

  const onMouseDown = (which: "left" | "middle") => (e: React.MouseEvent) => {
    e.preventDefault()
    setDragging(which)
  }

  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging || !containerRef.current) return
    const bounds = containerRef.current.getBoundingClientRect()
    const x = e.clientX - bounds.left
    if (dragging === "left") {
      const newLeft = Math.max(minLeft, Math.min(x, bounds.width - minMiddle - 200))
      setLeftWidth(newLeft)
    } else if (dragging === "middle") {
      const newMiddle = Math.max(minMiddle, Math.min(x - leftWidth, bounds.width - leftWidth - 240))
      setMiddleWidth(newMiddle)
    }
  }

  const onMouseUp = () => setDragging(null)

  const [left, middle, right] = children

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full h-full flex overflow-hidden", className)}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      role="group"
      aria-label="Resizable Panels"
    >
      <div style={{ width: leftWidth }} className="h-full border-r border-neutral-300 dark:border-neutral-600 bg-sidebar">
        {left}
      </div>

      <Handle onMouseDown={onMouseDown("left")} ariaLabel="Resize folders panel" />

      <div style={{ width: middleWidth }} className="h-full border-r border-border bg-card">
        {middle}
      </div>

      <Handle onMouseDown={onMouseDown("middle")} ariaLabel="Resize notes list" />

      <div className="flex-1 h-full bg-card">{right}</div>
    </div>
  )
}

function Handle({
  onMouseDown,
  ariaLabel,
}: {
  onMouseDown: (e: React.MouseEvent) => void
  ariaLabel: string
}) {
  return (
    <div
      role="separator"
      aria-label={ariaLabel}
      aria-orientation="vertical"
      tabIndex={0}
      onMouseDown={onMouseDown}
      onKeyDown={(e) => {
        // Keyboard resizing for accessibility
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
          // Handled by parent via mouse drag primarily; noop here (could lift state for key control)
          e.preventDefault()
        }
      }}
      className={cn(
        "w-1 cursor-col-resize relative group",
        "before:absolute before:inset-y-0 before:left-0 before:right-0 before:bg-transparent",
        "hover:bg-border",
      )}
    />
  )
}
