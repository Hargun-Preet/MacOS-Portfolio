import React, { useState } from 'react';
import { TechItem, TechStack } from './TechStack';
import { IconBrandGithub, IconExternalLink } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'motion/react';
import { InteractiveHoverButton } from '@/components/ui/RainbowButton';

const kamikazeTechStack: TechItem[] = [
  { name: 'React', iconSrc: '/assets/tech-icons/react.png' },
  { name: 'Redux', iconSrc: '/assets/tech-icons/Redux.png' },
  { name: 'Node.js', iconSrc: '/assets/tech-icons/node.png' },
  { name: 'Express', iconSrc: '/assets/tech-icons/express.png' },
  { name: 'MongoDB', iconSrc: '/assets/tech-icons/mongo.png' },
  { name: 'Tailwind CSS', iconSrc: '/assets/tech-icons/tailwind.svg' },
  { name: 'PayPal', iconSrc: '/assets/tech-icons/paypal.png' },
];

const galleryImages = [
    "/assets/demos/k-1.png",
    "/assets/demos/k-2.png",
    "/assets/demos/k-3.png",
    "/assets/demos/k-4.png",
];

// This component contains all the details for a single project.
export const KamikazeContent = ({ isMaximized }: { isMaximized?: boolean }) => {
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
            <img src="assets/Icons/kamikaze.png" alt="Finder Icon" className='w-12 h-12 my-auto invert dark:invert-0'/>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mt-1">Kamikaze</h1>
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
                Kamikaze is a full-featured e-commerce clothing platform built from the ground up using the MERN stack (MongoDB, Express.js, React.js, Node.js). It provides a complete shopping experience, from dynamic product filtering and a streamlined checkout process to a comprehensive admin dashboard for store management.
            </p>
            <div className="mt-6">
                <TechStack technologies={kamikazeTechStack} />
            </div>

            {/* --- Links --- */}
            <div className="flex items-center gap-4 pt-4 mt-2">
              <a 
                href="https://www.youtube.com/watch?v=46pNyeggHL4"
                target="_blank"
              >
                <InteractiveHoverButton
                  text="View Demo"
                  icon={<IconExternalLink size={16} />}
                  isMaximized={isMaximized}
                />
              </a>
              <a 
                href="https://github.com/Hargun-Preet/Kamikaze"
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
              src="/assets/demos/k-demo.mp4"
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
            The challenge was to build a complete, end-to-end e-commerce application from scratch. This required architecting a scalable backend with Node.js and Express to manage users, products, and orders, while also creating a dynamic and stateful front-end with React and Redux. A key part of the project was securely integrating a third-party payment gateway to handle real-world transactions.
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
                <strong className="font-semibold text-gray-800 dark:text-white/90">Complete Shopping & Checkout Flow</strong> 
                <br />
                Developed a seamless user journey, including a shopping cart managed with Redux, multi-faceted product filtering by category, brand, and price, and user engagement features like product reviews.
            </li>
            <li>
                <strong className="font-semibold text-gray-800 dark:text-white/90">Secure PayPal Payment Integration</strong> 
                <br />
                Integrated the PayPal SDK to handle secure payment processing, allowing users to complete transactions safely and providing a streamlined checkout experience.
            </li>
            <li>
                <strong className="font-semibold text-gray-800 dark:text-white/90">Comprehensive Admin Dashboard</strong> 
                <br />
                Built a dedicated backend interface for administrators to perform full CRUD (Create, Read, Update, Delete) operations on products, users, and categories. It also includes an order management system to view all orders and mark them as delivered.
            </li>
            <li>
                <strong className="font-semibold text-gray-800 dark:text-white/90">JWT-Based Authentication and Authorization</strong> 
                <br />
                Implemented a secure authentication system from scratch using JSON Web Tokens (JWT) and custom middleware to protect routes and differentiate between standard users and administrators.
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
            This project was a comprehensive exercise in building a full-stack MERN application. It solidified my understanding of creating RESTful APIs with Node.js and Express, managing complex global state with Redux, and integrating essential third-party services like payment gateways. The result is a complete, scalable e-commerce platform that demonstrates a strong command of the entire web development lifecycle.
        </p>
      </motion.div>
    </>
  );
};