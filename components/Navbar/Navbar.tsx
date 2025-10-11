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
import { useSettings } from "../Settings/SettingsContext";

interface MacOSNavBarProps {
  onSearchClick: () => void;
  onSiriClick: () => void;
  onControlCentreClick: () => void;
  openWindow: (id: string) => void;
}

type SubMenuAction = {
  label: string;
  onClick?: () => void;
  href?: string;
  shortcut?: string;
  disabled?: boolean;
  isDivider?: never; // A regular item cannot be a divider
};

type SubMenuDivider = {
  isDivider: true;
  label?: never; // A divider has no label
};

type SubMenuItem = SubMenuAction | SubMenuDivider;

type MenuItem = {
  label: string;
  submenu?: SubMenuItem[];
};

const APP_NAME = "Hargun's Portfolio"; // Example active app name

const menuItems: MenuItem[] = [
  {
    label: "File",
    submenu: [
      { label: "New Finder Window", shortcut: "⌘N" },
      { label: "New Folder", shortcut: "⇧⌘N" },
      { label: "New Tab", shortcut: "⌘T" },
      { isDivider: true },
      { label: "Open…", shortcut: "⌘O" },
      { label: "Open With", disabled: true },
      { label: "Close Window", shortcut: "⌘W", disabled: true },
      { isDivider: true },
      { label: "Get Info", shortcut: "⌘I" },
      { label: "Rename" },
      { isDivider: true },
      { label: "Find", shortcut: "⌘F" },
    ],
  },
  {
    label: "Edit",
    submenu: [
      { label: "Undo", shortcut: "⌘Z", disabled: true },
      { label: "Redo", shortcut: "⇧⌘Z", disabled: true },
      { isDivider: true },
      { label: "Cut", shortcut: "⌘X", disabled: true },
      { label: "Copy", shortcut: "⌘C" },
      { label: "Paste", shortcut: "⌘V" },
      { label: "Select All", shortcut: "⌘A" },
      { isDivider: true },
      { label: "Start Dictation...", shortcut: "🎙️" },
      { label: "Emoji & Symbols", shortcut: "⌃⌘Space" },
    ],
  },
  {
    label: "View",
    submenu: [
      { label: "As Icons", shortcut: "⌘1" },
      { label: "As List", shortcut: "⌘2" },
      { label: "As Columns", shortcut: "⌘3" },
      { label: "As Gallery", shortcut: "⌘4" },
      { isDivider: true },
      { label: "Use Stacks", shortcut: "⌃⌘0" },
      { label: "Sort By" },
      { isDivider: true },
      { label: "Show Path Bar" },
      { label: "Show Status Bar" },
      { isDivider: true },
      { label: "Customize Toolbar..." },
      { isDivider: true },
      { label: "Show View Options", shortcut: "⌘J" },
      { label: "Enter Full Screen", shortcut: "⌃⌘F" },
    ],
  },
  {
    label: "Go",
    submenu: [
      { label: "Back", shortcut: "⌘[", disabled: true },
      { label: "Forward", shortcut: "⌘]", disabled: true },
      { isDivider: true },
      { label: "Recents", shortcut: "⇧⌘F" },
      { label: "Documents", shortcut: "⇧⌘O" },
      { label: "Desktop", shortcut: "⇧⌘D" },
      { label: "Downloads", shortcut: "⌥⌘L" },
      { label: "Home", shortcut: "⇧⌘H" },
      { isDivider: true },
      { label: "Go to Folder...", shortcut: "⇧⌘G" },
      { label: "Connect to Server...", shortcut: "⌘K" },
    ],
  },
  {
    label: "Window",
    submenu: [
      { label: "Minimize", shortcut: "⌘M", disabled: true },
      { label: "Zoom", disabled: true },
      { isDivider: true },
      { label: "Bring All to Front" },
    ],
  },
  {
    label: "Help",
    submenu: [
      { label: "Search" },
      { label: "macOS Help" },
      { label: "About This Portfolio" },
    ],
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
  items?: SubMenuItem[]; // Use the new SubMenuItem type
  close: () => void;
  position?: "left" | "right";
}) {
  if (!items) return null;

  return (
    <AnimatePresence>
      {isOpen && (
          <motion.ul
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.1 }}
          className={cn(
            "absolute text-sm top-full mt-1 p-1 min-w-[220px] rounded-md bg-neutral-100/50 dark:bg-neutral-800/50 backdrop-blur-md shadow-lg border border-white/20 dark:border-neutral-700",
            position === "left" ? "left-0" : "right-0",
            "z-10",

          )}
          role="menu"
        >
          {items.map((item, index) => {
            if (item.isDivider) {
              return <div key={index} className="h-[1px] bg-neutral-400 dark:bg-neutral-600 my-1 mx-1" />;
            }

            const content = (
              <div className="flex justify-between items-center w-full">
                <span>{item.label}</span>
                {item.shortcut && <span className="text-sm">{item.shortcut}</span>}
              </div>
            );
            
            return (
              <li key={index} role="none">
                <button
                  onClick={() => {
                    if (item.onClick) item.onClick();
                    close();
                  }}
                  disabled={item.disabled}
                  className="w-full text-left px-2 py-1 text-sm text-black dark:text-white rounded disabled:opacity-40 disabled:cursor-not-allowed hover:not-disabled:bg-blue-500 hover:not-disabled:text-white"
                  role="menuitem"
                >
                  {content}
                </button>
              </li>
            );
          })}
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
            "absolute text-sm top-full p-2 min-w-[160px] rounded-md bg-neutral-100/50 dark:bg-neutral-800/50 backdrop-blur-md shadow-lg border border-white/20 dark:border-neutral-700",
            //dark:bg-gray-800 dark:ring-white dark:ring-opacity-10
            "text-black dark:text-white hover:bg-blue-500 hover:text-white z-50"
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
    <motion.div className="px-1 py-0.75 text-sm rounded hover:bg-black/20 cursor-default select-none text-[0.85rem]">
      {time}
    </motion.div>
  );
}

