import React from 'react';

// The URL of the web-based Doom game
const doomUrl = "https://silentspacemarine.com/";

export const DoomWindow = () => {
  return (
    <div className="flex flex-col h-full w-full bg-black">
      {/* Optional: Add a fake terminal header */}

      {/* Iframe to run the game */}
      <div className="flex-grow w-full h-full">
        <iframe
          src={doomUrl}
          title="Doom"
          className="w-full h-full"
          style={{ border: 'none' }} // Remove the default iframe border
          // Allow the game to use necessary browser features
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );
};