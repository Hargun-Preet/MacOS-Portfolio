"use client"

import { useState } from 'react';
import { Image as ImageIcon, FileText, Trash2, Undo, X, HardDrive, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { motion } from 'motion/react';

// --- Mock Data and Types (Unchanged) ---
export type TrashItem = {
  id: string;
  name: string; 
  type: 'jpg' | 'png' | 'link'; 
  imageUrl: string;
  url?: string;
  deletedAt: string; 
  kind: string; 
  fileSize: string;
  story?: string;
};
const mockTrashItems: TrashItem[] = [
{ 
    id: 'trash-1', 
    name: 'College_Competition_Art_Winner.jpg',
    type: 'jpg', 
    imageUrl: '/assets/joker.jpeg',
    deletedAt: '2023-10-20T19:27:56Z', 
    kind: 'JPG Image', 
    fileSize: '5.2 MB',
    story: "This one's a bit of a throwback! I originally drew this way back in 2017, and on a whim, entered it into my college's Fine Arts Society - Nirmiti's drawing competition, 'Schizaare'. To my surprise, it won first prize! A great reminder that sometimes your old work can find a new life."
  },
  { 
    id: 'trash-2', 
    name: 'CBSE_Topper_News_Clipping.webloc', 
    type: 'link',
    imageUrl: '',
    url: 'https://www.tribuneindia.com/news/amritsar/kashvi-second-with-99-6-roop-amandeep-singh-kavya-gupta-shranay-malhotra-share-third-position-292705/', // <-- Add the actual URL here
    deletedAt: '2021-09-28T12:51:13Z', 
    kind: 'Webloc File',
    fileSize: '6.8MB',
    story: "Talk about a core memory! This is from back in 2021 when the Class 10 board results came out. It was honestly one of the wildest days of my life. Seeing your name pop up on news channels is a surreal experience, and having reporters suddenly crowd you is even crazier. My family was over the moon with joy, and yeah, the celebration that followed was pretty epic. An unforgettable day for all of us."
  },
  { 
    id: 'trash-3', 
    name: 'Coca-Cola_Iron_Man_V1.jpg', 
    type: 'jpg', 
    imageUrl: '/assets/iron-man.jpeg',
    deletedAt: '2024-07-15T20:32:43Z', 
    kind: 'JPG Image', 
    fileSize: '4.5 MB',
    story: "Ah, my 2020 lockdown project! When you have a lot of spare time and a lot of Coke cans, you make Iron Man's Mark III armor, obviously. I've been building stuff like this since I was a kid, but this is one of the only creations I have a picture of. It had fully movable joints made from paper—even the fingers worked! The only upgrade I couldn't quite figure out was the flight system. Honestly, this lifelong obsession with building things is what got me into science and engineering in the first place."
  },
  { 
    id: 'trash-4', 
    name: 'Rejected_TShirt_Design.png', 
    type: 'png', 
    imageUrl: '/assets/doodle.jpeg',
    deletedAt: '2025-02-11T15:36:10Z', 
    kind: 'PNG Image', 
    fileSize: '850 KB',
    story: "I'm a huge fan of the artist Vexx and have been doodling in that busy, vibrant style for ages, so I poured that energy into this design for a proposed merch drop. If you look closely, you might find a few little nods to famous paintings hidden in the chaos! The final collection went in a more minimalist direction, but I was so attached to this piece that I decided to get it printed just for myself. It remains one of my favorite tees."
  },
];

function TrashPreviewModal({ item, onClose }: { item: TrashItem; onClose: () => void}) {
  return (
    <motion.div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-in fade-in-0" onClick={onClose} onDoubleClick={(e) => e.stopPropagation()} 
      initial={{ opacity: 0, filter: "blur(10px", y: 10}}
      whileInView={{ opacity: 1, filter: "blur(0px)", y: 0}}
      transition={{
       duration: 0.3,
       ease: "easeInOut",
      }}>
      <div className="relative bg-white dark:bg-neutral-700 rounded-lg w-full max-w-4xl h-full max-h-[80vh] flex flex-col text-black dark:text-white" onClick={(e) => e.stopPropagation()}>
        <header className="flex items-center justify-between p-2 border-b border-neutral-300 dark:border-neutral-600 flex-shrink-0">
            <div className='flex items-center gap-4'>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-neutral-300 dark:hover:bg-neutral-600"><X className="h-5 w-5" /></button>
                <h2 className="font-semibold">{item.name}</h2>
            </div>
        </header>
        <div className="flex flex-grow min-h-0"> {/* min-h-0 is crucial for flexbox scrolling */}
          
          {/* Left Side: Preview Content (Flexible Width) */}
          <div className="flex-1 flex items-center rounded-lg justify-center p-3 overflow-auto bg-white dark:bg-neutral-700">
            {item.type === 'jpg' && (
              <img src={item.imageUrl} alt={item.name} className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" />
            )}
            {item.type === 'png' && (
              <div className="flex flex-col items-center gap-4 text-neutral-500 dark:text-neutral-400">
                <img src={item.imageUrl} alt={item.name} className="max-w-full max-h-full object-contain rounded-lg shadow-md" />
              </div>
            )}
            {item.type === 'link' && item.url && (
              <div className="w-full h-full bg-neutral-900/50 p-1 rounded-lg flex flex-col shadow-inner">
                <iframe 
                  src={item.url} 
                  className="flex-grow bg-white border-none rounded-sm" 
                  title={item.name}
                />
              </div>
            )}
          </div>
          
          {/* Right Side: Info Panel (Fixed Width) */}
          <div className="w-96 flex-shrink-0 border-l border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/40 p-6 flex flex-col gap-6 overflow-y-auto">
            {/* <h3 className="font-semibold text-lg border-b pb-3 border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200">Information</h3> */}
            
            <div className="flex flex-col items-center text-center">
               <p className="font-semibold text-lg break-words text-neutral-900 dark:text-neutral-100">{item.name}</p>
            </div>

            <div className="text-sm space-y-3 text-neutral-900 dark:text-neutral-100 pt-4 border-t border-neutral-200 dark:border-neutral-700">
            {item.story && (
              <div className="space-y-2">
                <h4 className="font-semibold text-lg text-neutral-800 dark:text-neutral-200">Backstory</h4>
                <p className="text-md text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  {item.story}
                </p>
              </div>
            )}
              <p className="text-xs text-neutral-500 dark:text-neutral-400 italic pt-4 border-t border-neutral-200 dark:border-neutral-700">
                Item will be permanently deleted after 30 days.
              </p>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}


export function TrashWindowContent() {
  const [items, setItems] = useState<TrashItem[]>(mockTrashItems);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [previewingItemId, setPreviewingItemId] = useState<string | null>(null);

  const selectedItem = items.find((item) => item.id === selectedItemId);
  const previewingItem = items.find((item) => item.id === previewingItemId);

  const handleEmptyTrash = () => {
    if (window.confirm('Are you sure you want to permanently empty the trash? All items will be deleted.')) {
      setItems([]);
      setSelectedItemId(null);
    }
  };

  return (
    <div className="h-full w-full bg-white dark:bg-neutral-700 text-black dark:text-white" onClick={() => setSelectedItemId(null)}>
          <header className="flex h-[38px] items-center px-3 border-b border-neutral-300 dark:border-neutral-600 flex-shrink-0 bg-white dark:bg-neutral-700">
              {/* Left Group */}
              <div className="flex flex-1 justify-start">
                  <div className="flex items-center gap-2">
                      <button disabled className="p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-40">
                          <ChevronLeft size={16} />
                      </button>
                      <button disabled className="p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-40">
                          <ChevronRight size={16} />
                      </button>
                  </div>
              </div>

              {/* Center Group */}
              <div className="flex-none">
                  <h1 className="font-medium text-sm text-neutral-600 dark:text-neutral-400">
                      Trash
                  </h1>
              </div>

              {/* Right Group */}
              <div className="flex flex-1 justify-end">
                  <button
                      onClick={handleEmptyTrash}
                      disabled={items.length === 0}
                      className="px-2.5 py-1 text-sm bg-neutral-200 dark:bg-neutral-600 hover:bg-neutral-300 dark:hover:bg-neutral-500 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                      Empty
                  </button>
              </div>
          </header>        
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={65} minSize={40}>
          <div className="h-full flex flex-col">            
            
            <div className="flex-grow p-2 overflow-y-auto">
              <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-x-2 gap-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    onClick={(e) => { e.stopPropagation(); setSelectedItemId(item.id); }}
                    onDoubleClick={() => setPreviewingItemId(item.id)}
                    className="flex flex-col items-center text-center p-1 rounded-lg cursor-pointer hover:bg-neutral-300/50 dark:hover:bg-neutral-600"
                  >
                    {item.type === 'jpg' && <img
                      src="/assets/Icons/jpg.png"
                      alt="JPG File"
                      className="w-18 h-18"
                    />}
                    {item.type === 'png' && <img
                      src="/assets/Icons/png.png"
                      alt="PNG File"
                      className="w-18 h-18"
                    />}
                    {item.type === 'link' && <img
                      src="/assets/Icons/web.png"
                      alt="Web Page Link"
                      className="w-18 h-18"
                    />}
                    <span className={cn(
                      "text-xs text-center break-words w-full rounded-[3px] px-1 py-0.5",
                      selectedItemId === item.id 
                        ? "bg-blue-500 text-white" 
                        : "text-black dark:text-neutral-200"
                    )}>
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle/>
        <ResizablePanel defaultSize={35} minSize={30} maxSize={40}>
          <div className="h-full flex flex-col items-center justify-center p-4">
            {selectedItem ? (
              <div className='w-full text-center flex flex-col gap-4'>
                <div className="h-32 w-32 mx-auto flex items-center justify-center">
                   {selectedItem.type === 'jpg' && <img
                      src="/assets/Icons/jpg.png"
                      alt="JPG File"
                      
                    />}
                    {selectedItem.type === 'png' && <img
                      src="/assets/Icons/png.png"
                      alt="PNG File"
                      
                    />}
                    {selectedItem.type === 'link' && <img
                      src="/assets/Icons/web.png"
                      alt="Web Page Link"
                      
                    />}
                </div>
                <h3 className="font-bold text-lg truncate">{selectedItem.name}</h3>
                <div className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1 text-left bg-black/5 dark:bg-white/5 p-3 rounded-md">
                    <p><strong>Type:</strong> {selectedItem.kind}</p>
                    <p><strong>Size:</strong> {selectedItem.fileSize}</p>
                    <p><strong>Deleted:</strong> {format(new Date(selectedItem.deletedAt), 'PP')}</p>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">Double-click to open.</p>
              </div>
            ) : (
               <div className="text-center text-neutral-500 dark:text-neutral-400">
                  <HardDrive className="h-16 w-16 mx-auto mb-4" />
                  <p>Select an item to see details.</p>
               </div>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      {previewingItem && (
        <TrashPreviewModal 
          item={previewingItem} 
          onClose={() => setPreviewingItemId(null)}
        />
      )}
    </div>
  );
}