const MacOSNavBar = forwardRef<HTMLDivElement, MacOSNavBarProps>(({ onSearchClick, onSiriClick, onControlCentreClick, openWindow }, ref) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const { settings } = useSettings(); 

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
    <>
    <motion.nav
      ref={ref}
      className="fixed top-0 w-full z-999999 flex items-center justify-between px-2 h-6 select-none text-[0.9rem] text-gray-800 dark:text-gray-200 bg-white/30 dark:bg-black/30 before:absolute before:inset-0 before:-z-10 before:backdrop-blur-md shadow-[0_2px_6px_rgba(0,0,0,0.2)]"
      //dark:bg-black/30 dark:border-gray-700
    >
      {/* Left Section */}
      <motion.div ref={navRef} className="flex items-center space-x-0.5 ">
        {/* Apple Menu */}
        <motion.div className="relative ">
          <motion.button
            onClick={() =>
              setActiveMenu(activeMenu === "apple" ? null : "apple")
            }
            className="flex items-center gap-1 px-1.75 py-0.75 rounded hover:bg-black/20 focus:outline-none"
            //dark:hover:bg-gray-800
            aria-haspopup="true"
            aria-expanded={activeMenu === "apple"}
            aria-label="Apple menu"
          >
            <motion.img
                src="/assets/Icons/logo.png"
                alt="Logo"
                className="h-4.5 w-4.5 ml-2 mr-2 object-contain dark:invert"
            />

          </motion.button>
          <DropdownMenu
            isOpen={activeMenu === "apple"}
            items={[
              { label: "About This Mac", onClick: () => openWindow("About This Mac") },
              { isDivider: true },
              { label: "System Settings...", onClick: () => openWindow("System Settings")},
              { isDivider: true },
              { label: "Sleep"},
              { label: "Restart..."},
              { label: "Shut Down..."},
              { isDivider: true },
              { label: "Lock Screen", shortcut: "⌃⌘Q" },
              { label: "Log Out User...", shortcut: "⇧⌘Q" },
            ]}
            close={() => setActiveMenu(null)}
            position="left"
          />
        </motion.div>

        {/* App Name Bold */}
        <motion.div className="font-[600] pr-2">
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
      <motion.div className="flex items-center space-x-1 text-black dark:text-white">
        <ModeSwitcher />
        <StatusIcon title="D-Link" icon={<IconWifi size={24} stroke={1.5} className="mt-2"/>} />
        <button onClick={onSearchClick} className="p-1 px-2 rounded hover:bg-black/20">
          <Search size={16} />
        </button>
        <BatteryStatus />
        <button onClick={onControlCentreClick} className="p-1 rounded dark:invert hover:bg-black/20 dark:hover:bg-white/20">
          <img src="/assets/icons/control-centre.png" alt="control-centre" width={16} className="mx-1"/>
        </button>
        <button onClick={onSiriClick} className="p-1 rounded hover:bg-black/20">
          <img src="assets/icons/siri.png" alt="" className="w-4 mx-1"/>
        </button>
        <AppleClock />
      </motion.div>
    </motion.nav>

          <AnimatePresence>
        {activeMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveMenu(null)}
            // This div covers the whole screen but sits behind the navbar (z-40) and dropdowns (z-50)
            className="fixed inset-0 z-999998" 
          />
        )}
      </AnimatePresence>
    </>
  );
});

MacOSNavBar.displayName = "MacOSNavBar";

export default MacOSNavBar;