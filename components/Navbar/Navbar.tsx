"use client";

import React, { useState, useRef, useEffect, forwardRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  IconWifi,
  IconBattery,
} from "@tabler/icons-react";
import BatteryStatus from "./BatteryStatus";
import { cn } from "@/lib/utils";
import { Search, SlidersHorizontal } from "lucide-react";
import { ControlCentre } from "./ControlCentre";
import { ModeSwitcher } from "./ThemeToggle";

interface MacOSNavBarProps {
  onSearchClick: () => void;
  onSiriClick: () => void;
}

type MenuItem = {
  label: string;
  submenu?: { label: string; onClick?: () => void; href?: string }[];
};

const APP_NAME = "Hargun's Portfolio"; // Example active app name

const menuItems: MenuItem[] = [
//   {
//     label: "Finder",
//     submenu: [
//       { label: "About Finder" },
//       { label: "Preferences..." },
//       { label: "Empty Trash" },
//       { label: "Log Out" },
//     ],
//   },
  {
    label: "File",
    submenu: [
      { label: "New Window" },
      { label: "New Folder" },
      { label: "Open…" },
      { label: "Close Window" },
    ],
  },
  {
    label: "Edit",
    submenu: [
      { label: "Undo" },
      { label: "Redo" },
      { label: "Cut" },
      { label: "Copy" },
      { label: "Paste" },
      { label: "Select All" },
    ],
  },
  {
    label: "View",
    submenu: [
      { label: "Show View Options" },
      { label: "Customize Toolbar..." },
      { label: "Sort By" },
    ],
  },
  {
    label: "Window",
    submenu: [
      { label: "Minimize" },
      { label: "Zoom" },
      { label: "Bring All to Front" },
    ],
  },
  {
    label: "Help",
    submenu: [{ label: "Mac Help" }],
  },
];

// Utility hook for clicking outside to close dropdowns
function useClickOutside(
  ref: React.RefObject<HTMLDivElement | null>, // allow null
  handler: () => void
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) return;
      handler();
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

function MacMenu({
  label,
  isActive,
  onClick,
  submenu,
  close,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
  submenu?: { label: string; onClick?: () => void; href?: string }[];
  close: () => void;
}) {
  const menuRef = useRef<HTMLButtonElement>(null);

  return (
    <motion.div className="relative">
      <motion.button
        ref={menuRef}
        onClick={onClick}
        className={cn(
          "flex items-center text-sm px-2 py-0.5 rounded hover:bg-black/20 focus:outline-none",
          //dark:hover:bg-gray-800
          isActive ? "bg-black/20"  : "" //dark:bg-gray-800"
        )}
        aria-haspopup="true"
        aria-expanded={isActive}
      >
        {label}
        {/* <IconChevronDown stroke={1.5} size={10} /> */}
      </motion.button>
      <DropdownMenu
        isOpen={isActive}
        items={submenu}
        close={close}
        position="left"
      />
    </motion.div>
  );
}

function DropdownMenu({
  isOpen,
  items,
  close,
  position = "left",
}: {
  isOpen: boolean;
  items?: { label: string; onClick?: () => void; href?: string }[];
  close: () => void;
  position?: "left" | "right";
}) {
  if (!items) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.ul
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
          className={cn(
            "absolute text-sm top-full mt-1.5 pb-1 pt-0.75 min-w-[160px] rounded-md backdrop-blur-lg bg-white/55 shadow-lg ",
            //dark:bg-gray-800 dark:ring-white dark:ring-opacity-10
            position === "left" ? "left-0" : "right-0",
            "z-50"
          )}
          role="menu"
          aria-orientation="vertical"
          tabIndex={-1}
        >
          {items.map((item, index) => (
            <li key={index} role="none" className="px-1.5 py-0.5">
              {item.href ? (
                <a
                    href={item.href}
                    onClick={close}
                    className="block w-full px-1 py-0.5 text-sm text-gray-800 
                                rounded-md hover:bg-blue-500 hover:text-white hover:rounded-sm"
                    role="menuitem"
                    >
                    {item.label}
                </a>
              ) : (
                <motion.button
                    onClick={() => {
                        if (item.onClick) item.onClick();
                        close();
                    }}
                    className="w-full text-left px-1 py-0.5 text-sm text-gray-800 
                                rounded-md hover:bg-blue-500 hover:text-white hover:rounded-sm"
                    role="menuitem"
                    >
                    {item.label}
                </motion.button>
              )}
            </li>
          ))}
        </motion.ul>
      )}
    </AnimatePresence>
  );
}

