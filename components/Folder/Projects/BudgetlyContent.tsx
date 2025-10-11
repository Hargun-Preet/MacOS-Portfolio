import React, { useState } from 'react';
import { TechItem, TechStack } from './TechStack';
import { IconBrandGithub, IconExternalLink } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'motion/react';
import { InteractiveHoverButton } from '@/components/ui/RainbowButton';

const budgetlyTechStack: TechItem[] = [
  { name: 'Next.js', iconSrc: '/assets/tech-icons/nextjs.svg' },
  { name: 'React', iconSrc: '/assets/tech-icons/react.png' },
  { name: 'TypeScript', iconSrc: '/assets/tech-icons/typescript.svg' },
  { name: 'Tailwind CSS', iconSrc: '/assets/tech-icons/tailwind.svg' },
  { name: 'PostgreSQL', iconSrc: '/assets/tech-icons/postgres.png' },
  { name: 'Prisma', iconSrc: '/assets/tech-icons/prisma.png' },
  { name: 'Gemini AI', iconSrc: '/assets/tech-icons/gemini.png' },
  { name: 'TanStack Query', iconSrc: '/assets/tech-icons/tanstack.png' },
];

const galleryImages = [
    "/assets/demos/b1.png",
    "/assets/demos/b2.png",
    "/assets/demos/b3.png",
    "/assets/demos/b4.png",
];

// This component contains all the details for a single project.
export const BudgetlyContent = ({ isMaximized }: { isMaximized?: boolean }) => {
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
            <img src="assets/Icons/budgetly.png" alt="Finder Icon" className='w-12 h-12 my-auto'/>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mt-1">Budgetly</h1>
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
                Budgetly is a modern, full-stack financial tool designed to make personal expense tracking intuitive and engaging. It replaces clunky spreadsheets with a clean, interactive dashboard, helping users take control of their money through powerful visualizations and intelligent features, one transaction at a time.
            </p>
            <div className="mt-6">
                <TechStack technologies={budgetlyTechStack} />
            </div>

            {/* --- Links --- */}
            <div className="flex items-center gap-4 pt-4 mt-2">
              <a 
                href="https://getbudgetly.vercel.app/"
                target="_blank"
              >
                <InteractiveHoverButton
                  text="View Live Site"
                  icon={<IconExternalLink size={16} />}
                  isMaximized={isMaximized}
                />
              </a>
              <a 
                href="https://github.com/Hargun-Preet/Budgetly"
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
              src="/assets/demos/b-demo.mp4"
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
            The biggest hurdle in personal finance is the tedious task of manual data entry. The challenge was to design a full-stack application that not only provides powerful budgeting and tracking tools but also solves this core friction point. I wanted to build an app that was smart enough to do the heavy lifting for the user, making financial wellness accessible and effortless.
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
                <strong className="font-semibold text-gray-800 dark:text-white/90">AI-Powered Receipt Scanning</strong> 
                <br />
                The standout feature is an AI-powered receipt parser. Users can upload a photo of a receipt, and a serverless function processes the image, using AI to automatically extract the amount, date, and description, eliminating the need for manual entry.
            </li>
            <li>
                <strong className="font-semibold text-gray-800 dark:text-white/90">Dynamic Budgeting & Visualization</strong> 
                <br />
                Implemented a robust multi-category budgeting system with real-time tracking and instant warnings if a transaction exceeds budget limits. Budget usage is visualized with interactive radial charts, giving users instant, easy-to-understand feedback on their spending habits.
            </li>
            <li>
                <strong className="font-semibold text-gray-800 dark:text-white/90">Full-Stack Next.js Architecture</strong> 
                <br />
                Built as a modern, full-stack application using the Next.js App Router. Backend logic is handled by API routes, data is managed with a PostgreSQL database via the Prisma ORM, and the frontend is made highly performant with TanStack Query for efficient data fetching and caching.
            </li>
            <li>
                <strong className="font-semibold text-gray-800 dark:text-white/90">Secure & Seamless Authentication</strong> 
                <br />
                Integrated Clerk for a secure and seamless user authentication experience. This provides robust protection for a user's financial data while allowing for fast and easy sign-up and sign-in.
            </li>
        </ul>
      </motion.div>

      {/* --- Gallery --- */}
      <div>
        <h2 className="text-2xl mt-6 text-gray-800 dark:text-white font-semibold mb-4">Gallery</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
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
                        className="rounded-lg border border-gray-200 dark:border-neutral-500 aspect-video" 
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
            This project culminated in a polished, full-stack SaaS application that tackles a common real-world problem. The journey expanded my expertise in serverless architecture, database management with an ORM, and integrating AI models into a user-facing product. It was a comprehensive exercise in building a complete, production-ready application from concept to deployment.
        </p>
      </motion.div>
    </>
  );
};