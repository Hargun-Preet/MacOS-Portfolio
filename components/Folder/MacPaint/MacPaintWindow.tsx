import React from 'react';

// The URL of the web-based MacPaint clone
const macPaintUrl = "https://cloudpaint.com/classic/";

export const MacPaintWindowContent = () => {
  return (
    <div className="flex flex-col h-full w-full bg-gray-800">
      <div className="flex-grow w-full h-full border-t border-gray-400">
        <iframe
          src={macPaintUrl}
          title="MacPaint"
          className="w-full h-full"
          style={{ border: 'none' }} // Remove the default iframe border
          // Allow the app to function correctly
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );
};