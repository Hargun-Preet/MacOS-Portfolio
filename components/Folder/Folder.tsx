"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface FolderProps {
  id: string;
  name: string;
  position: { x: number; y: number };
  isSelected: boolean;
  onMouseDown: (id: string, e: React.MouseEvent) => void;
}

const Folder = forwardRef<HTMLDivElement, FolderProps>(
  ({ id, name, position, isSelected, onMouseDown }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "absolute w-24 flex flex-col items-center cursor-pointer p-2 rounded-lg select-none",
          isSelected ? "bg-blue-500/30" : "hover:bg-white/20"
        )}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
        onMouseDown={(e) => onMouseDown(id, e)}
      >
        {id == 'Resume' && <img
          src="/assets/icons/pdf.png"
          alt="Folder"
          className="w-18 h-18 pointer-events-none" // Prevent img from capturing mouse events
        />}
        {id == 'About Me' && <img
          src="/assets/icons/text.png"
          alt="Folder"
          className="w-18 h-18 pointer-events-none" // Prevent img from capturing mouse events
        />}
        {id == 'Projects' && <img
          src="/assets/icons/folder.png"
          alt="Folder"
          className="w-18 h-18 pointer-events-none" // Prevent img from capturing mouse events
        />}
        <span
          className={cn(
            "text-white text-xs text-center mt-1 px-1 py-0.5 rounded pointer-events-none font-sm", // Prevent span from capturing mouse events
          //   isSelected ? "bg-blue-600" : ""
          )}
          style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.7)" }}
        >
          {name}
        </span>
      </div>
    );
  }
);

Folder.displayName = "Folder";

export default Folder;
