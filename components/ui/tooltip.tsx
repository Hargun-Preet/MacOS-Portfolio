"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cn } from "@/lib/utils"

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  )
}

function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  )
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <AnimatePresence>
        <TooltipPrimitive.Content asChild forceMount sideOffset={sideOffset} {...props}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 4 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={cn(
              "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white border border-neutral-400/50 dark:border-neutral-700 z-50 w-fit rounded-md px-3 py-1.5 text-xs shadow-sm",
              className
            )}
          >
            {children}
            <TooltipPrimitive.Arrow className="bg-white dark:bg-neutral-900 border-b border-r border-neutral-400/50 dark:border-neutral-700 fill-white dark:fill-neutral-900 z-50 size-2.5 translate-y-[calc(-50%_-_0px)] rotate-45" />
          </motion.div>
        </TooltipPrimitive.Content>
      </AnimatePresence>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
