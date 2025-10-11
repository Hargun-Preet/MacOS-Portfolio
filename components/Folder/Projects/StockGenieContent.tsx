import React, { useState } from 'react';
import { TechItem, TechStack } from './TechStack';
import { IconBrandGithub, IconExternalLink } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'motion/react';
import { InteractiveHoverButton } from '@/components/ui/RainbowButton';

const stockGenieTechStack: TechItem[] = [
  { name: 'Python', iconSrc: '/assets/tech-icons/python.png' },
  { name: 'Streamlit', iconSrc: '/assets/tech-icons/streamlit.png' },
  { name: 'TensorFlow', iconSrc: '/assets/tech-icons/tenserflow.png' },
  { name: 'Keras', iconSrc: '/assets/tech-icons/keras.png' },
  { name: 'Scikit-learn', iconSrc: '/assets/tech-icons/sl.png' },
  { name: 'MongoDB', iconSrc: '/assets/tech-icons/mongo.png' },
  { name: 'yFinance', iconSrc: '/assets/tech-icons/yahoo.png' },
];

const galleryImages = [
    "/assets/demos/s-1.png",
    "/assets/demos/s-2.png",
    "/assets/demos/s-3.png",
    "/assets/demos/s-4.png",
];

// This component contains all the details for a single project.
export const StockGenieContent = ({ isMaximized }: { isMaximized?: boolean }) => {
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
            <img src="assets/Icons/stock.png" alt="Finder Icon" className='w-14 h-14 my-auto object-contain'/>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mt-1">StockGenie</h1>
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
                StockGenie is an intelligent financial dashboard that harnesses the power of machine learning to forecast stock market trends. The application provides users with AI-driven price predictions, real-time market news, and currency conversion tools, all delivered through a clean and responsive interface built with Streamlit.
            </p>
            <div className="mt-6">
                <TechStack technologies={stockGenieTechStack} />
            </div>

            {/* --- Links --- */}
            <div className="flex items-center gap-4 pt-4 mt-2">
              <a 
                href="https://youtube.com/watch?v=hSB1HFjbUyM&feature=youtu.be"
                target="_blank"
              >
                <InteractiveHoverButton
                  text="View Demo"
                  icon={<IconExternalLink size={16} />}
                  isMaximized={isMaximized}
                />
              </a>
              <a 
                href="https://github.com/Hargun-Preet/StockGenie"
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
              src="/assets/demos/s-demo.mp4"
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
            The primary challenge was to build and integrate a deep learning model capable of making meaningful predictions on complex, time-series stock data. This involved preprocessing financial data, training an LSTM neural network, and then deploying this model within a full-stack Python web application. The goal was to transform raw market data into actionable, easy-to-understand insights for the user.
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
                <strong className="font-semibold text-gray-800 dark:text-white/90">LSTM Neural Network for Trend Prediction</strong> 
                <br />
                Developed a Long Short-Term Memory (LSTM) recurrent neural network using TensorFlow and Keras to forecast future stock prices. The model was trained on historical stock data from the yFinance API and uses its ability to recognize patterns in time-series data to make predictions.
            </li>
            <li>
                <strong className="font-semibold text-gray-800 dark:text-white/90">Full-Stack Python & Streamlit Architecture</strong> 
                <br />
                Built the entire application in Python, using Streamlit to create a reactive and interactive user interface. This full-stack approach allowed for seamless integration between the machine learning backend and the data visualization frontend.
            </li>
            <li>
                <strong className="font-semibold text-gray-800 dark:text-white/90">Real-Time Data and News Integration</strong> 
                <br />
                Integrated multiple third-party APIs, including yFinance for real-time stock data and the News API for fetching and filtering relevant financial news. A currency converter was also included for real-time forex rates.
            </li>
            <li>
                <strong className="font-semibold text-gray-800 dark:text-white/90">Secure Authentication & User Management</strong> 
                <br />
                Implemented a complete user authentication system from scratch using JWT for secure sessions and bcrypt for password hashing. The application also includes an admin dashboard for user management, with a MongoDB database for data persistence.
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
            This project was a comprehensive exploration of the end-to-end machine learning lifecycle, from data acquisition and model training to deployment in an interactive web application. I gained significant experience with time-series forecasting using LSTMs, building data-driven UIs with Streamlit, and architecting a secure, full-stack Python application. The result is a powerful proof-of-concept for applying deep learning to financial analysis.
        </p>
      </motion.div>
    </>
  );
};