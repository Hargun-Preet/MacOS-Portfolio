"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useSettings } from '../Settings/SettingsContext';
import { 
  Sun, Wifi, Bluetooth, Airplay, Moon, // Added Moon, Airplay (for AirDrop icon)
  Maximize, // for full screen
  Lightbulb,
  Minimize, 
  Play, Pause, RefreshCw, // For light theme
  Tv2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';


const StyledSlider = ({
  min, max, value, onChange, iconLeft, iconRight
}: {
  min: number;
  max: number;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}) => {
  const { theme } = useTheme();
  
  // Calculate the progress percentage (unchanged)
  const progress = ((value - min) / (max + 2 - min)) * 100;

  // Define the colors for the track's gradient (unchanged)
  const trackColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.3)';
  const fillColor = theme === 'dark' ? '#2F2F2F' : '#FFFFFF';

  const sliderStyle = {
    background: `linear-gradient(to right, ${fillColor} ${progress}%, ${trackColor} ${progress}%)`,
  };

  return (
    <div className="flex items-center gap-3">
      {iconLeft}
      <input 
        type="range" 
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        style={sliderStyle}
        className={cn(
          "w-full h-4.5 rounded-lg appearance-none cursor-pointer border border-black/20",
          "[&::-webkit-slider-thumb]:appearance-none",
          "[&::-webkit-slider-thumb]:w-4",
          "[&::-webkit-slider-thumb]:h-4",
          "[&::-webkit-slider-thumb]:rounded-full",
          "[&::-webkit-slider-thumb]:shadow-md",
          "[&::-webkit-slider-thumb]:border",
          "[&::-webkit-slider-thumb]:border-neutral-300",
          "[&::-webkit-slider-thumb]:bg-slate-100 dark:[&::-webkit-slider-thumb]:bg-white"
        )}
      />
      {iconRight}
    </div>
  );
};

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
      "flex items-center gap-3 p-1 rounded-md transition-colors w-full ",
      // isActive ? "bg-white text-black" : "bg-white/20 text-black hover:bg-white/30"
    )}
  >
    <div className={cn(
      "w-10 h-10 rounded-full flex items-center justify-center border",
      isActive ? "bg-blue-500 border-blue-400 text-white" : "bg-white/40 dark:bg-black/30 dark:border-neutral-700 border-neutral-400"
    )}>
      {icon}
    </div>
    <div className="flex flex-col items-start text-sm">
      <span className="font-semibold">{label}</span>
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
      "flex flex-col items-center justify-center p-2 h-21 w-full transition-colors  bg-white/30 dark:bg-black/30 rounded-xl text-black dark:text-white shadow-xl",
      // isActive ? "bg-white" : "bg-white/20 hover:bg-white/30"
    )}
  >
    <div className={cn(
      "w-10 h-10 rounded-full flex items-center justify-center mb-1",
      isActive ? "bg-blue-500 border-blue-400 text-white" : "bg-white/40 dark:bg-black/30 dark:border-neutral-700 border-neutral-400"
    )}>
      {icon}
    </div>
    <span className="text-xs font-medium">{label}</span>
  </button>
);

const TimerWidget = () => {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive]);

  const handleStartPause = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="flex items-center justify-between p-3 bg-white/30 dark:bg-black/30 rounded-xl text-black dark:text-white shadow-xl">
      <p className="text-2xl font-mono font-semibold ">{formatTime(time)}</p>
      <div className="flex items-center gap-2">
        <button onClick={handleReset} className="w-8 h-8 rounded-full flex items-center justify-center bg-black/20 hover:bg-black/30 ">
          <RefreshCw size={16} />
        </button>
        <button onClick={handleStartPause} className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white">
          {isActive ? <Pause size={16} /> : <Play size={16} />}
        </button>
      </div>
    </div>
  );
};


export const ControlCentre = () => {
  const { settings, setBrightness, setSound } = useSettings();
  const [isWifiOn, setIsWifiOn] = useState(true);
  const [isBluetoothOn, setIsBluetoothOn] = useState(true);
  const [isAirdropOn, setIsAirdropOn] = useState(true);
  const [isDndOn, setIsDndOn] = useState(false); // Do Not Disturb
  const [isFullScreenActive, setIsFullScreenActive] = useState(false);
  const { theme, setTheme } = useTheme();


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
             text-black dark:text-white
             bg-white/20 dark:bg-black/20 backdrop-blur-xl shadow-2xl rounded-2xl 
               border border-white/20 dark:black/10 z-999999 transform-gpu"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="grid grid-cols-2 gap-3">
        {/* Connectivity Toggles (Top Left) */}
        <div className="col-span-1 flex flex-col gap-2 p-2 bg-white/30 dark:bg-black/30 rounded-xl text-black dark:text-white shadow-xl">
          <ControlToggle
            icon={<Wifi size={18} />}
            label="Wi-Fi"
            status={isWifiOn ? "D-Link" : "Off"}
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
        <div className="col-span-1 flex flex-col gap-2 ">
          <MiniButton
            icon={<Moon size={20} />}
            label="Focus"
            isActive={isDndOn}
            onClick={() => setIsDndOn(!isDndOn)}
          />
          <div className='grid grid-cols-2 gap-2 '>
            <MiniButton
            icon={theme === 'dark' ? <Moon size={20} /> : <Lightbulb size={20} />}
            label={theme === 'dark' ? "Dark Mode" : "Light Mode"}
            isActive={theme === 'dark'} // Active when dark mode
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          />
            <MiniButton
            icon={isFullScreenActive ? <Minimize size={20} /> : <Maximize size={20} />}
            label={isFullScreenActive ? "Restore" : "Full Screen"}
            isActive={isFullScreenActive}
            onClick={handleFullScreenToggle}
          />
          </div>
        </div>

        <div className='grid grid-cols-2 gap-4  col-span-2'>
          <TimerWidget />

          <MiniButton
            icon={<Tv2 size={20} />}
            label="Screen Mirroring"
            isActive={false}
            onClick={() => alert("Searching for displays...")}
          />
        </div>
        

        {/* Display Slider */}
        <div className="col-span-2 p-3 bg-white/20 dark:bg-black/20 backdrop-blur-md rounded-xl shadow-xl">
          <StyledSlider
            min={20}
            max={100}
            value={settings.brightness}
            onChange={(e) => setBrightness(Number(e.target.value))}
            iconLeft={<Sun size={18} className="text-black dark:text-white" />}
          />
        </div>

        {/* Sound Slider */}
        {/* <div className="col-span-2 p-3 bg-white/20 dark:bg-black/20 backdrop-blur-md rounded-xl shadow-xl">
          <StyledSlider
            min={0}
            max={100}
            value={settings.sound}
            onChange={(e) => setSound(Number(e.target.value))}
            iconLeft={<Volume2 size={18} className="text-black dark:text-white" />}
            iconRight={<Speaker size={18} className="text-black dark:text-white" />}
          />
        </div> */}

        {/* Spotify Embed (Music Section) */}
        <div className="col-span-2 bg-transparent rounded-2xl flex items-center justify-center shadow-xl">
            {/* Replace this with your actual Spotify embed code */}
            <iframe 
                src="https://open.spotify.com/embed/track/5B0kgjHULYJhAQkK5XsMoC?utm_source=generator"
                width="100%" 
                height="80" 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="eager"
                className="rounded-xl border-0"
            ></iframe>
        </div>

      </div>
    </motion.div>
  );
};