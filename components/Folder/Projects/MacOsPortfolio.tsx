import React, { useState } from 'react';
import { TechItem, TechStack } from './TechStack';
import { IconBrandGithub, IconExternalLink } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'motion/react';
import { InteractiveHoverButton } from '@/components/ui/RainbowButton';

const macosTechStack: TechItem[] = [
  { name: 'React', iconSrc: '/assets/Tech-Icons/react.png' },
  { name: 'Typescript', iconSrc: '/assets/Tech-Icons/typescript.svg' },
  { name: 'Next.js', iconSrc: '/assets/Tech-Icons/nextjs.svg' },
  { name: 'Tailwind CSS', iconSrc: '/assets/Tech-Icons/tailwind.svg' },
  { name: 'Motion', iconSrc: '/assets/Tech-Icons/motion.png' },
];

const galleryImages = [
    "/assets/demos/m-1.png",
    "/assets/demos/m-2.png",
    "/assets/demos/m-3.png",
    "/assets/demos/m-4.png",
];

// This component contains all the details for a single project.
export const MacOSPortfolio = ({ isMaximized }: { isMaximized?: boolean }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  return (
    <>
      {/* Header Section */}
      {/* <div className="mb-4">
        <h1 className="text-4xl font-bold text-gray-800">
          macOS Portfolio
        </h1>
      </div>
      
      {/* Description */}
      {/* <p className="text-gray-700 mb-6">
        This project is the very website you are using! It combines a custom window system with a suite of animations, including the iconic Genie Effect, to create a unique and engaging portfolio experience.
      </p>

      <div className="mt-6">
        <TechStack technologies={macosTechStack} />
      </div> */}

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
            <img src="assets/Icons/apple.png" alt="Finder Icon" className='w-12 h-12 my-auto'/>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mt-1">macOS Portfolio</h1>
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
                I didn't want to just <i>show</i> you my work — I wanted you to experience it. This project is a fully interactive macOS desktop environment built from scratch in the browser, serving as a living showcase for my passion for creating intricate and delightful user experiences.
            </p>
            <div className="mt-6">
                <TechStack technologies={macosTechStack} />
            </div>

            {/* --- Links --- */}
            <div className="flex items-center gap-4 pt-4 mt-2">
              <a 
                href="#"
                target="_blank"
              >
                <InteractiveHoverButton
                  text="View Live Site"
                  icon={<IconExternalLink size={16} />}
                  isMaximized={isMaximized}
                />
              </a>
              <a 
                href="https://github.com/Hargun-Preet/MacOS-Portfolio"
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
              src="/assets/demos/mac-demo.mp4"
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
            My goal was to answer a single question: could I build a portfolio that was also a product? I set out to capture the fluidity and complexity of a modern desktop OS, not just visually, but functionally. The challenge was to prove my skills in a tangible, interactive way that a traditional webpage never could.
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
                <strong className="font-semibold text-gray-800 dark:text-white/90">A Desktop-Class Windowing Engine</strong> 
                <br />
                At the core is a custom window manager built in React. It handles dynamic z-index stacking, positional state memory, and pixel-perfect drag, maximize, and minimize transitions for a true multi-tasking feel.
            </li>
            <li>
                <strong className="font-semibold text-gray-800 dark:text-white/90">Reviving a Classic Animation - The Genie Effect</strong> 
                <br />
                I took a deep dive into the iconic "Genie" effect, reverse-engineering the animation from legacy code and rebuilding it as a performant React hook. It's a testament to my passion for the small details that make an interface feel magical.
            </li>
            <li>
                <strong className="font-semibold text-gray-800 dark:text-white/90">Building an AI Conversation Partner - Siri</strong> 
                <br />
                The voice assistant isn't a gimmick. It's a complete pipeline that captures your voice via the Web Speech API, understands intent using the Gemini AI model, and speaks back with a realistic voice from a Hugging Face model—a modern, end-to-end AI integration capable of not just interaction, but also tasks like opening apps.
            </li>
            <li>
                <strong className="font-semibold text-gray-800 dark:text-white/90">An Ecosystem of Live Apps</strong> 
                <br />
                The OS is brought to life by a suite of high-fidelity applications, each chosen to tell a story. You'll find modern developer tools like a fully functional Terminal and an integrated VS Code instance, creative apps like a rich-text Notes editor, a tribute to Apple's legacy with a recreation of the classic MacPaint, and—to answer the ultimate engineering challenge—yes, it can run Doom.
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
            This project was my playground for mastering the complexities of a large-scale React application. It taught me invaluable lessons in performance optimization, state architecture, and the discipline required to build a polished, product-grade experience from a blank canvas. The result is a portfolio I'm truly proud of, and I had a blast building it.
        </p>
      </motion.div>
    </>
  );
};