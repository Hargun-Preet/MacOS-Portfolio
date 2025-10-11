import React, { useState } from 'react';
import { TechItem, TechStack } from './TechStack';
import { IconBrandGithub, IconExternalLink } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'motion/react';
import { InteractiveHoverButton } from '@/components/ui/RainbowButton';

const aegisTechStack: TechItem[] = [
  { name: 'React', iconSrc: '/assets/Tech-Icons/react.png' },
  { name: 'TypeScript', iconSrc: '/assets/Tech-Icons/typescript.svg' },
  { name: 'Tailwind CSS', iconSrc: '/assets/Tech-Icons/tailwind.svg' },
  { name: 'Supabase', iconSrc: '/assets/Tech-Icons/supabase.svg' },
  { name: 'PostgreSQL', iconSrc: '/assets/Tech-Icons/postgres.png' },
  { name: 'Web Crypto API', iconSrc: '/assets/Tech-Icons/wc.png' },
];

const galleryImages = [
    "/assets/demos/a-1.png",
    "/assets/demos/a-2.png",
    "/assets/demos/a-3.png",
    "/assets/demos/a-4.png",
];

// This component contains all the details for a single project.
export const AegisContent = ({ isMaximized }: { isMaximized?: boolean }) => {
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
            <img src="assets/Icons/aegis.png" alt="Finder Icon" className='w-12 h-12 my-auto object-contain'/>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mt-1">Project Aegis</h1>
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
                Project Aegis is a secure file vault system engineered with a zero-knowledge architecture, ensuring that user data remains completely private. By performing all cryptographic operations directly in the browser, it guarantees that unencrypted files and private keys never leave the user's machine, offering a robust solution to the privacy risks of conventional cloud storage.
            </p>
            <div className="mt-6">
                <TechStack technologies={aegisTechStack} />
            </div>

            {/* --- Links --- */}
            <div className="flex items-center gap-4 pt-4 mt-2">
              <a 
                href="https://aegisone.vercel.app"
                target="_blank"
              >
                <InteractiveHoverButton
                  text="View Live Site"
                  icon={<IconExternalLink size={16} />}
                  isMaximized={isMaximized}
                />
              </a>
              <a 
                href="https://github.com/Hargun-Preet/Project-Aegis"
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
              src="/assets/demos/a-demo.mp4"
              poster="/assets/demos/a-poster.png"
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
            Traditional cloud storage services often rely on server-side encryption, creating a potential point of failure where user data or encryption keys could be exposed. The challenge was to architect a web-based file vault that eliminates this risk entirely by shifting the entire cryptographic process to the client-side. This required designing a system where the server acts as a "dumb," zero-knowledge host, incapable of deciphering the content it stores.
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
                <strong className="font-semibold text-gray-800 dark:text-white/90">Client-Side Cryptographic Engine</strong> 
                <br />
                The core of Aegis is a cryptographic engine built using the browser's native Web Crypto API. It handles the generation of file-specific AES-256 keys, encrypts files with AES-256-GCM, and calculates SHA-256 hashes for integrity verification—all locally on the user's machine.
            </li>
            <li>
                <strong className="font-semibold text-gray-800 dark:text-white/90">Asymmetric Key Encryption for Secrecy</strong> 
                <br />
                To ensure only the user can access their files, a hybrid encryption model was implemented. While files are encrypted with symmetric AES keys for performance, the AES key itself is asymmetrically encrypted using the user's public RSA key. The server only ever stores this encrypted key.
            </li>
            <li>
                <strong className="font-semibold text-gray-800 dark:text-white/90">Secure, Zero-Knowledge Backend with Supabase</strong> 
                <br />
                Utilized Supabase for secure storage and authentication. The database stores only encrypted file blobs and their corresponding encrypted keys. PostgreSQL's Row-Level Security (RLS) is strictly enforced to guarantee that users can only query and access their own files.
            </li>
            <li>
                <strong className="font-semibold text-gray-800 dark:text-white/90">Data Integrity Verification</strong> 
                <br />
                Before encryption, a SHA-256 hash of the original file is generated and stored. Upon decryption, the hash of the decrypted file is re-calculated and compared against the stored hash, providing a robust, tamper-evident system that guarantees file integrity.
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
            This project was a deep dive into the principles of applied cryptography and secure system design. I gained invaluable hands-on experience implementing a zero-knowledge architecture, working with the Web Crypto API to handle AES and RSA operations, and leveraging advanced PostgreSQL features like Row-Level Security with Supabase. The result is a robust application that demonstrates a practical understanding of how to build systems that prioritize user privacy and data integrity above all else.
        </p>
      </motion.div>
    </>
  );
};