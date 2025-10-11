import { ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"

export interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  icon?: React.ReactNode;
  isMaximized?: boolean;
}

export function InteractiveHoverButton({
  text,
  icon,
  isMaximized,
  className,
  ...props
}: InteractiveHoverButtonProps) {
  return (
    <button
      className={cn(
        "group dark:bg-neutral-700 bg-white text-black dark:text-white relative h-[3rem] w-auto cursor-pointer overflow-hidden rounded-full border dark:border-neutral-600 border-neutral-300 shadow-lg shadow-black/20 p-2 px-6 text-center font-semibold",
        isMaximized ? "text-md" : "text-xs",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <div className="dark:bg-white bg-neutral-800 h-2 w-2 rounded-full transition-all duration-300 group-hover:scale-[100.8]"></div>
        <span className="flex items-center justify-center gap-2 transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
          {icon}
          {text}
        </span>
      </div>
      <div className="dark:text-black text-white dark:bg-white absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 opacity-0 transition-all duration-300 group-hover:-translate-x-5 group-hover:opacity-100">
        <span className="flex items-center justify-center gap-2">
          {icon}
          {text}
        </span>
        <ArrowRight />
      </div>
    </button>
  )
}
