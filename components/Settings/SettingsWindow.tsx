"use client";

import React, { useState } from 'react';
import { useSettings, wallpapers } from '../Settings/SettingsContext';
import { Sun, Volume2, Wallpaper, Check, Monitor, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

type SettingView = 'display' | 'sound' | 'wallpaper' | 'appearance';

export const SystemSettingsWindow = () => {
  const [activeView, setActiveView] = useState<SettingView>('wallpaper');

  const requestFullScreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  };

  return (
    <div className="w-full h-full bg-[#2E2E2E] flex text-white">
      <div className="w-56 h-full bg-black/20 p-3 flex flex-col gap-1">
        <SidebarButton label="Appearance" icon={<Palette size={18} />} isActive={activeView === 'appearance'} onClick={() => setActiveView('appearance')} />
        <SidebarButton label="Wallpaper" icon={<Wallpaper size={18} />} isActive={activeView === 'wallpaper'} onClick={() => setActiveView('wallpaper')} />
        <SidebarButton label="Display" icon={<Monitor size={18} />} isActive={activeView === 'display'} onClick={() => setActiveView('display')} />
        <SidebarButton label="Sound" icon={<Volume2 size={18} />} isActive={activeView === 'sound'} onClick={() => setActiveView('sound')} />
      </div>
      <div className="flex-grow p-8 overflow-y-auto">
        {activeView === 'appearance' && <AppearanceSettings />}
        {activeView === 'wallpaper' && <WallpaperSettings />}
        {activeView === 'display' && <DisplaySettings onFullScreen={requestFullScreen} />}
        {activeView === 'sound' && <SoundSettings />}
      </div>
    </div>
  );
};

const SidebarButton = ({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) => (
  <button onClick={onClick} className={cn("flex items-center w-full text-left gap-3 p-2 rounded-md text-sm text-neutral-200 transition-colors", isActive ? "bg-blue-600" : "hover:bg-white/10")}>
    {icon} <span>{label}</span>
  </button>
);

const AppearanceSettings = () => {
  const { settings, setTheme } = useSettings();
  return (
    <div>
      <h2 className="text-2xl font-bold">Appearance</h2>
      <div className="flex gap-4 mt-4">
        <button onClick={() => setTheme('light')} className={cn("w-32 h-20 rounded-lg border-2", settings.theme === 'light' ? 'border-blue-500' : 'border-neutral-600')}>Light</button>
        <button onClick={() => setTheme('dark')} className={cn("w-32 h-20 rounded-lg border-2 bg-neutral-800", settings.theme === 'dark' ? 'border-blue-500' : 'border-neutral-600')}>Dark</button>
      </div>
    </div>
  );
};

const WallpaperSettings = () => {
  const { settings, setWallpaper } = useSettings();
  return (
    <div>
      <h2 className="text-2xl font-bold">Wallpaper</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {wallpapers.map(wp => (
          <button key={wp} onClick={() => setWallpaper(wp)} className="relative rounded-lg overflow-hidden border-4 border-transparent hover:border-blue-500 transition-all">
            <img src={wp} alt="Wallpaper thumbnail" className="w-full h-24 object-cover" />
            {settings.wallpaper === wp && <div className="absolute inset-0 border-4 border-blue-500 rounded-lg flex items-center justify-center bg-black/30"><Check size={32} /></div>}
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
      <h2 className="text-2xl font-bold">Display</h2>
      <div className="mt-6">
        <label htmlFor="brightness" className="text-sm font-medium">Brightness</label>
        <div className="flex items-center gap-3 mt-2">
          <Sun size={18} />
          <input id="brightness" type="range" min="20" max="100" value={settings.brightness} onChange={(e) => setBrightness(Number(e.target.value))} className="w-full h-2 bg-neutral-600 rounded-lg appearance-none cursor-pointer" />
        </div>
      </div>
      <div className="mt-8">
        <button onClick={onFullScreen} className="px-4 py-2 text-sm bg-neutral-600 hover:bg-neutral-500 rounded-lg">Enter Full Screen</button>
      </div>
    </div>
  );
};

const SoundSettings = () => {
  const { settings, setSound } = useSettings();
  return (
    <div>
      <h2 className="text-2xl font-bold">Sound</h2>
       <div className="mt-6">
        <label htmlFor="sound" className="text-sm font-medium">Output Volume</label>
        <div className="flex items-center gap-3 mt-2">
          <Volume2 size={18} />
          <input id="sound" type="range" min="0" max="100" value={settings.sound} onChange={(e) => setSound(Number(e.target.value))} className="w-full h-2 bg-neutral-600 rounded-lg appearance-none cursor-pointer" />
        </div>
      </div>
    </div>
  );
};