import React, { useState, useMemo } from 'react';
import { photosData, type Photo } from '@/lib/photosData';
import { IconSearch, IconHeart, IconPhoto, IconClock, IconStar, IconPlus, IconMinus } from '@tabler/icons-react';
import { motion } from 'motion/react';

// Data for the sidebar navigation
const sidebarItems = [
  { name: 'Library', icon: IconPhoto },
  { name: 'Favorites', icon: IconHeart },
  { name: 'Recents', icon: IconClock },
];

export const PhotosWindowContent = () => {
  // State for all user interactions
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [activeCategory, setActiveCategory] = useState('Library');
  const [searchQuery, setSearchQuery] = useState('');
  const [zoomLevel, setZoomLevel] = useState(9); // Default grid size (5 columns)

  // Memoized filtering logic
  const filteredPhotos = useMemo(() => {
    let photos = photosData;

    // Filter by active category
    if (activeCategory === 'Favorites') {
      photos = photos.filter(p => p.isFavorite);
    } else if (activeCategory !== 'Library') {
      photos = photos.filter(p => p.category === activeCategory);
    }

    // Filter by search query
    if (searchQuery) {
      photos = photos.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    return photos;
  }, [activeCategory, searchQuery]);
  
  // Create a map for your grid classes so Tailwind can find them
  const gridLayouts: { [key: number]: string } = {
    10: 'grid-cols-2',
    9: 'grid-cols-3',
    8: 'grid-cols-4',
    7: 'grid-cols-5',
    6: 'grid-cols-6',
    5: 'grid-cols-7',
    4: 'grid-cols-8',
    3: 'grid-cols-9',
    2: 'grid-cols-10',
  };

  return (
    <div className="flex h-full w-full bg-white text-black dark:bg-neutral-700">
      {/* --- Sidebar --- */}
      <div className="flex-shrink-0 w-1/4 max-w-[200px] h-full bg-gray-100/80 dark:bg-neutral-600/90 border-r border-gray-300 dark:border-neutral-500/40 flex flex-col p-2">
        <p className='text-sm mt-1 mb-1 text-gray-600 dark:text-white'>Photos</p>
        <ul className="text-sm space-y-1">
          {sidebarItems.map((item) => (
            <li
              key={item.name}
              onClick={() => setActiveCategory(item.name)}
              className={`flex items-center gap-2 w-full text-left py-1.5 px-3 rounded-lg cursor-pointer ${
                activeCategory === item.name
                  ? "bg-blue-500"
                  : "hover:bg-gray-200 dark:hover:bg-neutral-700 text-gray-800"
              }`}
            >
              <item.icon size={16} className={`dark:text-white ${
                activeCategory === item.name
                  ? "text-white"
                  : ""
              }`}/>
              <span className={`textblack dark:text-white ${
                activeCategory === item.name
                  ? "text-white"
                  : ""
              }`}>{item.name}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* --- Main Content Area --- */}
      <div className="flex-grow h-full flex flex-col">
        {/* Top Toolbar */}
        <div className="flex items-center justify-between p-2 border-b border-gray-200 dark:border-neutral-500/80 bg-gray-50/50 dark:bg-neutral-700 gap-4">
          <div className="flex-1 flex items-center justify-start">
              <img 
                src="assets/Icons/expand.png" 
                alt="expand icon" 
                className="w-5 mr-2 my-gray-icon dark:hidden"
              />
              <img 
                src="assets/Icons/expand-dark.png" 
                alt="expand icon dark" 
                className="w-5 mr-2 hidden dark:inline"
              />
            
            <span className="text-xs text-gray-700 dark:text-white"><IconMinus className='w-3 mr-1'/></span>
            <input 
              type="range" 
              min="6" 
              max="10" 
              value={zoomLevel}
              onChange={(e) => setZoomLevel(parseInt(e.target.value, 10))}
              className="w-20 h-1 bg-gray-300 dark:bg-neutral-500 rounded-lg appearance-none cursor-pointer custom-range"
            />
            <span className="text-xs text-gray-700 dark:text-white"><IconPlus className='w-3 ml-1'/></span>
          </div>
          <div className="flex-1 flex justify-between">
            {/* Placeholder for view controls */}
          </div>
          <div className="flex-1 flex justify-end">
            <div className="relative w-48">
              <IconSearch className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-white" />
              <input
                type="search"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-7 pr-2 py-1 dark:bg-neutral-700/50 text-sm border border-gray-300 dark:border-neutral-500 dark:text-white rounded-md focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Photo Grid */}
        <div className="flex-grow p-2 overflow-y-auto">
          <div className={`grid gap-2 ${gridLayouts[zoomLevel]}`}>
            {filteredPhotos.map((photo, index) => (
              <motion.div 
                initial={{ opacity: 0, filter: "blur(10px", y: 10}}
                    whileInView={{ opacity: 1, filter: "blur(0px)", y: 0}}
                    transition={{
                        duration: 0.3,
                        delay: index * 0.1,
                        ease: "easeInOut",
                    }}
                key={photo.id}
                className="aspect-square cursor-pointer overflow-hidden rounded-md group"
                onClick={() => setSelectedPhoto(photo)}
              >
                <img 
                  src={photo.src} 
                  alt={photo.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-102"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* --- Lightbox Overlay --- */}
      {selectedPhoto && (
        <motion.div 
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center"
          onClick={() => setSelectedPhoto(null)}
          initial={{ opacity: 0, filter: "blur(10px", y: 10}}
                    whileInView={{ opacity: 1, filter: "blur(0px)", y: 0}}
                    transition={{
                        duration: 0.1,
                        ease: "easeInOut",
                    }}
        >
          <img 
            src={selectedPhoto.src}
            alt={selectedPhoto.title}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </motion.div>
      )}
    </div>
  );
};