import React, { forwardRef } from 'react';

interface WidgetProps {
  id: string;
  position: { x: number; y: number };
  width: number;
  height: number;
  onMouseDown: (id: string, e: React.MouseEvent) => void;
  children: React.ReactNode;
  isDragging: boolean; // <-- Add this new prop
}

export const Widget = forwardRef<HTMLDivElement, WidgetProps>(
  ({ id, position, width, height, onMouseDown, children, isDragging }, ref) => { // <-- Destructure the new prop
    const handleMouseDown = (e: React.MouseEvent) => {
      onMouseDown(id, e);
    };

    return (
      <div
        ref={ref}
        onMouseDown={handleMouseDown}
        className="absolute select-none cursor-grab active:cursor-grabbing"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: `${width}px`,
          height: `${height}px`,
        }}
      >
        {/* This overlay will only appear during a drag and will capture mouse events */}
        {isDragging && <div className="absolute top-0 left-0 w-full h-full z-10" />}
        
        {children}
      </div>
    );
  }
);

Widget.displayName = "Widget";