"use client";

import React, { useEffect, useState } from 'react';
import { AppleHelloEnglishEffect } from './Apple-Hello-Effect'; // Ensure this path is correct
import { CircleArrowRight } from 'lucide-react';
import Image from 'next/image';

interface StartupLoaderProps {
  onFinished: () => void;
}

const StartupLoader: React.FC<StartupLoaderProps> = ({ onFinished }) => {
  const [progress, setProgress] = useState(0);
  const [showHello, setShowHello] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [fadeBlackScreen, setFadeBlackScreen] = useState(false);
  const [showGetStarted, setShowGetStarted] = useState(false);

  // Effect for the loading bar progress ⏳
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setFadeBlackScreen(true);
            setTimeout(() => setShowHello(true), 100);
          }, 600);
          return 100;
        }
        return prev + 1;
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // Effect to show the "Get Started" text after the main animation is over
  useEffect(() => {
    if (showHello) {
      const timer = setTimeout(() => {
        setShowGetStarted(true);
      }, 4000); // Wait 4s for the "hello" animation to finish
      return () => clearTimeout(timer);
    }
  }, [showHello]);

  // Click handler to exit the loader
  const handleClickToContinue = () => {
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(onFinished, 500);
  };

  return (
    <div
      onClick={showHello ? handleClickToContinue : undefined}
      className={`fixed inset-0 z-9999999 transition-opacity duration-500 ease-in-out ${
        isExiting ? 'opacity-0' : 'opacity-100'
      } ${
        showHello ? 'cursor-pointer' : 'cursor-default'
      }`}
    >
      <div className="absolute inset-0">
        <img src="assets/gradient.png" className='w-full h-full' />
      </div>

      <div
        className={`absolute inset-0 bg-black transition-opacity duration-1000 ease-in-out ${
          fadeBlackScreen ? 'opacity-0' : 'opacity-100'
        }`}
      />

      <div className="relative z-10 flex h-full w-full items-center justify-center">
        {!showHello ? (
          <div className="flex flex-col items-center gap-16">
            {/* <img className="w-24 h-24" src='/assets/icons/logo-white.png' alt='apple-logo' /> */}
            <Image
              className="w-24 h-24" // This still works for styling!
              src="/assets/Icons/logo-white.png"
              alt="apple-logo"
              width={150}  // The ACTUAL width of the source file
              height={150} // The ACTUAL height of the source file
            />
            <div className="w-48 h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-white"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="relative h-full w-full">
            <div className="flex h-full w-full items-center justify-center" style={{ transform: 'translateZ(0px)' }}>
              <AppleHelloEnglishEffect />
            </div>

            {/* SOLUTION: Conditionally render the "Get Started" prompt */}
            {showGetStarted && (
              <div
                className="absolute bottom-8 left-0 right-0 flex animate-fade-in flex-col items-center gap-2 text-white"
              >
                <CircleArrowRight className='bg-black/30 w-6 h-6 p-1 rounded-full' />
                <p className="text-xs font-light">Get Started</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StartupLoader;