// src/components/PartyModeOverlay.tsx (Corrected)

"use client";

import React, { useEffect, useMemo, useRef } from 'react';

// Helper functions
function randomColor(type: 'bright' | 'any'): string {
  const c = type === "bright" ? randomNumber(130, 255) : randomNumber(110, 190);
  return `rgb(${c},${c},${c})`;
}

function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

interface Tile {
  id: string;
  wrapperStyle: React.CSSProperties;
  tileStyle: React.CSSProperties;
}

interface ConfettiPiece {
  id: number;
  style: React.CSSProperties;
}

export const PartyModeOverlay = () => {
  // useMemo will run these calculations only once
  const generatedTiles = useMemo<Tile[]>(() => {
    // ... (logic for generating tiles is the same)
    const newTiles: Tile[] = [];
    const radius = 50;
    const squareSize = 6.5;
    const prec = 19.55;
    const fuzzy = 0.001;
    const inc = (Math.PI - fuzzy) / prec;

    for (let t = fuzzy; t < Math.PI; t += inc) {
      const z = radius * Math.cos(t);
      const currentRadius = Math.abs((radius * Math.cos(0) * Math.sin(t)) - (radius * Math.cos(Math.PI) * Math.sin(t))) / 2.5;
      const circumference = Math.abs(2 * Math.PI * currentRadius);
      const squaresThatFit = Math.floor(circumference / squareSize);
      const angleInc = (Math.PI * 2 - fuzzy) / squaresThatFit;

      for (let i = angleInc / 2 + fuzzy; i < (Math.PI * 2); i += angleInc) {
        const x = radius * Math.cos(i) * Math.sin(t);
        const y = radius * Math.sin(i) * Math.sin(t);
        
        newTiles.push({
          id: `tile-${t}-${i}`,
          wrapperStyle: { transform: `translateX(${x}px) translateY(${y}px) translateZ(${z}px)` },
          tileStyle: {
            width: `${squareSize}px`,
            height: `${squareSize}px`,
            transform: `rotate(${i}rad) rotateY(${t}rad)`,
            backgroundColor: (t > 1.3 && t < 1.9) ? randomColor("bright") : randomColor("any"),
            animation: `reflect 2s linear infinite`,
            animationDelay: `${randomNumber(0, 20) / 10}s`,
            backfaceVisibility: 'hidden',
          },
        });
      }
    }
    return newTiles;
  }, []);

  const generatedConfetti = useMemo<ConfettiPiece[]>(() => {
    const confettiColors = ['#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff'];
    return Array.from({ length: 25 }).map((_, index) => ({
      id: index,
      style: {
        left: `${Math.random() * 100}vw`,
        animationDuration: `${Math.random() * 3 + 4}s`,
        animationDelay: `${Math.random() * 5}s`,
        backgroundColor: confettiColors[index % confettiColors.length],
      }
    }));
  }, []);

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    // Play the audio when the component mounts (Party Mode starts)
    audio?.play().catch(error => console.log("Audio autoplay was prevented.", error));

    // Cleanup function: this runs when the component unmounts (Party Mode ends)
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0; // Rewind to the start
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      <div className="flex items-start justify-center pt-12">
        <div className="disco-ball-container">
          <div className="rope"></div>
          <div className="disco-ball-light"></div>
          <div className="disco-ball">
            <div className="disco-ball-middle"></div>
            {generatedTiles.map(tile => (
              <div key={tile.id} className="square" style={tile.wrapperStyle}>
                <div style={tile.tileStyle}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {generatedConfetti.map(c => (
        <span key={c.id} className="confetti-piece" style={c.style}></span>
      ))}

      <audio 
        ref={audioRef} 
        src="/assets/music.mp3" 
        loop 
      />
    </div>
  );
};