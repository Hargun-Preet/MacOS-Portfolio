import React from 'react';
import { TechItem, TechStack } from './TechStack';
import { IconBrandGithub, IconExternalLink } from '@tabler/icons-react';
import { motion } from 'motion/react';

const macosTechStack: TechItem[] = [
  { name: 'React', iconSrc: '/assets/tech-icons/react.png' },
  { name: 'Typescript', iconSrc: '/assets/tech-icons/typescript.svg' },
  { name: 'Next.js', iconSrc: '/assets/tech-icons/nextjs.svg' },
  { name: 'Tailwind CSS', iconSrc: '/assets/tech-icons/tailwind.svg' },
  { name: 'Motion', iconSrc: '/assets/tech-icons/motion.png' },
];

const galleryImages = [
    "/assets/wallpaper.jpg",
    "/assets/wallpaper.jpg",
    "/assets/wallpaper.jpg",
    "/assets/wallpaper.jpg",
];

// This component contains all the details for a single project.
export const MacOSPortfolio = ({ isMaximized }: { isMaximized?: boolean }) => {
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
                This project is the very website you are using! It combines a custom window system with a suite of animations to create a unique and engaging portfolio experience.
            </p>
            <div className="mt-6">
                <TechStack technologies={macosTechStack} />
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
              src="/assets/demos/project-demo.mp4"
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
            The goal was to create a unique, memorable portfolio that went beyond traditional templates. I wanted to build an interactive experience that not only showcased my projects but also demonstrated my skills in front-end development, animation, and creating complex user interfaces from scratch.
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
                <strong className="font-semibold text-gray-800 dark:text-white/90">Custom Window System</strong> 
                <br />
                Built a fully functional windowing system with dragging, maximizing, and state management, all controlled from a single parent component.
            </li>
            <li>
                <strong className="font-semibold text-gray-800 dark:text-white/90">Genie Effect Animation</strong> 
                <br />
                Developed a custom React hook to recreate the iconic macOS "Genie" effect for minimizing windows, using JavaScript to manipulate element styles frame-by-frame.
            </li>
            <li>
                <strong className="font-semibold text-gray-800 dark:text-white/90">Interactive UI Components</strong> 
                <br />
                Designed and implemented several components from scratch, including the Dock, a Finder-style window, and hover-to-reveal tech stack icons, using Tailwind CSS and Framer Motion.
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
            The result is a highly interactive and personal portfolio that I'm proud of. This project deepened my understanding of React state management, performance optimization for animations, and the intricacies of building a complex, component-based UI.
        </p>
      </motion.div>

      {/* --- Links --- */}
      <div className="flex items-center gap-4 pt-4">
        <a 
          href="#" // Add your live link here
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <IconExternalLink size={16} />
          <span>View Live Site</span>
        </a>
        <a 
          href="#" // Add your GitHub link here
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
        >
          <IconBrandGithub size={16} />
          <span>View on GitHub</span>
        </a>
      </div>
    </>
  );
};