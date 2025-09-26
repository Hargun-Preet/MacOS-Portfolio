"use client";

import React, { useEffect, useState } from 'react';
import { Sun, Cloud, CloudRain, CloudSnow, Loader2, AlertTriangle } from 'lucide-react';
import { IconCloudFilled, IconSunFilled } from '@tabler/icons-react';

const API_KEY = "9ff34e1365ce1746a827ff5102bfc601"; 

interface WeatherData {
  city: string;
  temp: number;
  description: string;
  icon: string;
  high: number;
  low: number;
}

// --- NEW: Function to sanitize city names ---
// This removes accents and special characters (e.g., "München" -> "Munchen")
const sanitizeCityName = (name: string) => {
  return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

// --- NEW: Function to get a dynamic background gradient ---
const getGradientClass = (iconCode: string): string => {
  const isDay = iconCode.endsWith('d');
  const condition = iconCode.substring(0, 2);

  if (isDay) {
    switch (condition) {
      case '01': return 'from-blue-400 to-sky-300'; // Clear
      case '02': return 'from-blue-500 to-slate-400'; // Few Clouds
      case '03':
      case '04': return 'from-slate-500 to-gray-400'; // Clouds
      case '09':
      case '10': return 'from-slate-600 to-gray-500'; // Rain
      case '13': return 'from-sky-300 to-gray-400'; // Snow
      case '50': return 'from-gray-400 to-slate-400'; // Mist
      default: return 'from-blue-400 to-sky-300';
    }
  } else { // Night
    switch (condition) {
      case '01': return 'from-gray-800 to-slate-900'; // Clear
      case '02':
      case '03':
      case '04': return 'from-slate-800 to-gray-600'; // Clouds
      case '09':
      case '10': return 'from-slate-900 to-gray-700'; // Rain
      case '13': return 'from-blue-900 to-gray-700'; // Snow
      default: return 'from-gray-800 to-slate-700';
    }
  }
};


// Helper to choose an icon based on the weather condition
const WeatherIcon = ({ iconCode, className }: { iconCode: string; className?: string }) => {
  const size = 32; // Smaller icon for the new UI
  const commonProps = { size, className };

  if (iconCode.includes("01")) <IconSunFilled {...commonProps} className='text-yellow-500'/>;
  if (iconCode.includes("02") || iconCode.includes("03") || iconCode.includes("04")) {
    return <IconCloudFilled {...commonProps} className=''/>;
  }
  if (iconCode.includes("09") || iconCode.includes("10")) {
    return <CloudRain {...commonProps} className=''/>;
  }
  if (iconCode.includes("13")) {
    return <CloudSnow {...commonProps} className=''/>;
  }
  return <Cloud {...commonProps} />; // Default
};


export const WeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // ... (geolocation and error logic remains the same)
    const fetchWeather = async (lat: number, lon: number) => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch weather data.');
        }
        const data = await response.json();
        
        setWeather({
          city: sanitizeCityName(data.name), // <-- Sanitize the city name here
          temp: Math.round(data.main.temp),
          description: data.weather[0].description,
          icon: data.weather[0].icon,
          high: Math.round(data.main.temp_max),
          low: Math.round(data.main.temp_min),
        });

      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };

    navigator.geolocation.getCurrentPosition(
      (position) => { fetchWeather(position.coords.latitude, position.coords.longitude); },
      () => { setError("Unable to retrieve your location."); setLoading(false); }
    );
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-white/80">
          <Loader2 className="animate-spin" size={32} />
        </div>
      );
    }
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-white/80 p-4 text-center">
          <AlertTriangle className="text-yellow-400" size={32} />
          <p className="mt-2 text-sm font-semibold capitalize">{error}</p>
        </div>
      );
    }
    if (weather) {
      return (
        // --- UPDATED UI LAYOUT ---
        <div className="text-white px-4 flex flex-col h-full">
          <div className='pt-3'>
            <div className="flex items-center">
            <p className="font-normal text-md">{weather.city}</p>
            {/* <MapPin size={14} /> */}
          </div>
          </div>
          <p className="text-5xl font-light">{weather.temp}°</p>
          
          <div className="mt-auto pb-3">
            <div className="flex flex-col gap-0.2">
              <WeatherIcon iconCode={weather.icon} className='h-6 '/>
              <p className="font-light text-sm capitalize">{weather.description}</p>
            </div>
            <p className="font-light text-sm mt-0.2">H:{weather.high}°     L:{weather.low}°</p>
          </div>
        </div>
      );
    }
    return null;
  };
  
  return (
    // The background is now a dynamic gradient
    <div className='bg-transparent pt-2'>
        <div className={`w-[176px] h-[176px] bg-gradient-to-br rounded-2xl overflow-hidden shadow-lg cursor-grab active:cursor-grabbing transition-colors duration-500 ${
        weather ? getGradientClass(weather.icon) : 'from-gray-400 to-gray-500'
        }`}>
        {renderContent()}
        </div>
    </div>
  );
};

WeatherWidget.displayName = "WeatherWidget";