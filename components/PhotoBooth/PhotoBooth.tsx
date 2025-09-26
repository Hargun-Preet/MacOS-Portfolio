"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import EffectsGrid, { type EffectOption } from "./effects-grid"
import Countdown from "./countdown"
import Filmstrip, { type CaptureItem } from "./filmstrip"
import { Camera, Download, Grid2X2, SquareUserRound, X } from "lucide-react"

type Mode = "single" | "burst"

const EFFECTS: EffectOption[] = [
  { id: "none", name: "Normal", cssFilter: "none" },
  { id: "mono", name: "Mono", cssFilter: "grayscale(1)" },
  { id: "noir", name: "Noir", cssFilter: "grayscale(1) contrast(1.25) brightness(0.9)" },
  { id: "sepia", name: "Sepia", cssFilter: "sepia(1) contrast(1.05)" },
  { id: "instant", name: "Instant", cssFilter: "sepia(0.6) saturate(1.1) contrast(1.05) brightness(1.05)" },
  { id: "chrome", name: "Chrome", cssFilter: "saturate(1.5) contrast(1.15)" },
  { id: "fade", name: "Fade", cssFilter: "saturate(0.8) brightness(1.05)" },
  { id: "process", name: "Process", cssFilter: "hue-rotate(15deg) saturate(1.2) contrast(1.1)" },
  { id: "vivid", name: "Vivid", cssFilter: "saturate(1.4) contrast(1.1)" },
  { id: "invert", name: "X-Ray", cssFilter: "invert(1) grayscale(1) contrast(1.1)" },
  { id: "hue", name: "Aqua", cssFilter: "hue-rotate(170deg) saturate(1.25) brightness(1.05)" },
  { id: "thermal", name: "Thermal", cssFilter: "hue-rotate(240deg) saturate(2) contrast(1.2) brightness(1.05)" },
  { id: "dramatic", name: "Dramatic", cssFilter: "grayscale(0.6) contrast(1.25)" },
  { id: "highkey", name: "B&W High", cssFilter: "grayscale(1) brightness(1.15) contrast(1.2)" },
  { id: "lowkey", name: "B&W Low", cssFilter: "grayscale(1) brightness(0.9) contrast(0.9)" },
  { id: "contrast", name: "Boost", cssFilter: "contrast(1.35) saturate(1.1)" },
  { id: "glow", name: "Glow", cssFilter: "blur(2px) brightness(1.05) saturate(1.1)" },
  // New fun effects
  { id: "cool", name: "Cool", cssFilter: "hue-rotate(200deg) saturate(1.1) contrast(1.05)" },
  { id: "warm", name: "Warm", cssFilter: "hue-rotate(20deg) saturate(1.2) brightness(1.05)" },
  { id: "retro", name: "Retro", cssFilter: "sepia(0.5) contrast(1.15) saturate(0.9)" },
  { id: "pastel", name: "Pastel", cssFilter: "saturate(0.8) brightness(1.1) contrast(0.95)" },
  { id: "lomo", name: "Lomo", cssFilter: "saturate(1.3) contrast(1.2) brightness(0.95)" },
  { id: "bleach", name: "Bleach", cssFilter: "brightness(1.15) contrast(0.85) saturate(0.9)" },
  { id: "matrix", name: "Matrix", cssFilter: "hue-rotate(110deg) contrast(1.2) brightness(0.95)" },
  { id: "teal", name: "Teal Pop", cssFilter: "hue-rotate(180deg) saturate(1.4) contrast(1.05)" },
  { id: "sunset", name: "Sunset", cssFilter: "hue-rotate(25deg) saturate(1.3) brightness(1.05)" },
  { id: "moody", name: "Moody", cssFilter: "grayscale(0.2) contrast(1.25) brightness(0.95)" },
]

