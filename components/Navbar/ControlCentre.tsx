"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSettings } from '../Settings/SettingsContext';
import { 
  Sun, Volume2, Wifi, Bluetooth, Airplay, Moon, // Added Moon, Airplay (for AirDrop icon)
  Tv, // For full screen icon
  Palette, // For theme switcher icon
  Music3, // for spotify icon
  Maximize, // for full screen
  Speaker, // For sound output
  Lightbulb, // For light theme
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Helper component for the individual toggle buttons (Wi-Fi, Bluetooth, AirDrop)
const ControlToggle = ({ icon, label, status, isActive, onClick }: {
  icon: React.ReactNode;
  label: string;
  status: string;
  isActive: boolean;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 p-2 rounded-md transition-colors w-full ",
      isActive ? "bg-white text-black" : "bg-white/20 text-black hover:bg-white/30"
    )}
  >
    <div className={cn(
      "w-8 h-8 rounded-full flex items-center justify-center",
      isActive ? "bg-white/20" : "bg-white/10"
    )}>
      {icon}
    </div>
    <div className="flex flex-col items-start text-sm">
      <span className="font-medium">{label}</span>
      <span className="text-xs opacity-75">{status}</span>
    </div>
  </button>
);

// Helper component for theme/fullscreen buttons (Stage Manager / Screen Mirroring replacements)
const MiniButton = ({ icon, label, isActive, onClick }: {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "flex flex-col items-center justify-center p-2 rounded-lg text-black h-20 w-full transition-colors shadow-xl",
      isActive ? "bg-white" : "bg-white/20 hover:bg-white/30"
    )}
  >
    <div className={cn(
      "w-10 h-10 rounded-full flex items-center justify-center mb-1",
      isActive ? "bg-white/20" : "bg-white/10"
    )}>
      {icon}
    </div>
    <span className="text-xs font-medium">{label}</span>
  </button>
);


export const ControlCentre = () => {
  const { settings, setBrightness, setSound, setTheme } = useSettings();
  const [isWifiOn, setIsWifiOn] = useState(true);
  const [isBluetoothOn, setIsBluetoothOn] = useState(true);
  const [isAirdropOn, setIsAirdropOn] = useState(true);
  const [isDndOn, setIsDndOn] = useState(false); // Do Not Disturb
  const [isFullScreenActive, setIsFullScreenActive] = useState(false);


  const requestFullScreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
      setIsFullScreenActive(true);
    } else if ((document.documentElement as any).webkitRequestFullscreen) { // Safari
      (document.documentElement as any).webkitRequestFullscreen();
      setIsFullScreenActive(true);
    }
  };

  const exitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
      setIsFullScreenActive(false);
    } else if ((document as any).webkitExitFullscreen) { // Safari
      (document as any).webkitExitFullscreen();
      setIsFullScreenActive(false);
    }
  };

  const handleFullScreenToggle = () => {
    if (document.fullscreenElement || (document as any).webkitFullscreenElement) {
      exitFullScreen();
    } else {
      requestFullScreen();
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      // Position on the right side of the navbar
      className="absolute top-9 right-4 w-[24rem] p-3 
                 bg-neutral-300 backdrop-blur-2xl rounded-2xl 
                 text-black border border-white/20 shadow-xl z-50" // Ensure a high z-index
    >
      <div className="grid grid-cols-2 gap-3 ">
        {/* Connectivity Toggles (Top Left) */}
        <div className="col-span-1 flex flex-col gap-2 p-2 bg-white/20 rounded-xl text-black shadow-xl">
          <ControlToggle
            icon={<Wifi size={18} />}
            label="Wi-Fi"
            status={isWifiOn ? "ORBI50" : "Off"}
            isActive={isWifiOn}
            onClick={() => setIsWifiOn(!isWifiOn)}
          />
          <ControlToggle
            icon={<Bluetooth size={18} />}
            label="Bluetooth"
            status={isBluetoothOn ? "On" : "Off"}
            isActive={isBluetoothOn}
            onClick={() => setIsBluetoothOn(!isBluetoothOn)}
          />
          <ControlToggle
            icon={<Airplay size={18} />} // Using Airplay icon for AirDrop
            label="AirDrop"
            status={isAirdropOn ? "Everyone" : "Off"}
            isActive={isAirdropOn}
            onClick={() => setIsAirdropOn(!isAirdropOn)}
          />
        </div>

        {/* Theme Switcher & Full Screen (Middle Right) */}
        <div className="col-span-1 flex flex-col gap-2">
          <MiniButton
            icon={settings.theme === 'dark' ? <Moon size={20} /> : <Lightbulb size={20} />}
            label={settings.theme === 'dark' ? "Dark Mode" : "Light Mode"}
            isActive={settings.theme === 'dark'} // Active when dark mode
            onClick={() => setTheme(settings.theme === 'dark' ? 'light' : 'dark')}
          />
          <MiniButton
            icon={<Maximize size={20} />}
            label="Full Screen"
            isActive={isFullScreenActive}
            onClick={handleFullScreenToggle}
          />
        </div>

        {/* Display Slider */}
        <div className="col-span-2 p-2 bg-white/20 rounded-xl shadow-xl">
          <div className="flex items-center gap-3">
            <Sun size={18} />
            <input 
              type="range" 
              min="20" // Min brightness to avoid completely black screen
              max="100" 
              value={settings.brightness} 
              onChange={(e) => setBrightness(Number(e.target.value))} 
              className="w-full h-2 bg-white/30 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md" 
            />
          </div>
        </div>

        {/* Sound Slider */}
        <div className="col-span-2 p-2 bg-white/20 rounded-xl shadow-xl">
          <div className="flex items-center gap-3">
            <Volume2 size={18} />
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={settings.sound} 
              onChange={(e) => setSound(Number(e.target.value))} 
              className="w-full h-2 bg-white/30 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md" 
            />
             <Speaker size={18} /> {/* Speaker icon on the right */}
          </div>
        </div>

        {/* Spotify Embed (Music Section) */}
        <div className="col-span-2 bg-white/20 rounded-xl flex items-center justify-center shadow-xl">
            {/* Replace this with your actual Spotify embed code */}
            <iframe 
                src="https://open.spotify.com/embed/track/44aTAUBF0g6sMkMNE8I5kd?utm_source=generator" 
                width="100%" 
                height="80" 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="eager"
                className="rounded-lg border-0"
            ></iframe>
        </div>

      </div>
    </motion.div>
  );
};