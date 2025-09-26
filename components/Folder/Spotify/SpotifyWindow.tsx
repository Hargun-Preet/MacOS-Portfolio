import React from 'react';

export const SpotifyWindowContent = () => {
  return (
    <div className="flex flex-col h-full w-full dark:bg-[#00548b] bg-[#00548b] ">
      <iframe 
        className="rounded-2xl" // FIX: Changed to a JS object
        src="https://open.spotify.com/embed/playlist/4esZ8DDAxApowqR5LLcTbQ?utm_source=generator" 
        width="100%" 
        height="100%" // FIX: Changed height to fill the container
        frameBorder="0" // FIX: Changed to camelCase
        allowFullScreen={true} // FIX: Changed to camelCase and set a value
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
        loading="lazy"
        title="Spotify" // Added a title for accessibility
      ></iframe>
    </div>
  );
};