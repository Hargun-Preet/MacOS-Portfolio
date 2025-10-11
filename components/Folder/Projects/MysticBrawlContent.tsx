import React, { useState } from 'react';
import { TechItem, TechStack } from './TechStack';
import { IconBrandGithub, IconExternalLink } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'motion/react';
import { InteractiveHoverButton } from '@/components/ui/RainbowButton';

const mysticBrawlTechStack: TechItem[] = [
  { name: 'JavaScript', iconSrc: '/assets/Tech-Icons/js.png' },
  { name: 'HTML5 Canvas', iconSrc: '/assets/Tech-Icons/html.png' },
  { name: 'Node.js', iconSrc: '/assets/Tech-Icons/node.png' },
  { name: 'Socket.io', iconSrc: '/assets/Tech-Icons/socket.png' },
  { name: 'Agora', iconSrc: '/assets/Tech-Icons/agora.png' },
  { name: 'Railway', iconSrc: '/assets/Tech-Icons/railway.svg' },
];

const galleryImages = [
    "/assets/demos/mb-1.png",
    "/assets/demos/mb-2.png",
    "/assets/demos/mb-3.png",
    "/assets/demos/mb-4.png",
];

// This component contains all the details for a single project.
export const MysticBrawlContent = ({ isMaximized }: { isMaximized?: boolean }) => {
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
            <img src="assets/Icons/mb.png" alt="Finder Icon" className='w-14 h-14 my-auto object-contain'/>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mt-1">Mystic Brawl</h1>
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
                Mystic Brawl is a fast-paced, 2D multiplayer battle arena built to run directly in the browser. It's a full-stack game that brings together real-time combat, integrated voice chat, and custom-designed maps, allowing players to jump into exciting PvP battles with friends without any downloads.
            </p>
            <div className="mt-6">
                <TechStack technologies={mysticBrawlTechStack} />
            </div>

            {/* --- Links --- */}
            <div className="flex items-center gap-4 pt-4 mt-2">
              <a 
                href="https://mystic-brawl-production.up.railway.app/"
                target="_blank"
              >
                <InteractiveHoverButton
                  text="View Live Site"
                  icon={<IconExternalLink size={16} />}
                  isMaximized={isMaximized}
                />
              </a>
              <a 
                href="https://github.com/Hargun-Preet/Mystic-Brawl"
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
              src="/assets/demos/mb-demo.mp4"
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
            The main challenge was to build a performant, real-time multiplayer experience from the ground up using web technologies. This required architecting a reliable server-client model with Node.js and Socket.io to handle low-latency state synchronization for player movement, projectiles, and scoring. Another significant hurdle was creating a game engine on the HTML5 Canvas, including a custom collision detection system and smooth animation loops.
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
                <strong className="font-semibold text-gray-800 dark:text-white/90">Real-Time Multiplayer Networking with Socket.io</strong> 
                <br />
                Architected the backend using Node.js and Socket.io to manage game state and broadcast updates to all connected clients in real-time. The system efficiently handles player movement, projectile firing, and hit detection with minimal latency.
            </li>
            <li>
                <strong className="font-semibold text-gray-800 dark:text-white/90">Integrated In-Game Voice Chat with Agora.io</strong> 
                <br />
                Elevated the multiplayer experience by integrating a real-time voice chat system using the Agora.io SDK. This allows players to communicate with teammates and opponents directly in the game, adding a layer of strategy and social interaction.
            </li>
            <li>
                <strong className="font-semibold text-gray-800 dark:text-white/90">Custom Canvas-Based Game Engine</strong> 
                <br />
                Developed a complete 2D game engine from scratch on the HTML5 Canvas. This includes a physics system for player movement, a projectile and collision detection system to handle combat, and an animation controller for fluid character actions.
            </li>
            <li>
                <strong className="font-semibold text-gray-800 dark:text-white/90">Dynamic Gameplay Systems</strong> 
                <br />
                Implemented core gameplay loops including a respawn system, an out-of-bounds mechanism, and a live scoreboard to track kills and match stats, creating a complete and engaging battle arena experience.
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
            This project was a fantastic journey into the fundamentals of game development and real-time networking. I gained hands-on experience architecting a client-server model with WebSockets, building a rendering and physics engine on the HTML5 Canvas, and integrating a complex third-party service for voice chat. The result is a fun, playable multiplayer game that demonstrates my ability to tackle low-level programming challenges.
        </p>
      </motion.div>
    </>
  );
};