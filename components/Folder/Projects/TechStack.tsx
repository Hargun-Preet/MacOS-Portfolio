import React from 'react';
import { motion } from 'framer-motion';

export interface TechItem {
  name: string;
  iconSrc: string;
}

interface TechStackProps {
  technologies: TechItem[];
}

// 1. Define animation "variants" for the text span
const textVariants = {
  hidden: {
    width: 0,
    marginLeft: 0,
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeInOut' }, // Faster transition when hiding
  },
  visible: {
    width: 'auto',
    marginLeft: '8px', // Equivalent to ml-2
    opacity: 1,
    transition: {
      type: 'spring', // Use a spring for a fluid feel
      stiffness: 400,
      damping: 25,
    },
  },
};

export const TechStack = ({ technologies }: TechStackProps) => {
  return (
    <div className="mt-2 flex max-w-[24rem] flex-wrap">
      {technologies.map((tech, index) => (
        <motion.div
          key={tech.name}
          // 2. These props now control the animation
          initial="hidden"
          whileHover="visible"
          className={
            "flex cursor-pointer items-center justify-start rounded-full border border-neutral-300 dark:border-neutral-500 bg-neutral-100 dark:bg-neutral-600 p-1 text-sm text-neutral-800 dark:text-white hover:z-10 hover:border-neutral-300 dark:hover:border-neutral-500" +
            (index > 0 ? " -ml-2" : "")
          }
        >
          <img 
            src={tech.iconSrc} 
            alt={`${tech.name} icon`} 
            className="p-0.25 h-6 w-6 flex-shrink-0 object-contain" 
          />

          {/* 3. The span is now a motion component linked to the variants */}
          <motion.span 
            variants={textVariants}
            className="overflow-hidden whitespace-nowrap"
          >
            {tech.name}
          </motion.span>
        </motion.div>
      ))}
    </div>
  );
};