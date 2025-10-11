import { useSettings } from "../Settings/SettingsContext";

export const AboutThisMacContent = () => {
  const currentYear = new Date().getFullYear();

  return (
    // Reduced vertical padding (py-4)
    <div className="w-full h-full flex flex-col items-center justify-start py-4 px-6 
                    bg-white dark:bg-neutral-700 rounded-lg text-black dark:text-white">
      
      {/* Reduced image size and margin */}
      <img 
        src="/assets/Icons/macintosh.png"
        alt="macOS Logo" 
        className="w-32 h-auto mb-2" 
      />

      {/* Reduced font size and margin */}
      <h1 className="text-2xl font-bold">macOS Web</h1>
      <p className="text-xs opacity-70 mb-5">Version 1.0 (Hargun's Portfolio)</p>

      {/* Reduced grid gap and text size */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs max-w-sm">
        <p className="text-right font-medium">Chip</p>
        <p className="text-left opacity-80">JavaScript V8</p>

        <p className="text-right font-medium">Memory</p>
        <p className="text-left opacity-80">16 GB (Browser Cache)</p>

        <p className="text-right font-medium">Startup disk</p>
        <p className="text-left opacity-80">Portfolio HD</p>
        
        <p className="text-right font-medium">Serial number</p>
        <p className="text-left opacity-80">X02H4RGUN2025</p>

        <p className="text-right font-medium">Framework</p>
        <p className="text-left opacity-80">Next.js 14</p>
      </div>

      {/* Reduced margin and button size */}
      <button 
        className="mt-6 px-4 py-1.5 bg-neutral-200 dark:bg-neutral-600 
                   hover:bg-neutral-300 dark:hover:bg-neutral-500 rounded-md 
                   text-xs focus:outline-none"
      >
        More Info...
      </button>

      {/* This flexible spacer pushes the footer to the bottom of the available space */}
      <div className="flex-grow"></div> 

      {/* Reduced footer padding and text size */}
      <div className="text-center text-[10px] opacity-70 pt-3 border-t 
                      border-neutral-300 dark:border-neutral-600 w-full max-w-xs">
        <p>Built with ❤️ by Hargun Preet Singh</p>
        <p className="mt-1">™ and © 1983-{currentYear} Apple Inc. All Rights Reserved.</p>
      </div>
    </div>
  );
};