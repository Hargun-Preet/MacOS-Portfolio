"use client";

import React, { useState } from 'react';
import { useSettings, wallpapers } from '../Settings/SettingsContext';
import { Sun, Volume2, Wallpaper, Check, Monitor, Palette, SunDim, PartyPopper, Cog } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';


type SettingView = 'display' | 'night-shift' | 'wallpaper' | 'appearance' | 'general';

export const SystemSettingsWindow = () => {
  const [activeView, setActiveView] = useState<SettingView>('wallpaper');

  const requestFullScreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  };

  return (
    <div className="w-full h-full bg-white dark:bg-neutral-700 flex text-black dark:text-white">
      <div className="w-48 h-full bg-neutral-100 dark:bg-neutral-600 text-black dark:text-white p-2 flex flex-col gap-1">
        <h3 className='mt-1 text-sm'>System Settings</h3>
        <SidebarButton label="Wallpaper" icon={<Wallpaper className='ml-1' size={18} />} isActive={activeView === 'wallpaper'} onClick={() => setActiveView('wallpaper')} />
        <SidebarButton label="Appearance" icon={<Palette className='ml-1' size={18} />} isActive={activeView === 'appearance'} onClick={() => setActiveView('appearance')} />
        <SidebarButton label="Display" icon={<Monitor className='ml-1' size={18} />} isActive={activeView === 'display'} onClick={() => setActiveView('display')} />
        <SidebarButton label="Night Light" icon={<SunDim className='ml-1' size={18} />} isActive={activeView === 'night-shift'} onClick={() => setActiveView('night-shift')} />
        <SidebarButton label="Advanced Settings" icon={<Cog className='ml-1' size={18} />} isActive={activeView === 'general'} onClick={() => setActiveView('general')} />
      </div>
      <div className="flex-grow p-8 overflow-y-auto">
        {activeView === 'appearance' && <AppearanceSettings />}
        {activeView === 'wallpaper' && <WallpaperSettings />}
        {activeView === 'display' && <DisplaySettings onFullScreen={requestFullScreen} />}
        {activeView === 'night-shift' && <NightShiftSettings />}
        {activeView === 'general' && <GeneralSettings />}
      </div>
    </div>
  );
};

const SidebarButton = ({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) => (
  <button onClick={onClick} className={cn("flex items-center w-full text-left gap-3 p-2 rounded-md text-sm text-black dark:text-white transition-colors", isActive ? "bg-blue-500 hover:bg-blue-400 text-white" : " hover:bg-neutral-200 dark:hover:bg-white/10")}>
    {icon} <span>{label}</span>
  </button>
);

const AppearanceSettings = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Appearance</h2>

      {/* Constrained and responsive grid container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
        
        {/* Light Theme Button/Card */}
        <button 
          onClick={() => setTheme('light')} 
          className={cn(
            "rounded-lg border-2 p-4 flex flex-col items-start gap-2 transition-colors aspect-[4/3] bg-white",
            theme === 'light' ? 'border-blue-500' : 'border-neutral-300 hover:border-neutral-400'
          )}
        >
          {/* Visual representation of a light UI */}
          <div className="w-5 h-5 rounded-full bg-blue-500"></div>
          <div className="w-full h-1.5 rounded-full bg-gray-200"></div>
          <div className="w-2/3 h-1.5 rounded-full bg-gray-200"></div>
          <span className="mt-auto font-semibold text-black">Light</span>
        </button>

        {/* Dark Theme Button/Card */}
        <button 
          onClick={() => setTheme('dark')} 
          className={cn(
            "rounded-lg border-2 p-4 flex flex-col items-start gap-2 transition-colors aspect-[4/3] bg-neutral-800",
            theme === 'dark' ? 'border-blue-500' : 'border-neutral-600 hover:border-neutral-500'
          )}
        >
          {/* Visual representation of a dark UI */}
          <div className="w-5 h-5 rounded-full bg-blue-500"></div>
          <div className="w-full h-1.5 rounded-full bg-neutral-600"></div>
          <div className="w-2/3 h-1.5 rounded-full bg-neutral-600"></div>
          <span className="mt-auto font-semibold text-white">Dark</span>
        </button>

      </div>
    </div>
  );
};

