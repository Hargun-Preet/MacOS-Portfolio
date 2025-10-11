"use client";

import React, { useEffect, useRef, useState } from "react";
import { FloatingDock } from "@/components/Dock/Dock";
import MacOSNavBar from "../Navbar/Navbar";
import Folder from "../Folder/Folder";
import Window from "../Folder/Window";
import { useGenieEffect } from "@/hooks/useGenie";
import { ProjectsWindowContent } from "../Folder/ProjectWindow";
import { ResumeContent } from "../Folder/Resume/ResumeContent";
import { AboutMe } from "../Folder/AboutMe/AboutMe";
import { PhotosWindowContent } from "../Folder/Photos/PhotosWindow";
import { ChromeWindowContent } from "../Folder/Chrome/ChromeWindow";
import { DoomWindow } from "../Folder/Doom/DoomWindow";
import { MacPaintWindowContent } from "../Folder/MacPaint/MacPaintWindow";
import { FinderWindowContent } from "../Folder/Finder/FinderWindow";
import { TerminalWindowContent } from "../Folder/Terminal/TerminalWindow";
import { SpotifyWindowContent } from "../Folder/Spotify/SpotifyWindow";
import { SpotifyWidget } from "../Folder/Spotify/SpotifyWidget";
import { Widget } from "../Widget/Widget";
import { WeatherWidget } from "../Widget/WeatherWidget";
import { CalendarWidget } from "../Widget/CalenderWidget";
import { SpotlightSearch } from "../Spotlight/Spotlight";
import { VSCodeWindowContent } from "../VSCode/VSCodeWindow";
import { Siri } from "../Siri/Siri";
import { SystemSettingsWindow } from "../Settings/SettingsWindow";
import { SettingsProvider, useSettings } from "../Settings/SettingsContext";
import { PhotoBoothWindowContent } from "../PhotoBooth/PhotoBooth";
import dynamic from "next/dynamic";
import { TrashWindowContent } from "../Trash/Trash";
import { AboutThisMacContent } from "../Folder/AboutMac";
import { ControlCentre } from "../Navbar/ControlCentre";
import { motion, AnimatePresence } from "motion/react";

const DynamicNotesWindow = dynamic(
  () => import('../Notes/Notes').then((mod) => mod.NotesWindowContent),
  { 
    ssr: false,
    // Optional: Add a loading state
    loading: () => <div className="flex h-full w-full items-center justify-center bg-white"><p>Loading Editor...</p></div>
  }
);

const FOLDER_WIDTH = 96;  // w-20 in Tailwind
const FOLDER_HEIGHT = 112; // Approximate total height of the folder
const WINDOW_WIDTH = 600; // w-96
const WINDOW_HEIGHT = 412;// h-72
const GRID_HEIGHT = 116;
const GRID_WIDTH = 108;
const GRID_GAP = 19;

interface FolderType {
  id: string;
  name: string;
  position: { x: number; y: number };
  isMaximized?: boolean; // <-- Add this new prop
  originalDimensions?: { x: number; y: number; w: number; h: number }; // <-- Add this new prop
}

interface WindowType extends FolderType {
  isOpen: boolean;
  isVisible: boolean;
  isAnimating: boolean;
  // centerPosition: { x: number; y: number };
  isMaximized?: boolean; 
  originalDimensions?: { x: number; y: number; w: number; h: number }; 
  width: number; // <-- Add this
  height: number; // <-- Add this
}

interface WidgetType {
  id: string;
  component: React.ReactNode;
  position: { x: number; y: number };
  // We add these properties for the drag logic
  width: number;
  height: number;
}

export interface SearchableItem {
  id: string;
  name: string;
  type: 'Folder' | 'Application' | 'File';
  icon: string;
}

const initialFolders: FolderType[] = [
  { id: "Projects", name: "Projects", position: { x: 0, y: 25 } },
  { id: "Resume", name: "Resume.pdf", position: { x: 0, y: 140 } },
  { id: "About Me", name: "About_Me.txt", position: { x: 0, y: 255 } },
];

