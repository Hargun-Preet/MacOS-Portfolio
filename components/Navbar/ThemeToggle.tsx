"use client";

import { useTheme } from 'next-themes';
import { useSettings } from '../Settings/SettingsContext';
import { Sun, Moon } from 'lucide-react';

export const ModeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <button 
      onClick={toggleTheme} 
      className="p-1 px-2 rounded hover:bg-black/10 dark:hover:bg-black/20 focus:outline-none ring-0"
      aria-label="Toggle theme"
    >
      {/* 3. The icon now changes based on the SHARED theme state */}
      {theme === 'dark' ? (
        <Sun size={16} className="text-white"/> // In dark mode, show a sun
      ) : (
        <Moon size={16} className="text-black"/> // In light mode, show a moon
      )}
    </button>
  );
};