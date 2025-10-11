import React, { useState } from 'react';
import { fileSystem, favorites, type File, type Folder } from '@/lib/fileSystemData';
import { IconLayoutGrid, IconList, IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// A new, more robust type for our history state
type HistoryEntry = {
  title: string;
  items: (File | Folder)[];
};

export const FinderWindowContent = ({ openWindow, isMaximized }: { openWindow: (id: string) => void, isMaximized?: boolean }) => {
  // 1. Update the history state to store objects with titles
  const [history, setHistory] = useState<HistoryEntry[]>([{ title: 'Finder', items: fileSystem }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'icons' | 'list'>('icons');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Derive current items and title directly from the history state
  const currentItems = history[historyIndex]?.items || [];
  const currentTitle = history[historyIndex]?.title || 'Finder';

  const handleSelectItem = (itemId: string) => {
    setSelectedItemId(itemId);
  };
  
  const handleItemDoubleClick = (item: File | Folder) => {
    if (item.type === 'folder') {
      const newHistoryEntry: HistoryEntry = { title: item.name, items: item.children };
      const newHistory = [...history.slice(0, historyIndex + 1), newHistoryEntry];
      setHistory(newHistory);
      setHistoryIndex(historyIndex + 1);
      setSelectedItemId(null);
    } else {
      openWindow(item.opens);
    }
  };
  
  // 2. This function is now corrected to properly handle navigation
  const handleFavoriteClick = (favId: string) => {
    // This is a simplified search. A real app would use a recursive search.
    const findItemRecursive = (items: (File | Folder)[], id: string): (File | Folder) | null => {
        for (const item of items) {
            if (item.id === id) return item;
            if (item.type === 'folder') {
                const found = findItemRecursive(item.children, id);
                if (found) return found;
            }
        }
        return null;
    };

    const targetItem = findItemRecursive(fileSystem, favId);
    if (!targetItem) return;

    if (targetItem.type === 'folder') {
        const newHistory: HistoryEntry[] = [{ title: 'Hargun', items: fileSystem }, { title: targetItem.name, items: targetItem.children }];
        setHistory(newHistory);
        setHistoryIndex(1);
    } else {
      openWindow(targetItem.opens);
    }
    setSelectedItemId(null);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setSelectedItemId(null);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setSelectedItemId(null);
    }
  };
  
  const specialProjectIds = new Set(['project02', 'project08']);

  return (
    <div className="flex h-full w-full bg-white text-black" onClick={() => setSelectedItemId(null)}>
      {/* --- Sidebar --- */}
      <div className="flex-shrink-0 w-1/4 max-w-[200px] h-full bg-gray-100/80 dark:bg-neutral-700/90 border-r border-gray-300 dark:border-neutral-600 flex flex-col p-1 ">
        <h3 className="px-2 text-xs font-bold text-gray-500 dark:text-white/80 mb-2">Favorites</h3>
        <ul className="text-sm space-y-1">
          {favorites.map((item) => (
            <li
              key={item.id}
              onClick={(e) => { e.stopPropagation(); handleFavoriteClick(item.id); }}
              className="flex items-center gap-2 w-full text-left py-1.5 px-3 rounded-lg cursor-pointer dark:text-white hover:bg-gray-200 dark:hover:bg-neutral-700/80 text-gray-800"
            >
              <img src={item.icon} alt={item.name} className="w-4 h-4" />
              <span>{item.name}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* --- Main Content Area --- */}
      <div className="flex-grow h-full flex flex-col dark:bg-neutral-700 dark:text-white">
        {/* Top Toolbar */}
        <div className="flex items-center p-2 border-b border-gray-200 dark:border-neutral-600 bg-gray-50/50 dark:bg-neutral-700">
          <div className="flex items-center gap-1">
            <button onClick={goBack} disabled={historyIndex === 0} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-neutral-600 disabled:opacity-50">
              <ChevronLeft size={16} />
            </button>
            <button onClick={goForward} disabled={historyIndex >= history.length - 1} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-neutral-600 disabled:opacity-50">
              <ChevronRight size={16} />
            </button>
          </div>
          {/* 3. Render the current folder's title */}
          <div className="flex-grow text-center">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-white">{currentTitle}</h2>
          </div>
          <div className="flex items-center gap-1 bg-gray-200 dark:bg-neutral-600 p-0.5 rounded-md">
            <button onClick={() => setViewMode('icons')} className={`p-1 rounded ${viewMode === 'icons' ? 'bg-white dark:bg-neutral-700 shadow' : ''}`}>
              <IconLayoutGrid size={16} />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-1 rounded ${viewMode === 'list' ? 'bg-white dark:bg-neutral-700 shadow' : ''}`}>
              <IconList size={16} />
            </button>
          </div>
        </div>
        {/* File/Folder View */}
        <div className="flex-grow p-1 overflow-y-auto">
          {viewMode === 'icons' ? (
           <div className={cn(
              "grid gap-1",
              isMaximized ? "grid-cols-12" : "grid-cols-4" // 8 columns when maximized, 4 otherwise
            )}>
              {currentItems.map((item: File | Folder) => {
                const isSpecialProject = specialProjectIds.has(item.id);
                return (
                  <div key={item.id} onClick={(e) => {e.stopPropagation(); handleSelectItem(item.id); }} onDoubleClick={() => handleItemDoubleClick(item)} className={cn("flex flex-col items-center text-center p-2 rounded-lg cursor-pointer",
                    selectedItemId === item.id ? "bg-blue-300/50 dark:bg-neutral-500" : "hover:bg-blue-100/50 dark:hover:bg-neutral-600/50"
                )}
                
                >
                  <img
                    src={item.icon}
                    alt={item.name}
                    className={cn(
                      "w-16 h-16 mb-1",
                      isSpecialProject ? "invert dark:invert-0" : ""
                    )}
                  />
                  <span className="text-xs">{item.name}</span>
                </div>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col text-sm dark:border-neutral-600">
              {currentItems.map((item: File | Folder) => {
                const isSpecialProject = specialProjectIds.has(item.id);
                return (
                  <div key={item.id} onClick={(e) => {e.stopPropagation(); handleSelectItem(item.id); }} onDoubleClick={() => handleItemDoubleClick(item)}  className={cn("flex items-center gap-2 p-2 rounded-lg cursor-pointer border-b border-neutral-200 dark:border-neutral-600",
                    selectedItemId === item.id ? "bg-blue-300/50 dark:bg-neutral-500" : "hover:bg-blue-100/50 hover:dark:bg-neutral-600/50"
                )}>
                  <img
                    src={item.icon}
                    alt={item.name}
                    className={cn(
                      "w-6 h-6",
                      isSpecialProject ? "invert dark:invert-0" : ""
                    )}
                    />
                  <span>{item.name}</span>
                </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};