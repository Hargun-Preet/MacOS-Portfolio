"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export type EffectOption = {
  id: string
  name: string
  cssFilter: string
}

export default function EffectsGrid({
  stream,
  effects,
  currentEffectId,
  onSelect,
  onClose,
}: {
  stream: MediaStream
  effects: EffectOption[]
  currentEffectId: string
  onSelect: (effect: EffectOption) => void
  onClose: () => void
}) {
  // paginate into 3x3 pages
  const pageSize = 6
  const pages = useMemo(() => {
    const chunks: EffectOption[][] = []
    for (let i = 0; i < effects.length; i += pageSize) {
      chunks.push(effects.slice(i, i + pageSize))
    }
    return chunks
  }, [effects])
  const [page, setPage] = useState(0)

  const next = () => setPage((p) => (p + 1 < pages.length ? p + 1 : p))
  const prev = () => setPage((p) => (p - 1 >= 0 ? p - 1 : p))

  return (
    <div
      className={cn(
        "absolute inset-0 z-10 bg-white/50 dark:bg-neutral-700/50 backdrop-blur-sm",
        "flex flex-col opacity-0 animate-[gridIn_220ms_ease-out_forwards]",
      )}
      role="dialog"
      aria-label="Choose an effect"
    >
      <div className="flex items-center justify-between px-4 py-2 border-b bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-500">
        <button className="text-lg py-2 px-4 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-600"  onClick={prev} disabled={page === 0} aria-label="Previous page">
          ◀
        </button>
        <div className="flex items-center gap-2">
          {pages.map((_, i) => (
            <span
              key={i}
              className={cn("h-1.5 w-1.5 rounded-full", i === page ? "bg-black dark:bg-white" : "bg-black/30 dark:bg-white/50")}
              aria-hidden
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button className="text-lg py-2 px-4 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-600" onClick={next} disabled={page === pages.length - 1} aria-label="Next page">
            ▶
          </button>
          <button className="text-lg p-2 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-600" onClick={onClose}>
            <X/>
          </button>
        </div>
      </div>

      <div className="relative flex-1 overflow-hidden bg-white dark:bg-neutral-700">
        <div
          className="absolute inset-0 transition-transform duration-200"
          style={{ transform: `translateX(${-page * 100}%)` }}
        >
          <div className="flex size-full">
            {pages.map((pg, idx) => (
              <div key={idx} className="size-full shrink-0 grow-0 basis-full p-2 my-auto">
                <div className="grid grid-cols-3 gap-3">
                  {pg.map((effect) => (
                    <EffectTile
                      key={effect.id}
                      stream={stream}
                      effect={effect}
                      active={currentEffectId === effect.id}
                      onClick={() => onSelect(effect)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gridIn {
          from {
            opacity: 0;
            transform: scale(0.98);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  )
}

function EffectTile({
  stream,
  effect,
  active,
  onClick,
}: {
  stream: MediaStream
  effect: EffectOption
  active: boolean
  onClick: () => void
}) {
  const vidRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const vid = vidRef.current
    if (!vid) return
    vid.srcObject = stream
    vid.play().catch(() => {})
  }, [stream])

  return (
    <button
      className={cn(
        "rounded-lg mt-1 bg-card text-centre transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active && "ring-3 ring-black/50 dark:ring-white",
      )}
      onClick={onClick}
    >
      <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-black">
        <video
          ref={vidRef}
          muted
          playsInline
          className="size-full object-cover"
          style={{
            transform: "scaleX(-1)",
            filter: effect.cssFilter,
          }}
        />
        <p className="relative bottom-7 left-1/2 -translate-x-1/2  text-white text-sm px-2 py-1 rounded">
          {effect.name}
        </p>
      </div>
      
    </button>
  )
}
