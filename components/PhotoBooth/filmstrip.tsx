"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion } from "motion/react"

export type CaptureItem = {
  id: string
  dataUrl: string
  createdAt: number
  mode: "single" | "burst"
  effectId: string
}

export default function Filmstrip({
  items,
  onDelete,
  compact = false,
  onSelect,
  isMaximized = false
}: {
  items: CaptureItem[]
  onDelete: (id: string) => void
  compact?: boolean
  onSelect?: (item: CaptureItem) => void
  isMaximized?: boolean
}) {
  if (!items?.length) {
    return null
  }

  if (compact) {
    return (
      <div className={cn("w-full border-t bg-white dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 pt-1",
        isMaximized ? "h-24" : "h-16"
    )}>
        <div className="h-full overflow-x-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
          <ul className={cn("flex h-full items-center ", 
            isMaximized ? "gap-2 px-2 h-full" : "gap-1 px-1 h-[110%]"
          )}>
          {items.map((item, index) => (
            <motion.li
              key={item.id}
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <button
                className={cn(
                  "relative overflow-hidden rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700",
                  isMaximized ? "h-16 w-24" : "h-12 w-18"
                )}
                onClick={() => onSelect?.(item)}
                aria-label="Preview photo"
              >
                <Image
                  src={item.dataUrl || "/placeholder.svg"}
                  alt={`Capture ${new Date(item.createdAt).toLocaleString()}`}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
                {item.mode === "burst" && (
                  <span className="absolute right-1 top-1 rounded bg-white/80 text-black/70 border border-neutral-300 dark:border-neutral-600 dark:bg-neutral-800/80 dark:text-white/70 px-1 text-[10px]">
                    4-shot
                  </span>
                )}
              </button>
            </motion.li>
          ))}

          </ul>
        </div>
      </div>
    )
  }

  return (
    <div className="z-100 mt-6 rounded-xl border bg-card">
      <div className="flex items-center justify-between px-4 py-2">
        <p className="text-sm">
          Filmstrip <span className="text-muted-foreground">({items.length})</span>
        </p>
      </div>
      <div className="scrollbar-thin overflow-x-auto">
        <ul className="flex items-stretch gap-3 px-4 py-3">
          {items.map((item) => (
            <li key={item.id} className="relative">
              <div className="group relative rounded-lg border bg-background">
                <div
                  className={cn(
                    "relative h-28 w-40 overflow-hidden rounded-t-lg",
                    item.mode === "burst" && "ring-2 ring-primary",
                  )}
                >
                  {/* Next/Image for optimization */}
                  <Image
                    src={item.dataUrl || "/placeholder.svg"}
                    alt={`Capture ${new Date(item.createdAt).toLocaleString()}`}
                    fill
                    className="object-cover"
                    sizes="160px"
                  />
                </div>
                <div className="flex items-center justify-between gap-2 px-2 py-2">
                  <span className="text-xs text-muted-foreground">{item.mode === "burst" ? "4-Up" : "Photo"}</span>
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label="Download"
                      onClick={() => downloadDataUrl(item.dataUrl)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-4"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden
                      >
                        <path d="M12 3a1 1 0 0 1 1 1v9.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-4.001 4a1 1 0 0 1-1.414 0l-4.001-4a1 1 0 1 1 1.414-1.414L11 13.586V4a1 1 0 0 1 1-1z" />
                        <path d="M5 20a1 1 0 0 1 0-2h14a1 1 0 1 1 0 2H5z" />
                      </svg>
                    </Button>
                    <Button size="icon" variant="ghost" aria-label="Delete" onClick={() => onDelete(item.id)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-4"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden
                      >
                        <path d="M9 3a1 1 0 0 0-1 1v1H5a1 1 0 1 0 0 2h14a1 1 0 1 0 0-2h-3V4a1 1 0 0 0-1-1H9zM7.5 9a1 1 0 1 1 2 0v8a1 1 0 1 1-2 0V9zm5 0a1 1 0 1 1 2 0v8a1 1 0 1 1-2 0V9z" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function downloadDataUrl(dataUrl: string) {
  const a = document.createElement("a")
  a.href = dataUrl
  a.download = `photobooth-${Date.now()}.jpg`
  document.body.appendChild(a)
  a.click()
  a.remove()
}
