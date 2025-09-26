import React, { forwardRef } from 'react';

export const SpotifyWidget = () => (
  <div className="w-full h-full bg-transparent rounded-lg overflow-hidden pt-4">
    <iframe
      style={{ borderRadius: '12px' }}
      src="https://open.spotify.com/embed/track/44aTAUBF0g6sMkMNE8I5kd?utm_source=generator"
      width="392"
      height={132}
      frameBorder="0"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
    ></iframe>
  </div>
);

SpotifyWidget.displayName = "SpotifyWidget";