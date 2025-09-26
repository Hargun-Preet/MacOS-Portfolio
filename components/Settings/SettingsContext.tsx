"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Define the list of available wallpapers for the settings panel
export const wallpapers = [
  '/assets/wallpaper.jpg',
  '/assets/wallpaper.jpg',
  '/assets/wallpaper.jpg',
  '/assets/wallpaper.jpg',
];

type Theme = 'dark' | 'light'; // Define the theme type

interface Settings {
  wallpaper: string;
  brightness: number; // 0-100
  sound: number;      // 0-100
  theme: Theme;       // Add theme to settings
}

interface SettingsContextType {
  settings: Settings;
  setWallpaper: (wallpaper: string) => void;
  setBrightness: (brightness: number) => void;
  setSound: (sound: number) => void;
  setTheme: (theme: Theme) => void; // Add setTheme to context type
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    // Initialize theme from localStorage or default to 'dark'
    const storedTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') as Theme : 'dark';
    return {
      wallpaper: wallpapers[0],
      brightness: 100,
      sound: 75,
      theme: storedTheme || 'dark', // Use stored theme or default
    };
  });

  // Effect to apply theme class to body and save to localStorage
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(settings.theme);
    localStorage.setItem('theme', settings.theme);
  }, [settings.theme]);

  const setWallpaper = (wallpaper: string) => setSettings(prev => ({ ...prev, wallpaper }));
  const setBrightness = (brightness: number) => setSettings(prev => ({ ...prev, brightness }));
  const setSound = (sound: number) => setSettings(prev => ({ ...prev, sound }));
  const setTheme = (theme: Theme) => setSettings(prev => ({ ...prev, theme })); // Implement setTheme

  return (
    <SettingsContext.Provider value={{ settings, setWallpaper, setBrightness, setSound, setTheme }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};