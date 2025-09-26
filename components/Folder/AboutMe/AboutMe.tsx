import React, { useState } from 'react';
import { motion } from 'motion/react';

// 1. Simplified the data structure - no categories needed
const allPhotos = [
  { src: '/assets/wallpaper.jpg' },
  { src: '/assets/wallpaper.jpg' },
  { src: '/assets/wallpaper.jpg' },
  { src: '/assets/wallpaper.jpg' },
  { src: '/assets/wallpaper.jpg' },
  { src: '/assets/wallpaper.jpg' },
];

import {
  DraggableCardBody,
  DraggableCardContainer,
} from "@/components/ui/draggable-card";
import { IconCloud } from '@/components/ui/IconCloud';
import { Timeline, TimelineContent, TimelineDate, TimelineHeader, TimelineIndicator, TimelineItem, TimelineSeparator, TimelineTitle } from '@/components/ui/Timeline';
import { CheckIcon } from 'lucide-react';

const items = [
    {
      title: "Tyler Durden",
      image:
        "assets/wallpaper.jpg",
      className: "absolute top-10 left-[20%] rotate-[-5deg]",
    },
    {
      title: "The Narrator",
      image:
        "assets/wallpaper.jpg",
      className: "absolute top-40 left-[25%] rotate-[-7deg]",
    },
    {
      title: "Iceland",
      image:
        "assets/wallpaper.jpg",
      className: "absolute top-5 left-[40%] rotate-[8deg]",
    },
    {
      title: "Japan",
      image:
        "assets/wallpaper.jpg",
      className: "absolute top-32 left-[55%] rotate-[10deg]",
    },
    {
      title: "Norway",
      image:
        "assets/wallpaper.jpg",
      className: "absolute top-20 right-[35%] rotate-[2deg]",
    },
    {
      title: "New Zealand",
      image:
        "assets/wallpaper.jpg",
      className: "absolute top-24 left-[45%] rotate-[-7deg]",
    },
    {
      title: "Canada",
      image:
        "assets/wallpaper.jpg",
      className: "absolute top-8 left-[30%] rotate-[4deg]",
    },
];

const slugs = [
  "typescript",
  "javascript",
  "python",
  "java",
  "c",
  "cplusplus",
  "react",
  "mongodb",
  "tailwindcss",
  "html5",
  "css3",
  "nodedotjs",
  "express",
  "nextdotjs",
  "prisma",
  "postgresql",
  "fastapi",
  "vercel",
  "supabase",
  "apachekafka",
  "mysql",
  "gnubash",
  "git",
  "scikitlearn",
  "github",
  "visualstudiocode",
  "keras",
  "numpy",
  "figma",
  "railway"
];

const nameMap: { [key: string]: string } = {
  typescript: "TypeScript",
  javascript: "JavaScript",
  cplusplus: "C++",
  nodedotjs: "Node.js",
  mongodb: "MongoDB",
  tailwindcss: "Tailwind CSS",
  express: "Express.js",
  nextdotjs: "Next.js",
  postgresql: "PostgreSQL",
  html5: "HTML5",
  css3: "CSS3",
  fastapi: "FastAPI",
  visualstudiocode: "VS Code",
  apachekafka: "Apache Kafka",
  mysql: "MySQL",
  gnubash: "Bash",
  scikitlearn: "scikit-learn",
};

const Items = [
  {
    id: 1,
    date: "2025",
    title: "Project Kickoff",
    description:
      "Initial team meeting and project scope definition. Established key milestones and resource allocation.",
  },
  {
    id: 2,
    date: "2024",
    title: "Design Phase",
    description:
      "Completed wireframes and user interface mockups. Stakeholder review and feedback incorporated.",
  },
  {
    id: 3,
    date: "2023",
    title: "Development Sprint",
    description:
      "Backend API implementation and frontend component development in progress.",
  },
  {
    id: 4,
    date: "2021",
    title: "Testing & Deployment",
    description:
      "Quality assurance testing, performance optimization, and production deployment preparation.",
  },
]

