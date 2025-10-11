import React, { useState } from 'react';
import { TechItem, TechStack } from './TechStack';
import { IconBrandGithub, IconExternalLink } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'motion/react';
import { InteractiveHoverButton } from '@/components/ui/RainbowButton';

const inquateTechStack: TechItem[] = [
  { name: 'React', iconSrc: '/assets/Tech-Icons/react.png' },
  { name: 'TypeScript', iconSrc: '/assets/Tech-Icons/typescript.svg' },
  { name: 'Python', iconSrc: '/assets/Tech-Icons/python.png' },
  { name: 'FastAPI', iconSrc: '/assets/Tech-Icons/fastapi.png' },
  { name: 'Gemini API', iconSrc: '/assets/Tech-Icons/gemini.png' },
  { name: 'Tailwind CSS', iconSrc: '/assets/Tech-Icons/tailwind.svg' },
];

const galleryImages = [
    "/assets/demos/i1.png",
    "/assets/demos/i2.png",
    "/assets/demos/i3.png",
    "/assets/demos/i4.png",
];

// This component contains all the details for a single project.
export const InquateContent = ({ isMaximized }: { isMaximized?: boolean }) => {
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
            <img src="assets/Icons/inquate.png" alt="Finder Icon" className='w-12 h-12 my-auto invert dark:invert-0'/>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mt-1">Inquate</h1>
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
                Inquate is a personal math & physics wizard that transforms hand-drawn problems into beautifully rendered LaTeX solutions. Built on the idea that solving complex problems should be as intuitive as sketching them, Inquate uses AI to understand your scribbles—from calculus to physics diagrams—and provides instant, accurate answers.
            </p>
            <div className="mt-6">
                <TechStack technologies={inquateTechStack} />
            </div>

            {/* --- Links --- */}
            <div className="flex items-center gap-4 pt-4 mt-2">
              <a 
                href="https://inquate.vercel.app/"
                target="_blank"
              >
                <InteractiveHoverButton
                  text="View Live Site"
                  icon={<IconExternalLink size={16} />}
                  isMaximized={isMaximized}
                />
              </a>
              <a 
                href="https://github.com/Hargun-Preet/Inquate"
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
              src="/assets/demos/i-demo.mp4"
              poster="/assets/demos/i-poster.png"
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
            Traditional math software often forces users into rigid, text-based inputs, creating a barrier for problems that are naturally visual. The challenge was to bridge this gap: could I build an application that "thinks" like a whiteboard, allowing a user to simply draw a problem and have an AI interpret, solve, and explain it in real-time?
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
                <strong className="font-semibold text-gray-800 dark:text-white/90">Advanced Interactive Canvas</strong> 
                <br />
                 Developed a feature-rich interactive canvas from scratch in React. It includes a complete suite of drawing tools—such as rectangles, circles, lines, and text boxes—where every element is fully draggable, resizable, and customizable with a dynamic color palette. This gives users the flexibility to create complex diagrams and equations with ease.
            </li>
            <li>
                <strong className="font-semibold text-gray-800 dark:text-white/90">AI-Powered Solving Engine</strong> 
                <br />
                The core of the application is a FastAPI backend that processes the drawing. It sends the image to Google's Generative AI, which interprets the handwritten problem, performs the necessary calculations, and returns a structured solution.
            </li>
            <li>
                <strong className="font-semibold text-gray-800 dark:text-white/90">High-Fidelity LaTeX Rendering</strong> 
                <br />
                To ensure solutions are clear and professional, the frontend uses MathJax to render the AI's output into crisp, beautiful LaTeX, perfectly formatting even the most complex mathematical notation.
            </li>
            <li>
                <strong className="font-semibold text-gray-800 dark:text-white/90">Glassmorphic & Fluid User Interface</strong> 
                <br />
                Designed a sleek, futuristic UI with glassmorphic elements and smooth interactions using Tailwind CSS and Mantine to make the experience of solving tough problems feel effortless and magical.
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
            The result is a tool that makes complex math feel intuitive and magical. The core challenge of this project was translating a highly technical workflow—capturing canvas drawings, processing image data, calling a generative AI model, and rendering LaTeX—into a single, effortless click for the user. Building Inquate solidified my full-stack skills and taught me how to architect and integrate a complete AI pipeline from front to back, proving that even the toughest problems can be solved with an elegant interface.
        </p>
      </motion.div>
    </>
  );
};