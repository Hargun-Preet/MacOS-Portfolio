/**
 * Note: Use position fixed according to your needs
 * Desktop navbar is better positioned at the bottom
 * Mobile navbar is better positioned at bottom right.
 **/

"use client";

import { cn } from "@/lib/utils";
import { IconLayoutNavbarCollapse } from "@tabler/icons-react";
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";

import React, { useRef, useState, forwardRef } from "react";

// --- Type Definitions ---
interface DockItem {
  title: string;
  iconSrc: string;
  href: string;
  id: string;
}

interface FloatingDockProps {
  mainItems: DockItem[];
  secondaryItems: DockItem[];
  onItemClick: (item: DockItem, element: HTMLElement, previewElement: HTMLElement) => void;
  desktopClassName?: string;
  mobileClassName?: string;
  openWindows: string[]; // Array of open window IDs
}

interface FloatingDockDesktopProps {
  mainItems: DockItem[];
  secondaryItems: DockItem[];
  className?: string;
  onItemClick: (item: DockItem, element: HTMLElement, previewElement: HTMLElement) => void;
  openWindows: string[];
}
// -----------------------

const FloatingDockMobile = ({
  items,
  className,
  onItemClick,
}: {
  items: DockItem[];
  className?: string;
  onItemClick: (item: DockItem, element: HTMLElement, previewElement: HTMLElement) => void;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn("relative block md:hidden", className)}>
      <AnimatePresence>
        {open && (
          <motion.div
            layoutId="nav"
            className="absolute inset-x-0 bottom-full mb-2 flex flex-col gap-2"
          >
            {items.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: 10,
                  transition: {
                    delay: idx * 0.05,
                  },
                }}
                transition={{ delay: (items.length - 1 - idx) * 0.05 }}
              >
                <button
                  onClick={(e) => {
                    const dummyPreview = document.createElement('div');
                    onItemClick(item, e.currentTarget, dummyPreview);
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 dark:bg-neutral-900"
                >
                  <img
                    src={item.iconSrc}
                    alt={item.title}
                    className="h-4 w-4 object-contain"
                  />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen(!open)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 dark:bg-neutral-800"
        aria-label="Toggle Dock menu"
      >
        <IconLayoutNavbarCollapse className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
      </button>
    </div>
  );
};

function IconContainer({
  mouseX,
  title,
  iconSrc,
  href,
  id,
  onItemClick,
  isOpen
}: {
  mouseX: MotionValue;
  title: string;
  iconSrc: string;
  href: string;
  id: string;
  onItemClick: (item: DockItem, element: HTMLElement, previewElement: HTMLElement) => void;
  isOpen: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthTransform = useTransform(distance, [-150, 0, 150], [60, 100, 60]);
  const heightTransform = useTransform(distance, [-150, 0, 150], [60, 100, 60]);

  const widthTransformIcon = useTransform(distance, [-150, 0, 150], [60, 100, 60]);
  const heightTransformIcon = useTransform(distance, [-150, 0, 150], [60, 100, 60]);

  const width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  const height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  const heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const [hovered, setHovered] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (ref.current && previewRef.current) {
      onItemClick({ title, iconSrc, href, id }, ref.current, previewRef.current);
    }
  };

  return (
    <div className="relative">
      {/* Mini preview window behind dock item - hidden, just for genie targeting */}
      <div
        ref={previewRef}
        data-dock-preview={id}
        className="absolute w-4 h-4 rounded"
        style={{
          bottom: '50px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1,
          opacity: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Dock icon */}
      <button onClick={handleClick} className="relative">
        <motion.div
          ref={ref}
          style={{ width, height }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="relative flex items-center justify-center"
        >
          <AnimatePresence>
            {hovered && (
              <motion.div
                  initial={{ opacity: 0, y: 10, x: "-50%" }}
                  animate={{ opacity: 1, y: 0, x: "-50%" }}
                  exit={{ opacity: 0, y: 2, x: "-50%" }}
                  className="absolute -top-8 left-1/2 w-fit rounded-md border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs whitespace-pre text-neutral-700
                      after:content-[''] after:absolute after:-bottom-2.5 after:left-1/2 after:-translate-x-1/2 after:border-6 after:border-transparent after:border-t-gray-100"
                  >
                  {title}
              </motion.div>
            )}
          </AnimatePresence>
          <motion.img
            src={iconSrc}
            alt={title}
            style={{ width: widthIcon, height: heightIcon }}
            className="object-contain"
          />
          
          {/* Open indicator dot */}
          {isOpen && (
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gray-300 rounded-full" />
          )}
        </motion.div>
      </button>
    </div>
  );
}

export const FloatingDock = forwardRef<HTMLDivElement, FloatingDockProps>(
  ({ mainItems, secondaryItems, onItemClick, desktopClassName, mobileClassName, openWindows }, ref) => {
    return (
      <>
        <FloatingDockDesktop
          ref={ref}
          mainItems={mainItems}
          secondaryItems={secondaryItems}
          onItemClick={onItemClick}
          className={desktopClassName}
          openWindows={openWindows}
        />
        <FloatingDockMobile
          items={[...mainItems, ...secondaryItems]}
          className={mobileClassName}
          onItemClick={onItemClick}
        />
      </>
    );
  }
);
FloatingDock.displayName = "FloatingDock";

const FloatingDockDesktop = forwardRef<HTMLDivElement, FloatingDockDesktopProps>(
  ({ mainItems, secondaryItems, className, onItemClick, openWindows }, ref) => {
    const mouseX = useMotionValue(Infinity);

    return (
      <motion.div
        ref={ref}
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className={cn(
          "z-50 mx-auto hidden h-18 items-end gap-1 rounded-2xl bg-white/15 dark:bg-black/10 border border-white/15 dark:border-white/10 backdrop-blur-lg shadow-lg px-1.5 mt-2 md:flex ",
          className
        )}
      >
        {mainItems.map((item, index) => {
          return (
            <div
              key={item.title}
              className="flex flex-col items-center gap-1 cursor-pointer"
            >
              <IconContainer 
                mouseX={mouseX} 
                onItemClick={onItemClick} 
                isOpen={openWindows.includes(item.id)}
                {...item} 
              />
            </div>
          );
        })}
        <div className="h-13 w-[1px] bg-gray-300/70 rounded mx-2 mb-2" />
        {secondaryItems.map((item, index) => {
          return (
            <div
              key={item.title}
              className="flex flex-col items-center gap-1 cursor-pointer"
            >
              <IconContainer 
                mouseX={mouseX} 
                onItemClick={onItemClick} 
                isOpen={openWindows.includes(item.id)}
                {...item} 
              />
            </div>
          );
        })}
      </motion.div>
    );
  }
);
FloatingDockDesktop.displayName = "FloatingDockDesktop";