const iconData = slugs.map((slug) => ({
  name: nameMap[slug] || slug.charAt(0).toUpperCase() + slug.slice(1),
  imageUrl: `https://cdn.simpleicons.org/${slug}/${slug}`,
}));

iconData.push({
  name: "Motion",
  imageUrl: "/assets/tech-icons/motion.png", // path inside public/
});

iconData.push({
  name: "AWS",
  imageUrl: "/assets/tech-icons/aws.png", // path inside public/
});

export const AboutMe = () => {
  return (
    <>
      <div className="h-full w-full bg-neutral-100/90 dark:bg-neutral-700">
      {/* Main Content Area */}
      <div className="grid grid-cols-[1fr_minmax(0,theme(maxWidth.4xl))_1fr] overflow-x-clip bg-neutral-100/90 dark:bg-neutral-800/20">
      <div className="relative col-start-2 flex-grow flex justify-between h-full  dark:bg-neutral-700">
        {/* <TextureOverlay texture="diagonal" /> */}
        <div className=" h-full w-6 shadow-none [box-shadow:-4px_0_10px_-1px_rgba(0,0,0,0.1)] border-x border-x-(--pattern-fg)/50 bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed md:w-8"></div>
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, filter: "blur(10px)", y: 10}}
            whileInView={{ opacity: 1, filter: "blur(0px)", y: 0}}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
          >
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white p-6">About Me</h1>
          </motion.div>
          
          {/* --- ADD THIS SECTION FOR YOUR PICTURE --- */}
          <motion.div className="flex justify-center my-4"
            initial={{ opacity: 0, filter: "blur(10px)", y: 10}}
            whileInView={{ opacity: 1, filter: "blur(0px)", y: 0}}
            transition={{
              duration: 0.4,
              ease: "easeInOut",
            }}
          >
            <img
              src="/assets/me.png" // The path to your image in the /public folder
              alt="A picture of me"
              className="w-[55%] mx-4 rounded-lg object-cover border-4 border-neutral-100 dark:border-neutral-600 shadow-lg"
            />
          </motion.div>
          {/* --- END OF NEW SECTION --- */}

          {/* --- ADD YOUR ABOUT ME TEXT HERE --- */}
          <motion.div className=" text-md lg:text-md p-3 px-6 mt-8 mx-auto text-gray-700 dark:text-white/90 space-y-4 mb-8"
            initial={{ opacity: 0, filter: "blur(10px)", y: 10}}
            whileInView={{ opacity: 1, filter: "blur(0px)", y: 0}}
            transition={{
              duration: 0.4,
              ease: "easeInOut",
            }}
          >
            <p>
              Hello! I'm Hargun Preet Singh, a third-year Information Technology undergraduate at IIIT Allahabad. As a developer and problem-solver at heart, I specialize in building modern front-end applications and love diving into the intricate puzzles of algorithms and machine learning.
            </p>
            <p>
              My philosophy is to build intuitive technology that solves real needs. Fundamentally a builder with broad interests, I'm driven to create elegant and tangible solutions, which fuels my deep passion for performance.
            </p>
            <p>
              When I'm not coding, I'm usually discovering new music or geeking out over the latest in tech. I'm always open to new opportunities and collaborations, so please feel free to browse my work and reach out!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, filter: "blur(10px)", y: 10}}
            whileInView={{ opacity: 1, filter: "blur(0px)", y: 0}}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
          >
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white p-6 [box-shadow:inset_0_10px_8px_-5px_rgba(0,0,0,0.05)] border-t border-gray-200 dark:border-neutral-600">My Tech Stack</h1>
          </motion.div>

          <motion.div className="text-start px-6 text-md lg:text-lg text-gray-700 dark:text-white/60"
            initial={{ opacity: 0, filter: "blur(10px)", y: 10}}
            whileInView={{ opacity: 1, filter: "blur(0px)", y: 0}}
            transition={{
              duration: 0.4,
              ease: "easeInOut",
            }}
          >
            <p>
              I'm fluent in all of these (especially the error messages). Hover over the icons to explore the stack.
            </p>
          </motion.div>

          <div className="relative flex w-full h-[18%] max-w-4xl mx-auto items-center justify-center overflow-hidden [box-shadow:inset_0_-10px_8px_-5px_rgba(0,0,0,0.05)] border-b border-gray-200 dark:border-neutral-600">
            <IconCloud iconData={iconData} />
          </div>

          <motion.div
            initial={{ opacity: 0, filter: "blur(10px)", y: 10}}
            whileInView={{ opacity: 1, filter: "blur(0px)", y: 0}}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
          >
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white p-6 border-t border-gray-200 dark:border-neutral-600">Timeline of Achievements</h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, filter: "blur(10px)", y: 10}}
            whileInView={{ opacity: 1, filter: "blur(0px)", y: 0}}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
          >
           <Timeline defaultValue={4} className='px-6 pt-4'>
              {Items.map((item) => (
                <TimelineItem
                  key={item.id}
                  step={item.id}
                  className="group-data-[orientation=vertical]/timeline:ms-10"
                >
                  <TimelineHeader>
                    <TimelineSeparator className="group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:h-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=vertical]/timeline:translate-y-6.5" />
                    <TimelineDate>{item.date}</TimelineDate>
                    <TimelineTitle>{item.title}</TimelineTitle>
                    <TimelineIndicator className="mt-8 group-data-completed/timeline-item:bg-black dark:group-data-completed/timeline-item:bg-white group-data-completed/timeline-item:text-white dark:group-data-completed/timeline-item:text-neutral-700 flex size-6 items-center justify-center group-data-completed/timeline-item:border-none group-data-[orientation=vertical]/timeline:-left-7">
                      <CheckIcon
                        className="font-bold group-not-data-completed/timeline-item:hidden"
                        size={16}
                      />
                    </TimelineIndicator>
                  </TimelineHeader>
                  <TimelineContent>{item.description}</TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, filter: "blur(10px)", y: 10}}
            whileInView={{ opacity: 1, filter: "blur(0px)", y: 0}}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            className='py-6'
          >
            <h1 className="border-t border-gray-200 dark:border-neutral-600 text-4xl px-6 font-bold text-gray-800 dark:text-white pt-6 [box-shadow:inset_0_10px_8px_-5px_rgba(0,0,0,0.05)]">My Photos</h1>
          </motion.div>

        
          <DraggableCardContainer className="border-b border-gray-200 dark:border-neutral-600 mb-40 relative flex min-h-screen items-center justify-center overflow-clip [box-shadow:inset_0_-10px_8px_-5px_rgba(0,0,0,0.05)]">
              <p className="absolute top-1/2 mx-auto max-w-sm -translate-y-3/4 text-center text-2xl font-black text-neutral-700 md:text-4xl dark:text-neutral-100">
                  If its your first day at Fight Club, you have to fight.
              </p>
              {items.map((item, index) => (
                  <DraggableCardBody key={item.title} className={item.className}>
                  <img
                      src={item.image}
                      alt={item.title}
                      className="pointer-events-none relative z-10 h-80 w-80 object-cover"
                  />
                  <h3 className="mt-4 text-center text-2xl font-bold text-neutral-700 dark:text-neutral-300">
                      {item.title}
                  </h3>
                  </DraggableCardBody>
              ))}
          </DraggableCardContainer>
        </div>    

        <div className=" h-full w-6 shadow-none [box-shadow:4px_0_10px_-1px_rgba(0,0,0,0.1)] border-x border-x-(--pattern-fg)/50 bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed md:w-8 ">
          </div>
      </div>
    </div>
    </div>
    
    </>
  );
};