const mainItems = [
  {
    id: "Finder",
    title: "Finder",
    iconSrc: "/assets/Icons/finder.jpg",
    href: "/finder",
  },
  {
    id: "Google Chrome",
    title: "Google Chrome",
    iconSrc: "/assets/Icons/chrome.png",
    href: "/chrome",
  },
  {
    id: "Photos",
    title: "Photos",
    iconSrc: "/assets/Icons/photos.png",
    href: "/photos",
  },
  {
    id: "System Settings",
    title: "System Settings",
    iconSrc: "/assets/Icons/settings.jpg",
    href: "/settings",
  },
  {
    id: "Doom",
    title: "Doom",
    iconSrc: "/assets/Icons/doom.png",
    href: "/doom",
  },
  {
    id: "MacPaint",
    title: "MacPaint",
    iconSrc: "/assets/Icons/macpaint.png",
    href: "/macpaint",
  },
  {
    id: "Photo Booth",
    title: "Photo Booth",
    iconSrc: "/assets/Icons/photo-booth.png",
    href: "/photo-booth",
  },
  {
    id: "Notes",
    title: "Notes",
    iconSrc: "/assets/Icons/notes.png",
    href: "/notes",
  },
  {
    id: "Spotify",
    title: "Spotify",
    iconSrc: "/assets/Icons/spotify.png",
    href: "/Spotify",
  },
  {
    id: "VS Code",
    title: "VS Code",
    iconSrc: "/assets/Icons/vscode.png",
    href: "/vscode",
  },
    {
    id: "GitHub",
    title: "GitHub",
    iconSrc: "/assets/Icons/github.png",
    href: "https://github.com/Hargun-Preet",
  },
  {
    id: "LinkedIn",
    title: "LinkedIn",
    iconSrc: "/assets/Icons/linkedin.png",
    href: "https://www.linkedin.com/in/hargun-preet-singh-964224282/",
  },
  {
    id: "Mail",
    title: "Mail",
    iconSrc: "/assets/Icons/mail.png",
    href: "mailto:Singhhargun077@gmail.com",
  },
  {
    id: "Siri",
    title: "Siri",
    iconSrc: "/assets/Icons/siri-logo.png",
    href: "/siri",
  },
  {
    id: "Terminal",
    title: "Terminal",
    iconSrc: "/assets/Icons/terminal.jpg",
    href: "/terminal",
  },
];

const specialWindowItems = [
  {
    id: "About This Mac",
    title: "About This Mac",
    iconSrc: "/assets/Icons/logo.png",
    href: "",
  },
];

const secondaryItems = [
  {
    id: "Trash",
    title: "Trash",
    iconSrc: "/assets/Icons/trash.png",
    href: "/trash",
  },
];

const initialWidgets: WidgetType[] = [
  {
    id: "SpotifyWidget",
    component: <SpotifyWidget />,
    position: { x: 0, y: 30 }, // Example position, doesn't collide with initial folders
    width: 392,  // The width of your spotify widget
    height: 96, // The height of your spotify widget
  },
  {
    id: "WeatherWidget",
    component: <WeatherWidget />,
    position: { x: 0, y: 140 }, // Position it next to the Spotify widget
    width: 176,  // w-52
    height: 176, // h-52
  },
  {
    id: "CalendarWidget",
    component: <CalendarWidget />,
    position: { x: 0, y: 260 }, // Position it below the others
    // A compact 2x2 grid item
    width: 176,  // 232px
    height: 176, // 232px
  },
];

