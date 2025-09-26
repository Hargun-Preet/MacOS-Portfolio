import React, { useState, useRef, FormEvent, useEffect } from 'react';
import { IconArrowLeft, IconArrowRight, IconRefresh, IconLock } from '@tabler/icons-react';

const DEFAULT_URL = "https://google-clone-cosmicwanderer7.vercel.app/";

export const ChromeWindowContent = () => {
  const [history, setHistory] = useState<string[]>([DEFAULT_URL]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [iframeKey, setIframeKey] = useState(0); // For forcing reloads

  const currentUrl = history[historyIndex];

  // This effect listens for messages from the iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Optional: Check the origin for security
      // if (event.origin !== "https://google-clone-cosmicwanderer7.vercel.app") return;

      if (event.data && event.data.type === 'search') {
        const query = event.data.query;
        // Now the parent app handles the navigation
        const newUrl = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newUrl);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
      }
    };

    window.addEventListener('message', handleMessage);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [history, historyIndex]); // Rerun if history changes

  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
    }
  };
  
  const reload = () => {
    setIframeKey(prevKey => prevKey + 1);
  };

  return (
    <div className="flex flex-col h-full w-full bg-white text-black">
      {/* The Address Bar is now decorative, as searches are handled by messages */}
      <div className="flex items-center gap-2 p-2 bg-gray-100 border-b border-gray-300">
        <button onClick={goBack} disabled={historyIndex === 0} className="p-1 rounded-full hover:bg-gray-200 disabled:opacity-50">
          <IconArrowLeft size={16} />
        </button>
        <button onClick={goForward} disabled={historyIndex === history.length - 1} className="p-1 rounded-full hover:bg-gray-200 disabled:opacity-50">
          <IconArrowRight size={16} />
        </button>
        <button onClick={reload} className="p-1 rounded-full hover:bg-gray-200">
          <IconRefresh size={16} />
        </button>
        <div className="relative flex items-center flex-grow bg-white rounded-full pl-7 pr-2 py-1 text-sm border border-gray-300">
          <IconLock size={15} className="absolute left-2 text-gray-500" />
          {/* Display the current URL from our state */}
          <span className="truncate">https://www.google.com</span>
        </div>
      </div>

      {/* --- Iframe for Web Content --- */}
      <div className="flex-grow border-t border-gray-200">
        <iframe
          key={`${currentUrl}-${iframeKey}`}
          src={currentUrl}
          title="Google Chrome"
          className="w-full h-full"
          sandbox="allow-forms allow-popups allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );
};