function StatusIcon({
  title,
  icon,
}: {
  title: string;
  icon: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => setOpen(false));

  return (
    <motion.div className="relative" ref={ref}>
      <motion.button
        aria-label={title}
        onClick={() => setOpen(!open)}
        className="-mt-0.75 px-1 rounded hover:bg-black/20  focus:outline-none"
        //dark:hover:bg-gray-800
      >
        {icon}
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className={cn(
            "absolute text-sm top-full p-2 min-w-[160px] rounded-md backdrop-blur-lg bg-white/55 shadow-lg ",
            //dark:bg-gray-800 dark:ring-white dark:ring-opacity-10
            "z-50"
          )}
          >
            {title} Connected
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const getFormattedTime = () => {
  const now = new Date();
  
  // UPDATED: Added month and day to the options
  const dateOptions: Intl.DateTimeFormatOptions = { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  };
  
  const date = now.toLocaleDateString('en-US', dateOptions).replace(',', '');
  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  // Example output: "Wed, Sep 3 12:22 AM"
  return `${date} ${time}`;
};

export function AppleClock() {
  const [time, setTime] = useState(getFormattedTime);

  useEffect(() => {
    // Update the time every second for a live clock feel, starting at the next second
    const now = new Date();
    const delay = 1000 - now.getMilliseconds();
    
    const timer = setTimeout(() => {
      setTime(getFormattedTime()); // Update once
      const minuteTimer = setInterval(() => {
        setTime(getFormattedTime());
      }, 1000); // Then update every second

      return () => clearInterval(minuteTimer);
    }, delay);

    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div className="px-1 text-sm rounded hover:bg-black/20 cursor-default select-none text-[0.85rem]">
      {time}
    </motion.div>
  );
}

const MacOSNavBar = forwardRef<HTMLDivElement, MacOSNavBarProps>(({ onSearchClick, onSiriClick }, ref) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isControlCentreOpen, setIsControlCentreOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  useClickOutside(navRef, () => setActiveMenu(null));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveMenu(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <motion.nav
      ref={ref}
      className="fixed top-0 w-full z-5000 flex items-center justify-between px-2 h-6 select-none text-[0.9rem] text-gray-800 bg-white/30 backdrop-blur-lg shadow-[0_2px_6px_rgba(0,0,0,0.2)]"
      //dark:bg-black/30 dark:border-gray-700
    >
      {/* Left Section */}
      <motion.div className="flex items-center space-x-0.5">
        {/* Apple Menu */}
        <motion.div className="relative">
          <motion.button
            onClick={() =>
              setActiveMenu(activeMenu === "apple" ? null : "apple")
            }
            className="flex items-center gap-1 px-2 py-1.5 rounded hover:bg-black/20 focus:outline-none"
            //dark:hover:bg-gray-800
            aria-haspopup="true"
            aria-expanded={activeMenu === "apple"}
            aria-label="Apple menu"
          >
            <motion.img
                src="/assets/Icons/logo.png"
                alt="Logo"
                className="h-4 w-4 ml-2 mr-2 object-contain"
            />

          </motion.button>
          <DropdownMenu
            isOpen={activeMenu === "apple"}
            items={[
              { label: "About This Mac" },
              { label: "System Settings..." },
              { label: "Sleep" },
              { label: "Restart..." },
              { label: "Shut Down..." },
              { label: "Log Out" },
            ]}
            close={() => setActiveMenu(null)}
            position="left"
          />
        </motion.div>

        {/* App Name Bold */}
        <motion.div className="font-semibold pr-2">
          {APP_NAME}
        </motion.div>

        {/* Menus */}
        {menuItems.map((menu) => (
          <MacMenu
            key={menu.label}
            label={menu.label}
            isActive={activeMenu === menu.label}
            onClick={() => setActiveMenu(activeMenu === menu.label ? null : menu.label)}
            submenu={menu.submenu}
            close={() => setActiveMenu(null)}
          />
        ))}
      </motion.div>

      {/* Right Section */}
      <motion.div className="flex items-center space-x-1">
        <ModeSwitcher />
        <StatusIcon title="Wi-Fi" icon={<IconWifi size={24} stroke={1.5} className="mt-2"/>} />
        <button onClick={onSearchClick} className="p-1 rounded hover:bg-black/20">
          <Search size={16} />
        </button>
        <BatteryStatus />
        <button onClick={() => setIsControlCentreOpen(prev => !prev)} className="p-1 rounded hover:bg-black/20">
          <img src="/assets/icons/control-centre.png" alt="control-centre" width={16} className="ml-1"/>
        </button>
        <button onClick={onSiriClick} className="p-1 rounded hover:bg-black/20">
          <img src="assets/icons/siri.png" alt="" className="w-4 ml-1 mr-0"/>
        </button>
        <AppleClock />
      </motion.div>
      <AnimatePresence>
        {isControlCentreOpen && <ControlCentre />}
      </AnimatePresence>
    </motion.nav>
  );
});

MacOSNavBar.displayName = "MacOSNavBar";

export default MacOSNavBar;