const DesktopContent = () => {
  const { settings } = useSettings();

    // State for the wallpaper currently visible on screen
  const [displayWallpaper, setDisplayWallpaper] = useState(settings.wallpaper);
  
  // State to hold the URL of the next wallpaper while it loads
  const [loadingWallpaper, setLoadingWallpaper] = useState<string | null>(null);

  // Calculate brightness overlay opacity. 100 brightness = 0 opacity.
  const brightnessOverlayOpacity = 1 - (settings.brightness / 100);
  const [folders, setFolders] = useState<FolderType[]>(initialFolders);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [openWindows, setOpenWindows] = useState<WindowType[]>([]);
  const { genieExpand, genieCollapse, cleanup } = useGenieEffect();
  const [widgets, setWidgets] = useState<WidgetType[]>(initialWidgets);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [isSiriOpen, setIsSiriOpen] = useState(false);
  const [isControlCentreOpen, setIsControlCentreOpen] = useState(false);

  // Refs for UI elements
  const navbarRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const folderRefs = useRef<Map<string, HTMLElement>>(new Map());
  const windowRefs = useRef<Map<string, HTMLElement>>(new Map());

  // State to manage folder dragging
  const [dragState, setDragState] = useState<{
    id: string;
    type: 'folder' | 'widget';
    offsetX: number;
    offsetY: number;
    originalPos: { x: number; y: number }; 
  } | null>(null);

  const searchableItems = React.useMemo(() => {
    const folders: SearchableItem[] = initialFolders.map(f => {
    let icon;
    let type;

    switch (f.id) {
      case 'Projects':
        icon = '/assets/Icons/folder-full.png';
        type = 'Folder';
        break;
      case 'Resume':
        icon = '/assets/Icons/pdf.png';
        type = 'File';
        break;
      case 'About Me':
        icon = '/assets/Icons/text.png';
        type = 'File';
        break;
      default:
        icon = '/assets/Icons/folder.png';
        type = 'Folder';
    }

    return {
      id: f.id,
      name: f.name,
      type,
      icon,
    };
  });


    const apps: SearchableItem[] = mainItems.map(a => ({
      id: a.id,
      name: a.title,
      type: 'Application',
      icon: a.iconSrc,
    }));

    return [...folders, ...apps];
  }, []);

  useEffect(() => {
  // If the selected wallpaper is different from what's displayed,
  // start loading the new one.
    if (settings.wallpaper !== displayWallpaper) {
      setLoadingWallpaper(settings.wallpaper);
    }
  }, [settings.wallpaper, displayWallpaper]);

  const handleImageLoad = () => {
    if (loadingWallpaper) {
      setDisplayWallpaper(loadingWallpaper); // Update the visible wallpaper
      setLoadingWallpaper(null); // Clear the loading state
    }
  };

  const dragStartPos = useRef<{ x: number, y: number } | null>(null);
  const doubleClickTimeout = useRef<NodeJS.Timeout | null>(null);
  const [folderBounds, setFolderBounds] = useState({ top: 0, left: 0, right: 0, bottom: 0 });

  const getInitialWindowPosition = () => {
    const navbarHeight = navbarRef.current?.offsetHeight || 30;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    return {
      x: (screenWidth - WINDOW_WIDTH) / 2,
      y: navbarHeight + (screenHeight - navbarHeight - WINDOW_HEIGHT) / 2,
    };
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.code === 'Space') {
        e.preventDefault();
        setIsSpotlightOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSpotlightSelect = (item: SearchableItem) => {
    openWindow(item.id);
    setIsSpotlightOpen(false);
  };

  // Create a new function to open windows by ID
  const openWindow = (id: string) => {
    // Check if window is already open
    if (openWindows.some(w => w.id === id)) return;

    // Find the item's data (from folders, dock items, etc.)
    const allItems = [...initialFolders, ...mainItems, ...secondaryItems, ...specialWindowItems, {id: 'finder', name: 'Finder'}];
    const itemData = allItems.find(item => item.id.toLowerCase() === id.toLowerCase());

    if (!itemData) {
      console.warn(`No window data found for ID: ${id}`);
      return;
    }

    const isAboutMac = id.toLowerCase() === 'about this mac';
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const newWindow: WindowType = {
      id: itemData.id,
      name: itemData.title || itemData.name,
      position: isAboutMac ? {x: (screenWidth - 360) / 2, y: (screenHeight - 520) / 2}: getInitialWindowPosition(),
      width: isAboutMac ? 360 : WINDOW_WIDTH,
      height: isAboutMac ? 520 : WINDOW_HEIGHT,
      isOpen: true,
      isVisible: false,
      isAnimating: false,
    };

    setOpenWindows(prev => [...prev, newWindow]);

    requestAnimationFrame(() => {
      setOpenWindows(prev =>
        prev.map(w => (w.id === id ? { ...w, isVisible: true } : w))
      );
    });
  };

  const getWindowContent = (id: string, isMaximized?: boolean) => {
    switch (id) {
      case 'Finder':
        return <FinderWindowContent openWindow={openWindow} isMaximized={isMaximized}/>;
      case 'Projects':
        return <ProjectsWindowContent />;
      case 'Resume':
        return <ResumeContent />;
      case 'About Me':
        return <AboutMe />;
      case 'Photos':
        return <PhotosWindowContent />;
      case 'Google Chrome':
        return <ChromeWindowContent />
      case 'Doom':
        return <DoomWindow />
      case 'MacPaint':
        return <MacPaintWindowContent />
      case 'Photo Booth':
        return <PhotoBoothWindowContent />
      case 'Notes':
        return <DynamicNotesWindow />;
      case 'Spotify':
        return <SpotifyWindowContent />
      case 'VS Code':
        return <VSCodeWindowContent />
      case 'Terminal':
        return <TerminalWindowContent openWindow={openWindow} />;
      case 'System Settings':
        return <SystemSettingsWindow />
      case 'Trash':
        return <TrashWindowContent />
      case 'About This Mac':
        return <AboutThisMacContent />;
      default:
        return null;
    }
  };

  useEffect(() => {
    const screenWidth = window.innerWidth;
    const navbarHeight = navbarRef.current?.offsetHeight || 30;

    const topMargin = navbarHeight;

    // --- DEFINE WIDGET SIZES ---
    const spotifyWidth = 392;
    const calendarWidth = 176;
    const weatherWidth = 176;

    // --- CALCULATE POSITIONS ---
    const spotifyX = screenWidth - spotifyWidth - GRID_GAP;
    const calendarX = screenWidth - calendarWidth - weatherWidth - 3.1 * GRID_GAP;
    const weatherX = screenWidth - weatherWidth - GRID_GAP;

    const spotifyY = topMargin;
    const calendarY = topMargin + GRID_HEIGHT;
    const weatherY = topMargin + GRID_HEIGHT;

    setWidgets(prevWidgets =>
      prevWidgets.map(widget => {
        switch (widget.id) {
          case "SpotifyWidget":
            return { ...widget, position: { x: spotifyX, y: spotifyY } };
          case "CalendarWidget":
            return { ...widget, position: { x: calendarX, y: calendarY } };
          case "WeatherWidget":
            return { ...widget, position: { x: weatherX, y: weatherY } };
          default:
            return widget;
        }
      })
    );
  }, []);

  // Effect to calculate bounds and cleanup
  useEffect(() => {
    const calculateBounds = () => {
      const navbarHeight = navbarRef.current?.offsetHeight || 0;
      const dockHeight = dockRef.current?.offsetHeight || 0;
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      setFolderBounds({
        top: navbarHeight,
        left: 0,
        right: screenWidth - FOLDER_WIDTH,
        bottom: screenHeight - dockHeight - FOLDER_HEIGHT,
      });
    };

    // Clean up any existing genie containers
    const cleanupExistingGenieContainers = () => {
      const containers = document.querySelectorAll('.genie-animation-container, .genie');
      containers.forEach(container => {
        if (container.parentNode) {
          container.parentNode.removeChild(container);
        }
      });
    };

    cleanupExistingGenieContainers();
    calculateBounds();
    window.addEventListener("resize", calculateBounds);
    
    return () => {
      window.removeEventListener("resize", calculateBounds);
      cleanup();
      cleanupExistingGenieContainers();
    };
  }, [cleanup]);

// Handle folder and widget dragging
useEffect(() => {
  const handleMouseMove = (e: MouseEvent) => {
    if (!dragState) return;

    const isDraggingFolder = dragState.type === 'folder';
    const currentItem = isDraggingFolder
      ? folders.find(f => f.id === dragState.id)
      : widgets.find(w => w.id === dragState.id);

    if (!currentItem) return;

    const itemWidth = isDraggingFolder ? FOLDER_WIDTH : (currentItem as WidgetType).width;
    const itemHeight = isDraggingFolder ? FOLDER_HEIGHT : (currentItem as WidgetType).height;

    // Calculate new position
    let newX = e.clientX - dragState.offsetX;
    let newY = e.clientY - dragState.offsetY;

    // Apply desktop bounds (including dock)
    const navbarHeight = navbarRef.current?.offsetHeight || 0;
    const dockHeight = dockRef.current?.offsetHeight || 0;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    newX = Math.max(0, Math.min(newX, screenWidth - itemWidth));
    newY = Math.max(navbarHeight, Math.min(newY, screenHeight - dockHeight - itemHeight));

    // Update state
    if (isDraggingFolder) {
      setFolders(prev =>
        prev.map(f => (f.id === dragState.id ? { ...f, position: { x: newX, y: newY } } : f))
      );
    } else {
      setWidgets(prev =>
        prev.map(w => (w.id === dragState.id ? { ...w, position: { x: newX, y: newY } } : w))
      );
    }
  };

  const handleMouseUp = () => {
    if (!dragState) return;

    const isDraggingFolder = dragState.type === 'folder';
    const currentItem = isDraggingFolder
      ? folders.find(f => f.id === dragState.id)
      : widgets.find(w => w.id === dragState.id);

    if (!currentItem) return;

    // Snap to grid
    const navbarHeight = navbarRef.current?.offsetHeight || 0;
    const relativeY = currentItem.position.y - navbarHeight;
    const snappedX = Math.round(currentItem.position.x / GRID_WIDTH) * GRID_WIDTH;
    const snappedY = Math.round(relativeY / GRID_HEIGHT) * GRID_HEIGHT + navbarHeight;

    // AABB collision detection function
    const checkCollision = (item1: any, pos1: {x: number, y: number}, item2: any) => {
      const width1 = item1.width || FOLDER_WIDTH;
      const height1 = item1.height || FOLDER_HEIGHT;
      const width2 = item2.width || FOLDER_WIDTH;
      const height2 = item2.height || FOLDER_HEIGHT;

      return (
        pos1.x < item2.position.x + width2 &&
        pos1.x + width1 > item2.position.x &&
        pos1.y < item2.position.y + height2 &&
        pos1.y + height1 > item2.position.y
      );
    };

    // Check for collisions with any other item
    const allOtherItems = [...folders, ...widgets].filter(item => item.id !== dragState.id);
    const isOccupied = allOtherItems.some(otherItem =>
      checkCollision(currentItem, { x: snappedX, y: snappedY }, otherItem)
    );

    const finalPosition = isOccupied ? dragState.originalPos : { x: snappedX, y: snappedY };

    // Update state with final position
    if (isDraggingFolder) {
      setFolders(prev =>
        prev.map(f => (f.id === dragState.id ? { ...f, position: finalPosition } : f))
      );
       // Handle click/double-click for folders if not dragged
      const wasDragged = Math.abs(finalPosition.x - dragState.originalPos.x) > 5 || Math.abs(finalPosition.y - dragState.originalPos.y) > 5;
      if (!wasDragged) {
          if (doubleClickTimeout.current) {
              clearTimeout(doubleClickTimeout.current);
              doubleClickTimeout.current = null;
              handleOpenFolder(dragState.id);
          } else {
              setSelectedItemId(dragState.id);
              doubleClickTimeout.current = setTimeout(() => {
                  doubleClickTimeout.current = null;
              }, 300);
          }
      }
    } else {
      setWidgets(prev =>
        prev.map(w => (w.id === dragState.id ? { ...w, position: finalPosition } : w))
      );
    }

    setDragState(null);
  };

  if (dragState) {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp, { once: true });
  }

  return () => {
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };
}, [dragState, folders, widgets]);

  const handleMouseDownOnFolder = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    
    const folder = folders.find(f => f.id === id);
    if (!folder) return;

    setDragState({
      id,
      type: 'folder',
      offsetX: e.clientX - folder.position.x,
      offsetY: e.clientY - folder.position.y,
      originalPos: folder.position,
    });
  };

  const handleMouseDownOnWidget = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    
    const widget = widgets.find(w => w.id === id);
    if (!widget) return;

    setDragState({
      id,
      type: 'widget',
      offsetX: e.clientX - widget.position.x,
      offsetY: e.clientY - widget.position.y,
      originalPos: widget.position,
    });
  };


  const handleOpenFolder = async (id: string) => {
    try {
      const folderToOpen = folders.find(f => f.id === id);
      if (!folderToOpen || openWindows.some(w => w.id === id)) return;

      setSelectedItemId(null);

      // const centerPos = getWindowCenterPosition();
      const newWindow: WindowType = {
        ...folderToOpen,
        isOpen: true,
        isVisible: false, // Start hidden to allow for fade-in
        position: getInitialWindowPosition(),
        isAnimating: false,
        width: WINDOW_WIDTH, // <-- Add this
        height: WINDOW_HEIGHT, // <-- Add this
        isMaximized: false,
      };

      // 1. Add the hidden window to the state
      setOpenWindows(prev => [...prev, newWindow]);

      // 2. Use requestAnimationFrame to set isVisible to true on the next browser paint.
      // This triggers the CSS fade-in transition.
      requestAnimationFrame(() => {
        setOpenWindows(prev =>
          prev.map(w => (w.id === id ? { ...w, isVisible: true } : w))
        );
      });

    } catch (error) {
      console.error('Error opening folder:', error);
    }
  };

  const handleDockItemClick = async (
    item: { id: string; title: string; iconSrc: string; href: string },
    iconElement: HTMLElement,
    previewElement: HTMLElement
  ) => {
    try {
      if (item.id === "Siri") {
        setIsSiriOpen(true);
        return;
      }
      const existingWindow = openWindows.find(w => w.id === item.id);

      if (existingWindow) {
        // Close window with genie effect (exact reverse of opening)
        const windowElement = windowRefs.current.get(item.id);
        if (windowElement && previewElement) {
          // Hide the window instantly, then animate
          setOpenWindows(prev =>
            prev.map(w => w.id === item.id ? { ...w, isVisible: false } : w)
          );

          // Force immediate hiding
          windowElement.style.visibility = 'hidden';
          windowElement.style.opacity = '0';

          await genieCollapse(windowElement, previewElement, {
            onComplete: () => {
              requestAnimationFrame(() => {
                setOpenWindows(prev => prev.filter(w => w.id !== item.id));
              });
              console.log(`Window ${item.id} closed with genie effect`);
            }
          });
        } else {
          setOpenWindows(prev => prev.filter(w => w.id !== item.id));
          console.warn(`Missing elements for dock close animation: window=${!!windowElement}, preview=${!!previewElement}`);
        }
      } else {
        // Open window
        // const centerPos = getWindowCenterPosition();
        const newWindow: WindowType = {
          id: item.id,
          name: item.title,
          // position: { x: 0, y: 0 }, // Not used for dock items
          isOpen: true,
          isVisible: false, // Start hidden
          isAnimating: true,
          position: getInitialWindowPosition(),
          width: WINDOW_WIDTH,
          height: WINDOW_HEIGHT,
        };

        setOpenWindows(prev => [...prev, newWindow]);

        // Minimal delay to ensure DOM update, then animate immediately
        setTimeout(() => {
          const windowElement = windowRefs.current.get(item.id);
          if (windowElement && previewElement) {
            // Ensure window stays completely hidden during animation
            windowElement.style.visibility = 'hidden';
            windowElement.style.opacity = '0';

            genieExpand(previewElement, windowElement, {
              onComplete: () => {
                // Show the actual window instantly when animation completes
                requestAnimationFrame(() => {
                  setOpenWindows(prev =>
                    prev.map(w => w.id === item.id ? { ...w, isAnimating: false, isVisible: true } : w)
                  );
                });
                console.log(`Window ${item.id} opened from dock with genie effect`);
              }
            });
          } else {
            console.warn(`Missing elements for dock genie animation: window=${!!windowElement}, preview=${!!previewElement}`);
          }
        }, 10);
      }
    } catch (error) {
      console.error('Error handling dock item click:', error);
    }
  };

  const handleDisappear = (id: string) => {
  // Step 1: Set isVisible to false to trigger the fade-out animation in your ImprovedWindow component.
    setOpenWindows(prev =>
      prev.map(w => (w.id === id ? { ...w, isVisible: false } : w))
    );

    // Step 2: After the animation is finished (300ms), remove the window from the state completely.
    setTimeout(() => {
      setOpenWindows(prev => prev.filter(w => w.id !== id));
    }, 300); // This duration must match the 'duration-300' class in your CSS.
  };

  const handleCloseWindow = async (id: string) => {
    const isFolderWindow = initialFolders.some(folder => folder.id === id);

    if (isFolderWindow) {
      // --- FOLDER: Use Fade-Out Animation ---
      
      // 1. Trigger the fade-out by setting isVisible to false
      setOpenWindows(prev =>
        prev.map(w => (w.id === id ? { ...w, isVisible: false } : w))
      );

      // 2. Remove the window from the state after the animation completes
      setTimeout(() => {
        setOpenWindows(prev => prev.filter(w => w.id !== id));
      }, 300); // This duration MUST match the CSS transition duration

    } else {
      // --- DOCK ITEM: Use Genie Collapse Animation (Original Logic) ---
      try {
        const windowToClose = openWindows.find(w => w.id === id);
        if (!windowToClose) return;

        const windowElement = windowRefs.current.get(id);
        if (!windowElement) {
          setOpenWindows(prev => prev.filter(w => w.id !== id));
          return;
        }

        const dockPreview = document.querySelector(`[data-dock-preview="${id}"]`) as HTMLElement;
        if (dockPreview) {
          setOpenWindows(prev =>
            prev.map(w => w.id === id ? { ...w, isAnimating: true } : w)
          );
          await genieCollapse(windowElement, dockPreview, {
            onComplete: () => {
              requestAnimationFrame(() => {
                setOpenWindows(prev => prev.filter(w => w.id !== id));
              });
            }
          });
        } else {
          setOpenWindows(prev => prev.filter(w => w.id !== id));
        }
      } catch (error) {
        console.error('Error closing window:', error);
        setOpenWindows(prev => prev.filter(w => w.id !== id));
      }
    }
  };

  // Replace your entire handleMaximize function with this corrected version
  const handleMaximize = (id: string) => {
    const windowToMaximize = openWindows.find(w => w.id === id);
    if (!windowToMaximize) return;

    const windowElement = windowRefs.current.get(id);
    if (!windowElement) return;

    const { isMaximized, originalDimensions, width, height } = windowToMaximize;

    if (isMaximized) {
      // --- RESTORE THE WINDOW ---
      setOpenWindows(prev =>
        prev.map(w =>
          w.id === id ? {
            ...w,
            isMaximized: false,
            position: { x: originalDimensions!.x, y: originalDimensions!.y },
            width: originalDimensions!.w,
            height: originalDimensions!.h,
          } : w
        )
      );
    } else {
      // --- MAXIMIZE THE WINDOW ---
      const navbarHeight = navbarRef.current?.offsetHeight || 0;
      const dockHeight = dockRef.current?.offsetHeight || 0;
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      setOpenWindows(prev =>
        prev.map(w =>
          w.id === id ? {
            ...w,
            isMaximized: true,
            originalDimensions: { // Save current size and position
              x: windowElement.offsetLeft,
              y: windowElement.offsetTop,
              w: width,
              h: height,
            },
            position: { x: 0, y: navbarHeight }, // Position at top-left below navbar
            width: screenWidth, // Full screen width
            height: screenHeight - navbarHeight, // Full available height
          } : w
        )
      );
    }
  };

  const setFolderRef = (id: string, element: HTMLElement | null) => {
    if (element) {
      folderRefs.current.set(id, element);
    } else {
      folderRefs.current.delete(id);
    }
  };

  const setWindowRef = (id: string, element: HTMLElement | null) => {
    if (element) {
      windowRefs.current.set(id, element);
      console.log(`Window ref set for ${id}`);
    } else {
      windowRefs.current.delete(id);
      console.log(`Window ref removed for ${id}`);
    }
  };

  const [mounted, setMounted] = React.useState(false);

  // Handle mounting state
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render theme-dependent content until mounted
  if (!mounted) {
    return null; // or a loading placeholder
  }

  return (
    <div> 
      <div
        className="relative w-screen h-screen bg-cover bg-center overflow-hidden transition-all duration-500"
        style={{ backgroundImage: `url(${displayWallpaper})` }}
      >
        {/* BRIGHTNESS OVERLAY */}
        <div 
          className="absolute inset-0 bg-black transition-opacity duration-200 pointer-events-none z-9999999"
          style={{ opacity: brightnessOverlayOpacity }}
        />
        
        {loadingWallpaper && (
          <img 
            src={loadingWallpaper} 
            onLoad={handleImageLoad} 
            style={{ display: 'none' }}
            alt="Preloading wallpaper"
          />
        )}
        
        {/* <div
          className="relative w-screen h-screen bg-[url('/assets/wallpaper.jpg')] bg-cover bg-center overflow-hidden"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedItemId(null);
            }
          }}
        > */}
          <MacOSNavBar ref={navbarRef} onSearchClick={() => setIsSpotlightOpen(true)} onSiriClick={() => setIsSiriOpen(true)} onControlCentreClick={() => setIsControlCentreOpen(prev => !prev)} openWindow={openWindow}/>
          
          {/* Floating Dock with Preview Windows */}
          <FloatingDock
            ref={dockRef}
            mainItems={mainItems}
            secondaryItems={secondaryItems}
            onItemClick={handleDockItemClick}
            openWindows={openWindows.map(w => w.id)}
            desktopClassName="fixed bottom-2 left-1/2 -translate-x-1/2"
            mobileClassName="fixed bottom-2 right-4"
          />

          {/* Folders */}
          {folders.map((folder) => (
            <Folder
              key={folder.id}
              id={folder.id}
              name={folder.name}
              position={folder.position}
              isSelected={selectedItemId === folder.id}
              onMouseDown={handleMouseDownOnFolder}
              ref={(el) => setFolderRef(folder.id, el)}
            />
          ))}

          {widgets.map((widget) => (
            <Widget
              key={widget.id}
              id={widget.id}
              position={widget.position}
              width={widget.width}
              height={widget.height}
              onMouseDown={handleMouseDownOnWidget}
              isDragging={dragState?.id === widget.id}
            >
              {widget.component}
            </Widget>
          ))}
          
          <AnimatePresence>
            {isControlCentreOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsControlCentreOpen(false)}
                  className="fixed inset-0 z-999998"
                />
                <ControlCentre />
              </>
            )}
          </AnimatePresence>

          <SpotlightSearch
            isOpen={isSpotlightOpen}
            onClose={() => setIsSpotlightOpen(false)}
            searchableItems={searchableItems}
            onSelectItem={handleSpotlightSelect}
          />

          {/* Windows */}
          {openWindows.map((windowData) => (
            windowData.id !== "Siri" ? (
              <Window
                key={windowData.id}
                title={windowData.name}
                onClose={() => handleCloseWindow(windowData.id)}
                onMinimize={() => handleDisappear(windowData.id)}
                onMaximize={() => handleMaximize(windowData.id)}
                isVisible={windowData.isVisible}
                isMaximized={windowData.isMaximized}
                isAnimating={windowData.isAnimating}
                position={windowData.position}
                width={windowData.width}
                height={windowData.height}
                ref={(el) => setWindowRef(windowData.id, el)}
              >
                {getWindowContent(windowData.id, windowData.isMaximized)}
              </Window>
            ) : (
              <Siri 
                key="Siri"
                isOpen={true}
                onClose={() => setIsSiriOpen(false)}
                openWindow={openWindow}
              />
            )
          ))}

          <Siri 
            isOpen={isSiriOpen}
            onClose={() => setIsSiriOpen(false)}
            openWindow={openWindow} // Pass the openWindow function so Siri can open apps
          />
        </div>
      </div>
    // </div>
  );
}

export default function Desktop() {
  return (
      <DesktopContent />
  );
}
