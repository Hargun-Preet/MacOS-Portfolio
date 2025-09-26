"use client";

import { cn } from "@/lib/utils"; 
import React, { useRef, useState, forwardRef, useEffect } from "react";
import { motion } from "motion/react";

interface WindowProps {
  title: string;
  children?: React.ReactNode;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  isVisible?: boolean;
  isMaximized?: boolean;
  isAnimating?: boolean;
  bounds?: {
    top: number;
    left: number;
    right: number;
    bottom: number;
  };
  position: { x: number; y: number }; // <-- Add this
  width: number; // <-- Add this
  height: number; // <-- Add this
}

const Window = forwardRef<HTMLDivElement, WindowProps>(
  ({ title, children, onClose, onMinimize, onMaximize, isVisible = true, isAnimating = false, isMaximized, bounds, position, width, height }, ref) => {
    // Calculate center position
    // const getInitialPosition = () => {
    //   const screenWidth = window.innerWidth;
    //   const screenHeight = window.innerHeight;
    //   const navbarHeight = 30; // Approximate navbar height

    //   return {
    //     x: (screenWidth - 448) / 2, // 384 = w-96
    //     y: navbarHeight + (screenHeight - navbarHeight - 412) / 2, // 288 = h-72
    //   };
    // };
    const [localPosition, setLocalPosition] = useState(position);
    useEffect(() => {
      setLocalPosition(position);
    }, [position]);

    // const [position, setPosition] = useState(getInitialPosition);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const windowRef = useRef<HTMLDivElement>(null);

    const [hoveredButton, setHoveredButton] = useState<string | null>(null);
    const [pressedButton, setPressedButton] = useState<string | null>(null);

    const getIconPath = (buttonName: string) => {
      const state = pressedButton === buttonName ? 'press' : hoveredButton === buttonName ? 'hover' : 'normal';
      return `/assets/traffic-lights/${buttonName}-${state}.svg`;
    };

    // Combine refs
    useEffect(() => {
      if (ref) {
        if (typeof ref === 'function') {
          ref(windowRef.current);
        } else {
          ref.current = windowRef.current;
        }
      }
    }, [ref]);

    const handleMouseDown = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      setIsDragging(true);
      setDragStart({
        x: e.clientX - localPosition.x,
        y: e.clientY - localPosition.y,
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      let newX = e.clientX - dragStart.x;
      let newY = e.clientY - dragStart.y;
      // ... (bounds logic is the same)
      setLocalPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleCloseClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onClose();
    };

    const handleDisappearClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onMinimize();
    };

    const handleMaximizeClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onMaximize(); // <-- Call the new prop
    };

    useEffect(() => {
      if (isDragging) {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
        };
      }
    }, [isDragging, dragStart.x, dragStart.y]);

    return (
      <motion.div
        ref={windowRef}
        className={cn(
          "fixed bg-white/95 dark:bg-neutral-700 rounded-lg shadow-2xl flex flex-col border border-gray-300  dark:border-neutral-600",
          (!isDragging && !isAnimating) && "transition-all duration-300 ease-in-out"
        )}
        // w-112 h-92
        style={{
          // Use the props for size and the local state for position
          width: `${width}px`,
          height: `${height}px`,
          left: `${localPosition.x}px`,
          top: `${localPosition.y}px`,
          zIndex: 1000,
          cursor: isDragging ? 'grabbing' : 'default',
          visibility: isVisible ? 'visible' : 'hidden',
          opacity: isVisible ? 1 : 0,
        }}
      >
        {/* Window Header */}
        <div 
          className="window-header h-8 bg-gray-100/90 flex items-center px-3 rounded-t-lg cursor-grab select-none border-b border-gray-200  dark:bg-neutral-700 dark:border-neutral-600"
          onMouseDown={handleMouseDown}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          {/* Traffic lights */}
          
          <button 
            onClick={handleDisappearClick}
            onMouseEnter={() => setHoveredButton('red')}
            onMouseLeave={() => setHoveredButton(null)}
            onMouseDown={() => setPressedButton('red')}
            onMouseUp={() => setPressedButton(null)}
            className="h-3 w-3 relative flex-shrink-0 mr-2"
            style={{ cursor: 'pointer' }}
          >
            <img src={getIconPath('red')} alt="Close button" />
          </button>
          
          <button 
            onClick={handleCloseClick}
            onMouseEnter={() => setHoveredButton('yellow')}
            onMouseLeave={() => setHoveredButton(null)}
            onMouseDown={() => setPressedButton('yellow')}
            onMouseUp={() => setPressedButton(null)}
            className="h-3 w-3 relative flex-shrink-0 mr-2"
            style={{ cursor: 'pointer' }}
          >
            <img src={getIconPath('yellow')} alt="Minimize button" />
          </button>
          
          <button
            onClick={handleMaximizeClick}
            onMouseEnter={() => setHoveredButton('green')}
            onMouseLeave={() => setHoveredButton(null)}
            onMouseDown={() => setPressedButton('green')}
            onMouseUp={() => setPressedButton(null)}
            className="h-3 w-3 relative flex-shrink-0"
            style={{ cursor: 'pointer' }}
          >
            <img src={getIconPath('green')} alt="Maximize button" />
          </button>
          
          {/* Title */}
          <span className="ml-auto p-1 text-sm font-medium text-gray-700  dark:text-white pointer-events-none">
            {title}
          </span>
        </div>
        
        {/* Window Content */}
        <div className="flex-grow overflow-auto bg-white/95 rounded-b-lg dark:bg-neutral-700">
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              // This line adds the isMaximized prop to your project content component
              return React.cloneElement(child, { isMaximized } as { isMaximized: boolean });
            }
            return child;
          })}
        </div>
      </motion.div>
    );
  }
);

Window.displayName = "Window";

export default Window;