const WallpaperSettings = () => {
  const { settings, setWallpaper } = useSettings();
  return (
    <div>
      <h2 className="text-2xl font-bold">Wallpaper</h2>
      
      <div className="grid grid-cols-2 gap-2 mt-4">
        {wallpapers.map(wp => (
          <button 
            key={wp.id} 
            onClick={() => setWallpaper(wp.fullUrl)} 
            className="relative aspect-video rounded-xl overflow-hidden border-4 border-transparent hover:border-blue-300 focus:border-blue-500 outline-none transition-all"
          >
            <img 
              src={wp.thumbnailUrl} 
              alt="Wallpaper thumbnail" 
              className="absolute inset-0 w-full h-full object-cover" 
              loading="lazy"
            />
            
            {settings.wallpaper === wp.fullUrl && (
              <div className="absolute inset-0 border-4 border-blue-500 rounded-lg flex items-center justify-center bg-black/50">
                <Check className='text-white' size={32} />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

const DisplaySettings = ({ onFullScreen }: { onFullScreen: () => void }) => {
  const { settings, setBrightness } = useSettings();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-8">Display</h2>

      {/* --- NEW: Container with a max-width to keep the layout clean --- */}
      <div className="space-y-8 max-w-md">

        {/* --- NEW: Two-column layout for the brightness setting --- */}
        <div className="flex items-center justify-between">
          <label htmlFor="brightness" className="font-medium text-black dark:text-white">
            Brightness
          </label>
          <div className="flex items-center gap-3 w-60"> {/* Fixed width for the control */}
            <Sun size={18} className="text-black dark:text-white flex-shrink-0" />
            <input 
              id="brightness" 
              type="range" 
              min="20" 
              max="100" 
              value={settings.brightness} 
              onChange={(e) => setBrightness(Number(e.target.value))} 
              className="w-full h-1 bg-neutral-300 dark:bg-neutral-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:bg-neutral-500 dark:[&::-webkit-slider-thumb]:bg-neutral-300 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none"
            />
          </div>
        </div>

        {/* --- NEW: Two-column layout for the full screen setting for consistency --- */}
        <div className="flex items-center justify-between">
          <label className="font-medium text-black dark:text-white">
            Display Mode
          </label>
          <button 
            onClick={onFullScreen} 
            className="px-3 py-3 text-sm bg-neutral-200 dark:bg-neutral-800/50 hover:bg-neutral-300 dark:hover:bg-neutral-800/80 rounded-xl transition-colors"
          >
            Enter Full Screen
          </button>
        </div>

      </div>
    </div>
  );
};

const NightShiftSettings = () => {
  const { settings, setNightShift } = useSettings();

  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold mb-3">Night Light</h2>
        <p className="text-xs text-neutral-400">Warmer screen color after dark.</p>
      </div>
      
      {/* --- The Toggle Switch --- */}
      <button
        onClick={() => setNightShift(!settings.nightShift)}
        className={cn(
          // Removed focus:ring-2 and focus:ring-offset-* classes
          "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
          settings.nightShift ? "bg-blue-600" : "bg-neutral-600"
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
            settings.nightShift ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
};

const GeneralSettings = () => {
  const { settings, setPartyMode } = useSettings();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-8">Advanced</h2>
      <div className="space-y-8 max-w-md">
        <div className="flex items-center justify-between p-4 bg-neutral-200 dark:bg-white/5 rounded-lg">
          <div>
            <div className="flex items-center gap-2">
              <PartyPopper size={18} className="text-purple-400" />
              <label className="font-medium text-black dark:text-white ">Party Mode</label>
            </div>
            <p className="text-xs text-neutral-400 mt-1">Bring on the colors!</p>
          </div>
          <button
            onClick={() => setPartyMode(!settings.partyMode)}
            className={cn(
              // Removed focus:ring-2 and focus:ring-offset-* classes
              "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
              settings.partyMode ? "bg-purple-500" : "bg-neutral-500"
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                settings.partyMode ? "translate-x-5" : "translate-x-0"
              )}
            />
          </button>
        </div>
      </div>
    </div>
  );
};