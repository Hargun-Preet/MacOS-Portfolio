"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { SearchableItem } from '../Desktop/Desktop'; // Adjust import path as needed
import { cn } from '@/lib/utils';

interface SpotlightSearchProps {
  isOpen: boolean;
  onClose: () => void;
  searchableItems: SearchableItem[];
  onSelectItem: (item: SearchableItem) => void;
}

export const SpotlightSearch: React.FC<SpotlightSearchProps> = ({ isOpen, onClose, searchableItems, onSelectItem }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchableItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the input when Spotlight opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    } else {
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Filter results when the query changes
  useEffect(() => {
    if (query.length > 0) {
      const filtered = searchableItems.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
    setSelectedIndex(0);
  }, [query, searchableItems]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (results.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + results.length) % (results.length || 1));
    } else if (e.key === 'Enter') {
      if (results[selectedIndex]) {
        onSelectItem(results[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const hasResults = results.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50000 flex justify-center pt-[10%] bg-black/10"
          onMouseDown={onClose}
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onMouseDown={(e) => e.stopPropagation()}
            className={cn(
              "w-full max-w-xl overflow-hidden rounded-lg bg-neutral-800/80 backdrop-blur-2xl border border-white/10 shadow-2xl",
              // Adjust container height based on results
              results.length === 0 ? "h-[52px]" : "max-h-[60vh]"
            )}
          >
            {/* Search Input - Always maintain consistent styling */}
            <div className="flex items-center p-3 border-b border-white/10">
              <Search className="text-neutral-400 mr-3" size={20} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Spotlight Search"
                className="w-full bg-transparent text-white text-xl placeholder-neutral-500 focus:outline-none"
              />
            </div>
            
            {/* Results Section - Use AnimatePresence for smooth height animation */}
            <AnimatePresence mode="wait">
              {results.length > 0 && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "60vh", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-2 max-h-[60vh] overflow-y-hidden">
                    {results.map((item, index) => (
                      <motion.li
                        key={item.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        onMouseDown={() => onSelectItem(item)}
                        className={`p-2 flex items-center gap-3 rounded-md cursor-pointer ${
                          index === selectedIndex ? 'bg-blue-600' : 'hover:bg-white/10'
                        }`}
                      >
                        <img src={item.icon} alt={item.name} className="w-8 h-8 rounded-md" />
                        <div>
                          <p className="text-white font-medium">{item.name}</p>
                          <p className="text-neutral-400 text-xs">{item.type}</p>
                        </div>
                      </motion.li>
                    ))}
                  </div>
                </motion.ul>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};