export const PhotoBoothWindowContent = ({ isMaximized }: { isMaximized?: boolean }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [mode, setMode] = useState<Mode>("single")
  const [withTimer, setWithTimer] = useState(false)
  const [showEffects, setShowEffects] = useState(false)
  const [selectedEffect, setSelectedEffect] = useState<EffectOption>(EFFECTS[0])

  const [isCapturing, setIsCapturing] = useState(false)
  const [flash, setFlash] = useState(false)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [burstIndex, setBurstIndex] = useState<number | null>(null)

  const [captures, setCaptures] = useState<CaptureItem[]>([])
  const [preview, setPreview] = useState<CaptureItem | null>(null)

  useEffect(() => {
    let cancelled = false
    async function init() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720  } }, // 4:3
          audio: false,
        })
        if (cancelled) return
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }
        setReady(true)
      } catch (e) {
        setError("Camera access denied or not available.")
      }
    }
    init()
    return () => {
      cancelled = true
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
      }
    }
  }, [])

  useEffect(() => {
    try {
      const raw = localStorage.getItem("photobooth:captures") || "[]"
      const parsed = JSON.parse(raw) as CaptureItem[]
      setCaptures(parsed)
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem("photobooth:captures", JSON.stringify(captures.slice(0, 50)))
    } catch {
      // ignore
    }
  }, [captures])

  useEffect(() => {
    if (!preview) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setPreview(null)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [preview])

  const audioCtxRef = useRef<AudioContext | null>(null)
  const getAudio = () => {
    if (!audioCtxRef.current) {
      const Ctx = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext
      audioCtxRef.current = new Ctx()
    }
    return audioCtxRef.current
  }

  const playBeep = useCallback((freq = 880, durationMs = 120) => {
    try {
      const ctx = getAudio()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = "sine"
      osc.frequency.value = freq
      gain.gain.value = 0.05
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      setTimeout(() => {
        osc.stop()
        osc.disconnect()
        gain.disconnect()
      }, durationMs)
    } catch {
      // ignore
    }
  }, [])

  const playShutter = useCallback(() => {
    try {
      const ctx = getAudio()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = "triangle"
      osc.frequency.value = 320
      gain.gain.value = 0.0001
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12)
      setTimeout(() => {
        osc.stop()
        osc.disconnect()
        gain.disconnect()
      }, 160)
    } catch {
      // ignore
    }
  }, [])

  const effectFilter = selectedEffect.cssFilter

  const captureSingleFrame = useCallback(async (): Promise<string | null> => {
    const video = videoRef.current
    if (!video) return null

    const w = 1280
    const h = 720
    const canvas = document.createElement("canvas")
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext("2d")
    if (!ctx) return null

    ctx.save()
    ctx.filter = effectFilter
    ctx.translate(w, 0)
    ctx.scale(-1, 1)
    ctx.drawImage(video, 0, 0, w, h)
    ctx.restore()

    return canvas.toDataURL("image/jpeg", 0.92)
  }, [effectFilter])

  const captureBurstComposite = useCallback(async (frames: string[]): Promise<string | null> => {
    if (!frames.length) return null

    const cellW = 640
    const cellH = 360
    const gutter = 16
    const w = cellW * 2 + gutter * 3
    const h = cellH * 2 + gutter * 3

    const canvas = document.createElement("canvas")
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext("2d")
    if (!ctx) return frames[0]

    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--color-card").trim() || "#fff"
    ctx.fillRect(0, 0, w, h)

    const imgs = await Promise.all(
      frames.map(
        (src) =>
          new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image()
            img.onload = () => resolve(img)
            img.onerror = reject
            img.crossOrigin = "anonymous"
            img.src = src
          }),
      ),
    )

    const positions = [
      { x: gutter, y: gutter },
      { x: gutter * 2 + cellW, y: gutter },
      { x: gutter, y: gutter * 2 + cellH },
      { x: gutter * 2 + cellW, y: gutter * 2 + cellH },
    ]
    imgs.forEach((img, i) => {
      ctx.drawImage(img, 0, 0, 1280, 720, positions[i].x, positions[i].y, cellW, cellH)
    })

    return canvas.toDataURL("image/jpeg", 0.92)
  }, [])

  const triggerFlash = useCallback(() => {
    setFlash(true)
    setTimeout(() => setFlash(false), 180)
  }, [])

  const doCapture = useCallback(async () => {
    if (!ready || isCapturing) return
    setIsCapturing(true)

    const runSingle = async () => {
      triggerFlash()
      playShutter()
      const dataUrl = await captureSingleFrame()
      if (dataUrl) {
        setCaptures((prev) => [
          { id: crypto.randomUUID(), dataUrl, createdAt: Date.now(), mode: "single", effectId: selectedEffect.id },
          ...prev,
        ])
      }
    }

    const runBurst = async () => {
      const frames: string[] = []
      for (let i = 0; i < 4; i++) {
        setBurstIndex(i)
        setCountdown(3)
        playBeep(880)
        await new Promise((r) => setTimeout(r, 1000))
        setCountdown(2)
        playBeep(880)
        await new Promise((r) => setTimeout(r, 1000))
        setCountdown(1)
        playBeep(1320, 140)
        await new Promise((r) => setTimeout(r, 1000))
        setCountdown(null)

        triggerFlash()
        playShutter()
        const shot = await captureSingleFrame()
        if (shot) frames.push(shot)

        await new Promise((r) => setTimeout(r, 200))
      }
      setBurstIndex(null)

      const dataUrl = await captureBurstComposite(frames)
      if (dataUrl) {
        setCaptures((prev) => [
          { id: crypto.randomUUID(), dataUrl, createdAt: Date.now(), mode: "burst", effectId: selectedEffect.id },
          ...prev,
        ])
      }
    }

    if (mode === "single") {
      if (withTimer) {
        setCountdown(3)
        playBeep(880)
        await new Promise((r) => setTimeout(r, 1000))
        setCountdown(2)
        playBeep(880)
        await new Promise((r) => setTimeout(r, 1000))
        setCountdown(1)
        playBeep(1320, 140)
        await new Promise((r) => setTimeout(r, 1000))
        setCountdown(null)
      }
      await runSingle()
    } else {
      await runBurst()
    }

    setIsCapturing(false)
  }, [
    captureBurstComposite,
    captureSingleFrame,
    isCapturing,
    mode,
    playBeep,
    playShutter,
    ready,
    selectedEffect.id,
    triggerFlash,
    withTimer,
  ])

  const handleDelete = useCallback((id: string) => {
    setCaptures((prev) => prev.filter((c) => c.id !== id))
  }, [])

  const downloadDataUrl = useCallback((dataUrl: string) => {
    const a = document.createElement("a")
    a.href = dataUrl
    a.download = `photobooth-${Date.now()}.jpg`
    document.body.appendChild(a)
    a.click()
    a.remove()
  }, [])

  const activeStream = streamRef.current

  return (
    <div className="flex h-full flex-col text-black dark:text-white ">
      {/* FIXED: The grid container now correctly uses h-full for the non-maximized state */}
      <div
        className={cn(
          "relative mx-auto grid w-full max-w-6xl grid-rows-[1fr,auto] overflow-hidden rounded-none border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700",
          isMaximized ? "h-[92vh]" : "h-full"
        )}
        role="region"
        aria-label="Photo Booth window"
  >
    <div className="relative overflow-hidden bg-white dark:bg-neutral-700">
      <video
        ref={videoRef}
        playsInline
        muted
        className="size-full object-cover"
        style={{
          transform: "scaleX(-1)",
          filter: effectFilter,
        }}
      />
      {flash && (
        <div
          className="absolute inset-0 bg-white/80 animate-in fade-in-0 duration-150"
          aria-hidden
        />
      )}
      {countdown !== null && <Countdown value={countdown} />}
      {burstIndex !== null && (
        <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-white/70 text-black dark:bg-background/70 dark:text-white px-3 py-1 text-sm backdrop-blur">
          Shot {burstIndex + 1} of 4
        </div>
      )}

      {/* MODIFIED: Effects grid container now respects isMaximized */}
      {showEffects && activeStream && (
        <div
          className={cn(
            "absolute z-10 inset-0",
            isMaximized ? "" : "size-full z-100"
          )}
        >
          <EffectsGrid
            stream={activeStream}
            currentEffectId={selectedEffect.id}
            effects={EFFECTS}
            onSelect={(eff) => {
              setSelectedEffect(eff);
              setShowEffects(false);
            }}
            onClose={() => setShowEffects(false)}
          />
        </div>
      )}

      {!ready && !error && (
        <div className="absolute inset-0 grid place-items-center">
          <p className="text-sm text-black dark:text-white">
            Requesting camera access…
          </p>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 grid place-items-center px-4 text-center">
          <p className="text-sm text-red-500">
            {error} Please enable camera permissions and reload.
          </p>
        </div>
      )}

      {/* Filmstrip */}
      {!showEffects && captures.length > 0 && (
            <div className="absolute bottom-0 left-0 right-0 z-10">
              <Filmstrip
                items={captures}
                onDelete={handleDelete}
                compact
                onSelect={(item) => setPreview(item)}
                isMaximized={isMaximized}
              />
            </div>
          )}
    </div>

    {/* Controls */}
    {!showEffects && (
      <div
        className={cn(
          "grid grid-cols-3 text-black/70 dark:text-white/80 items-center border-t border-neutral-300 dark:border-neutral-600 backdrop-blur-sm",
          isMaximized ? "py-3" : "py-2"
        )}
      >
        {/* Left controls */}
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "inline-flex rounded-xl bg-neutral-300 dark:bg-neutral-800/80 ml-2 gap-1",
              isMaximized ? "p-1 ml-6" : "p-1 scale-90"
            )}
          >
            <button
              aria-label="Single photo"
              className={cn(
                "rounded-lg",
                isMaximized
                  ? "px-3 py-1.5 text-sm"
                  : "px-2 py-1 text-xs",
                mode === "single"
                ? "bg-neutral-400/70 dark:bg-neutral-600 text-white"
                : "hover:bg-neutral-500/10 dark:hover:bg-neutral-700"
              )}
              onClick={() => setMode("single")}
            >
              <SquareUserRound/>
            </button>
            <button
              aria-label="Burst 4-up"
              className={cn(
                "rounded-lg transition-colors",
                isMaximized
                  ? "px-3 py-1.5 text-sm"
                  : "px-2 py-1 text-xs",
                mode === "burst"
                ? "bg-neutral-400/70 dark:bg-neutral-600 text-white"
                : "hover:bg-neutral-500/10 dark:hover:bg-neutral-700"
              )}
              onClick={() => setMode("burst")}
            >
              <Grid2X2/>
            </button>
          </div>

          <button
            className={cn("text-sm border border-neutral-300 dark:border-neutral-600 bg-neutral-300/50 hover:bg-neutral-300 dark:hover:bg-neutral-700/10 dark:bg-neutral-800/40 rounded-lg p-2", isMaximized ? "ml-6 " : "")}
            onClick={() => setWithTimer((v) => !v)}
            aria-pressed={withTimer}
          >
            {withTimer ? "Timer: 3s" : "Timer: Off"}
          </button>
        </div>

        {/* Shutter */}
        <div className="flex items-center justify-center">
          <button
            aria-label="Take Photo"
            disabled={!ready || isCapturing}
            onClick={doCapture}
            className={cn(
              "relative grid place-items-center rounded-full transition hover:scale-105 disabled:opacity-50",
              isMaximized ? "size-16 bg-red-500" : "size-12 bg-red-500" // Smaller when not maximized
            )}
          >
            {/* The Camera icon is now inside the button */}
            <Camera
              className="text-white"
              size={isMaximized ? 32 : 28} // Dynamically adjust size
            />
          </button>
        </div>

        {/* Effects */}
        <div className="flex items-center justify-end pr-2">
          <button
            className={cn(
              "border text-sm border-neutral-300 dark:border-neutral-600 hover:bg-neutral-300 dark:hover:bg-neutral-700/10 bg-neutral-300/50 dark:bg-neutral-800/40 rounded-lg p-2",
              isMaximized ? "mr-6" : ""
            )}
            onClick={() => setShowEffects(true)}
          >
            Effects
          </button>
        </div>
      </div>
    )}

    {/* Preview */}
    {preview && (
      <div
        className="absolute inset-0 z-20 bg-white dark:bg-neutral-700"
        role="dialog"
        aria-modal="true"
        aria-label="Photo preview"
        onClick={() => setPreview(null)}
      >
        <div className="absolute right-3 top-3 z-10 flex gap-2">
          <button
            className="p-2 rounded-lg border border-neutral-300 dark:border-neutral-500 text-black/60 dark:text-white/80 bg-neutral-200 dark:bg-neutral-700 hover:bg-white dark:hover:bg-neutral-600"
            onClick={(e) => {
              e.stopPropagation();
              if (preview?.dataUrl) downloadDataUrl(preview.dataUrl);
            }}
            aria-label="Download image"
          >
            <Download/>
          </button>
          <button
            className="p-2 rounded-lg border border-neutral-300 dark:border-neutral-500 text-black/60 dark:text-white/80 bg-neutral-200 dark:bg-neutral-700 hover:bg-white dark:hover:bg-neutral-600"
            onClick={(e) => {
              e.stopPropagation();
              setPreview(null);
            }}
            aria-label="Close preview"
          >
            <X/>
          </button>
        </div>

        <div
          className="absolute inset-0 px-2"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={
              preview.dataUrl ||
              "/placeholder.svg?height=800&width=1200&query=photo%20preview"
            }
            alt="Captured photo preview"
            className="h-full w-full object-contain"
          />
        </div>
      </div>
    )}
  </div>
</div>

  )
}
