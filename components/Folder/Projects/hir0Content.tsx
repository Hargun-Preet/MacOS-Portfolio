import React, { useState } from 'react';
import { TechItem, TechStack } from './TechStack';
import { IconBrandGithub, IconExternalLink } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'motion/react';
import { InteractiveHoverButton } from '@/components/ui/RainbowButton';

const hir0TechStack: TechItem[] = [
  { name: 'JavaScript', iconSrc: '/assets/Tech-Icons/js.png' },
  { name: 'HTML5', iconSrc: '/assets/Tech-Icons/html.png' },
  { name: 'CSS3', iconSrc: '/assets/Tech-Icons/css.png' },
  { name: 'Vercel', iconSrc: '/assets/Tech-Icons/vercel.png' },
];

const galleryImages = [
    "/assets/demos/h1.png",
    "/assets/demos/h2.png",
    "/assets/demos/h3.png",
    "/assets/demos/h4.png",
];

// This component contains all the details for a single project.
export const hir0Content = ({ isMaximized }: { isMaximized?: boolean }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  return (
    <>
      <div className="flex items-start gap-8">
        {/* Left Column: Info */}
        <div className="flex-1 mb-4">
          <motion.div
            initial={{ opacity: 0, filter: "blur(10px", y: 10}}
            whileInView={{ opacity: 1, filter: "blur(0px)", y: 0}}
            transition={{
                duration: 0.3,
                ease: "easeInOut",
            }}
            className='flex gap-4'
          >
            <img src="assets/Icons/hir0.png" alt="Finder Icon" className='w-12 h-12 my-auto'/>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mt-1">hir0</h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, filter: "blur(10px", y: 10}}
            whileInView={{ opacity: 1, filter: "blur(0px)", y: 0}}
            transition={{
                duration: 0.4,
                ease: "easeInOut",
            }}
          >
            <p className="text-gray-700 dark:text-white/80 mb-6 mt-6">
                hir0 is a minimal yet elegant chess engine and UI built from scratch in pure JavaScript. It's a deep dive into the complex algorithms that power chess AI, capable of evaluating positions, generating legal moves, and conducting recursive searches to find the best move. The project is wrapped in a delightful pixel-art interface with an animated "thinking bot" to create an engaging user experience.
            </p>
            <div className="mt-6">
                <TechStack technologies={hir0TechStack} />
            </div>

            {/* --- Links --- */}
            <div className="flex items-center gap-4 pt-4 mt-2">
              <a 
                href="https://hir0.vercel.app/"
                target="_blank"
              >
                <InteractiveHoverButton
                  text="View Live Site"
                  icon={<IconExternalLink size={16} />}
                  isMaximized={isMaximized}
                />
              </a>
              <a 
                href="https://github.com/Hargun-Preet/hir0"
                target="_blank"
              >
                <InteractiveHoverButton
                  text="View on GitHub"
                  icon={<IconBrandGithub size={16} />}
                  isMaximized={isMaximized}
                >
                </InteractiveHoverButton>
              </a>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Animated GIF Demo */}
        {isMaximized && (
          <motion.div className="w-1/2 flex-shrink-0"
            initial={{ opacity: 0, filter: "blur(10px", y: 10}}
            whileInView={{ opacity: 1, filter: "blur(0px)", y: 0}}
            transition={{
                duration: 0.6,
                ease: "easeInOut",
            }}
          >
            <video 
              src="/assets/demos/h-demo.mp4"
              poster="/assets/demos/h-poster.png"
              autoPlay
              loop
              muted
              playsInline
              className="rounded-lg border border-gray-200 dark:border-neutral-500 shadow-md"
            />
          </motion.div>
        )}
      </div>
      
      <hr className="border-gray-200 dark:border-neutral-500 mt-6" />

      {/* --- The Challenge (Situation/Task) --- */}
      <motion.div
        initial={{ opacity: 0, filter: "blur(10px", y: 10}}
        whileInView={{ opacity: 1, filter: "blur(0px)", y: 0}}
        transition={{
            duration: 0.5,
            ease: "easeInOut",
        }}
      >
        <h2 className="text-2xl mt-6 text-gray-800 dark:text-white font-semibold mb-2">The Challenge</h2>
        <p className="text-gray-700 dark:text-white/80 leading-relaxed">
            The goal was to demystify the "black box" of chess AI by building an engine entirely from the ground up, using only vanilla JavaScript without any external libraries for the core logic. The challenge was not just to implement the rules of chess, but to architect a performant search algorithm with advanced heuristics like alpha-beta pruning and quiescence search, all while managing complex board states efficiently.
        </p>
      </motion.div>

      {/* --- Key Features & Implementation (Action) --- */}
      <motion.div
        initial={{ opacity: 0, filter: "blur(10px", y: 10}}
        whileInView={{ opacity: 1, filter: "blur(0px)", y: 0}}
        transition={{
            duration: 0.5,
            ease: "easeInOut",
        }}
      >
        <h2 className="text-2xl mt-6 text-gray-800 dark:text-white font-semibold mb-4">Key Features & Implementation</h2>
        <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-white/80">
            <li >
                <strong className="font-semibold text-gray-800 dark:text-white/90">Advanced Alpha-Beta Search Engine</strong> 
                <br />
                Implemented a powerful search function using alpha-beta pruning with iterative deepening to efficiently explore the game tree. It includes a quiescence search to mitigate the horizon effect and a Principal Variation Table to store and retrieve the best lines of play.
            </li>
            <li>
                <strong className="font-semibold text-gray-800 dark:text-white/90">Sophisticated Move Generation & Ordering</strong> 
                <br />
                Developed a complete move generator that handles all chess rules, including promotions, en passant, and castling. Move ordering is optimized using the Most Valuable Victim, Least Valuable Attacker (MVV-LVA) heuristic to prioritize promising moves and improve search speed.
            </li>
            <li>
                <strong className="font-semibold text-gray-800 dark:text-white/90">Positional Evaluation Function</strong> 
                <br />
                Created a custom evaluation function that goes beyond simple material count. It uses piece-square tables to understand the positional value of each piece and includes bonuses for strategic advantages like the bishop pair.
            </li>
            <li>
                <strong className="font-semibold text-gray-800 dark:text-white/90">State Management with Zobrist Hashing</strong> 
                <br />
                Managed complex board states and history for making and undoing moves, using Zobrist hashing to efficiently detect repetitions and transpositions in the game state.
            </li>
        </ul>
      </motion.div>

      {/* --- Gallery --- */}
      <div>
        <h2 className="text-2xl mt-6 text-gray-800 dark:text-white font-semibold mb-4">Gallery</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {galleryImages.map((src, index) => (
                <motion.div
                    initial={{ opacity: 0, filter: "blur(10px", y: 10}}
                    whileInView={{ opacity: 1, filter: "blur(0px)", y: 0}}
                    transition={{
                        duration: 0.3,
                        delay: index * 0.1,
                        ease: "easeInOut",
                    }}
                    onClick={() => setSelectedPhoto(src)}
                    className="cursor-pointer"
                >
                    <img 
                        key={index}
                        src={src} 
                        alt={`Project screenshot ${index + 1}`} 
                        className="rounded-lg border border-gray-200 dark:border-neutral-500" 
                    />
                </motion.div>
            ))}
        </div>

        <AnimatePresence>
        {selectedPhoto && (
          <motion.div 
            className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center"
            onClick={() => setSelectedPhoto(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.img 
              layoutId={`photo-${selectedPhoto}`} // Optional: for a smooth transition if you add layoutId to thumbnails
              src={selectedPhoto}
              alt="Enlarged view"
              className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image
            />
          </motion.div>
        )}
      </AnimatePresence>
      </div>

      {/* --- Outcome & Learnings (Result) --- */}
      <motion.div
        initial={{ opacity: 0, filter: "blur(10px", y: 10}}
        whileInView={{ opacity: 1, filter: "blur(0px)", y: 0}}
        transition={{
            duration: 0.5,
            ease: "easeInOut",
        }}
      >
        <h2 className="text-2xl mt-6 text-gray-800 dark:text-white font-semibold mb-2">Outcome & Learnings</h2>
        <p className="text-gray-700 dark:text-white/80 leading-relaxed">
            This project was a foundational exercise in algorithm design and low-level JavaScript performance. The process of implementing complex heuristics like alpha-beta pruning and piece-square tables from scratch provided a deep, practical understanding of game theory and state management. The result is a fully functional engine that not only plays chess but also serves as a testament to my ability to tackle and master intricate computational problems.
        </p>
      </motion.div>
    </>
  );
};