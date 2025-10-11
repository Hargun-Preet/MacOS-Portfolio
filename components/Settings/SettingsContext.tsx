"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useTheme } from 'next-themes'; // ✅ Import next-themes

export type Wallpaper = {
  id: string;
  thumbnailUrl: string;
  fullUrl: string;
};

// Define the list of available wallpapers for the settings panel
export const wallpapers: Wallpaper[] = [
  { id: 'wp1', thumbnailUrl: '/assets/compressed/wallpaper.jpg', fullUrl: '/assets/wallpaper/wallpaper.jpg' },
  { id: 'wp2', thumbnailUrl: '/assets/compressed/wallpaper2.jpg', fullUrl: '/assets/wallpaper/wallpaper2.jpg' },
  { id: 'wp3', thumbnailUrl: '/assets/compressed/wallpaper3.jpg', fullUrl: '/assets/wallpaper/wallpaper3.jpg' },
  { id: 'wp4', thumbnailUrl: '/assets/compressed/wallpaper4.jpg', fullUrl: '/assets/wallpaper/wallpaper4.jpg' },
  { id: 'wp5', thumbnailUrl: '/assets/compressed/wallpaper5.jpg', fullUrl: '/assets/wallpaper/wallpaper5.jpg' },
  { id: 'wp6', thumbnailUrl: '/assets/compressed/wallpaper6.jpg', fullUrl: '/assets/wallpaper/wallpaper6.jpg' },
  { id: 'wp7', thumbnailUrl: '/assets/compressed/wallpaper7.jpg', fullUrl: '/assets/wallpaper/wallpaper7.jpg' },
  { id: 'wp8', thumbnailUrl: '/assets/compressed/wallpaper8.jpg', fullUrl: '/assets/wallpaper/wallpaper8.jpg' },
  { id: 'wp9', thumbnailUrl: '/assets/compressed/wallpaper9.jpg', fullUrl: '/assets/wallpaper/wallpaper9.jpg' },
  { id: 'wp10', thumbnailUrl: '/assets/compressed/wallpaper10.jpg', fullUrl: '/assets/wallpaper/wallpaper10.jpg' },
];

type Theme = 'dark' | 'light';

interface Settings {
  wallpaper: string;
  brightness: number; // 0-100
  sound: number;      // 0-100
  theme: Theme;
  nightShift: boolean;
  partyMode: boolean;
}

interface SettingsContextType {
  settings: Settings;
  setWallpaper: (wallpaper: string) => void;
  setBrightness: (brightness: number) => void;
  setSound: (sound: number) => void;
  setTheme: (theme: Theme) => void;
  setNightShift: (enabled: boolean) => void;
  setPartyMode: (enabled: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const { theme, setTheme: setNextTheme } = useTheme(); // ✅ Get from next-themes

  const [settings, setSettings] = useState<Settings>(() => ({
    wallpaper: wallpapers[0].fullUrl,
    brightness: 100,
    sound: 75,
    theme: 'dark', // Default; actual theme will be synced in useEffect
    nightShift: false,
    partyMode: false,
  }));

  // ✅ Sync internal settings.theme with next-themes' theme
  useEffect(() => {
    if (theme === 'light' || theme === 'dark') {
      setSettings((prev) => ({ ...prev, theme }));
    }
  }, [theme]);

  useEffect(() => {
    if (settings.nightShift) {
      document.documentElement.classList.add('night-shift-enabled');
    } else {
      document.documentElement.classList.remove('night-shift-enabled');
    }
  }, [settings.nightShift]);

  useEffect(() => {
    if (settings.partyMode) {
      document.documentElement.classList.add('party-mode');
    } else {
      document.documentElement.classList.remove('party-mode');
    }
  }, [settings.partyMode]);

  const setWallpaper = (wallpaper: string) => setSettings(prev => ({ ...prev, wallpaper }));
  const setBrightness = (brightness: number) => setSettings(prev => ({ ...prev, brightness }));
  const setSound = (sound: number) => setSettings(prev => ({ ...prev, sound }));

  // ✅ Use next-themes' setTheme
  const setTheme = (newTheme: Theme) => {
    setNextTheme(newTheme);
    setSettings(prev => ({ ...prev, theme: newTheme })); // Keep internal state in sync
  };

  const setNightShift = (enabled: boolean) => setSettings(prev => ({ ...prev, nightShift: enabled }));
  const setPartyMode = (enabled: boolean) => setSettings(prev => ({ ...prev, partyMode: enabled }));

  return (
    <SettingsContext.Provider value={{ settings, setWallpaper, setBrightness, setSound, setTheme, setNightShift, setPartyMode }}>
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
