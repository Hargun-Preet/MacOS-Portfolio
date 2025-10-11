import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  DraggableCardBody,
  DraggableCardContainer,
} from "@/components/ui/draggable-card";
import { IconCloud } from '@/components/ui/IconCloud';
import { Timeline, TimelineContent, TimelineDate, TimelineHeader, TimelineIndicator, TimelineItem, TimelineSeparator, TimelineTitle } from '@/components/ui/Timeline';
import { CheckIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const items = [
    {
      title: "Amritsar, Punjab",
      image:
        "assets/photos/asr.jpeg",
      className: "absolute top-10 left-[20%] rotate-[-5deg]",
    },
    {
      title: "Darjeeling, West Bengal",
      image:
        "assets/photos/djg.jpeg",
      className: "absolute top-40 left-[25%] rotate-[-7deg]",
    },
    {
      title: "Mahakumbh, Prayagraj",
      image:
        "assets/photos/kumbh.jpeg",
      className: "absolute top-5 left-[40%] rotate-[8deg]",
    },
    {
      title: "Gangtok, Sikkim",
      image:
        "assets/photos/gtk.jpeg",
      className: "absolute top-32 left-[55%] rotate-[10deg]",
    },
    {
      title: "Humayun's Tomb, Delhi",
      image:
        "assets/photos/delhi.jpeg",
      className: "absolute top-20 right-[35%] rotate-[2deg]",
    },
    {
      title: "Mt. Kanchenjunga, Sikkim",
      image:
        "assets/photos/mtkcj.jpeg",
      className: "absolute top-24 left-[45%] rotate-[-7deg]",
    },
    {
      title: "Christ Church, Kasauli",
      image:
        "assets/photos/kasauli.jpeg",
      className: "absolute top-8 left-[30%] rotate-[4deg] object-contain",
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

const timelineData = [
  {
    year: "2025",
    events: [
      {
        title: "Developed 'Budgetly' - A Smart Expense Tracker",
        description: "Built a full-stack expense tracker for a DBMS course project, featuring AI-powered receipt scanning, multi-category budgets with radial charts, and secure storage using Prisma ORM and PostgreSQL."
      },
      {
        title: "Created 'Inquate' - An AI Math Solver",
        description: "Engineered a futuristic web app where users can draw equations and diagrams, which are then solved by AI and rendered beautifully in LaTeX format."
      },
      {
        title: "Built 'Mystic Brawl' 2D Multiplayer Game",
        description: "Developed a real-time shooting-based multiplayer battle arena with custom maps, collision detection, and integrated real-time voice chat using Agora.io."
      },
      {
        title: "Engineered 'hir0' Chess Engine",
        description: "Created a chess engine in pure JavaScript with alpha-beta pruning, quiescence search, and a pixel-art UI with an interactive thinking bot."
      },
      {
        title: "Achieved Competitive Programming Milestones",
        description: "Solved over 450+ DSA problems on LeetCode, achieved a 3-star rating on CodeChef, and reached the Specialist rating on Codeforces."
      }
    ]
  },
  {
    year: "2024",
    events: [
      {
        title: "Started Development & CP Journey",
        description: "Began my journey into full-stack development, building my first projects combining web technologies and machine learning while starting competitive programming."
      },
      {
        title: "Launched 'Kamikaze' E-commerce Store",
        description: "Built a complete MERN stack minimalistic clothing store featuring JWT authentication, a PayPal payment gateway, and an admin dashboard for managing products, users, and orders."
      },
      {
        title: "College Table Tennis Representation",
        description: "Represented IIIT Allahabad in table tennis at IIT Kanpur's annual sports fest - 'Udghosh', showcasing teamwork and dedication outside of academics."
      }
    ]
  },
  {
    year: "2023",
    events: [
      {
        title: "Cracked JEE Mains & Advanced",
        description: "Secured a 99.47 percentile (AIR 6220) in JEE Mains and qualified for top engineering institutes by clearing JEE Advanced."
      },
      {
        title: "CBSE Class 12 School Topper",
        description: "Achieved 97.2% in the CBSE board examinations, securing top score in my school across all streams with the highest marks in Physics and Chemistry."
      },
      {
        title: "Joined IIIT Allahabad",
        description: "Began my B.Tech in Information Technology at the Indian Institute of Information Technology, Allahabad, one of the nation's premier technical institutes."
      }
    ]
  },
  {
    year: "2021",
    events: [
      {
        title: "CBSE Class 10 Excellence",
        description: "Achieved 99.8% in the national CBSE board examinations, securing the top rank in my district and state."
      }
    ]
  }
];

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

          <div className="relative flex w-full h-[10%] max-w-4xl mx-auto items-center justify-center overflow-hidden [box-shadow:inset_0_-10px_8px_-5px_rgba(0,0,0,0.05)] border-b border-gray-200 dark:border-neutral-600">
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
            <h1 className="text-4xl mb-8 font-bold text-gray-800 dark:text-white p-6 border-t border-gray-200 dark:border-neutral-600">Timeline of Achievements</h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, filter: "blur(10px)", y: 10}}
            whileInView={{ opacity: 1, filter: "blur(0px)", y: 0}}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
          >
          <Timeline value={12} className='px-6 pt-4'>
            {timelineData.map((yearEntry, yearIndex) => (
              <React.Fragment key={yearEntry.year}>
                {yearEntry.events.map((event, eventIndex) => {
                  const step = timelineData.slice(0, yearIndex).reduce((acc, curr) => acc + curr.events.length, 0) + eventIndex + 1;
                  const isFirstEventOfYear = eventIndex === 0;

                  return (
                    <TimelineItem
                      key={event.title}
                      step={step}
                      // --- CHANGE: Add more top margin to the first item of each new year ---
                      className={cn(
                        "group-data-[orientation=vertical]/timeline:ms-10",
                        isFirstEventOfYear && yearIndex > 0 ? "mt-10" : ""
                      )}
                    >
                      {/* The header no longer needs flex properties */}
                      <TimelineHeader>
                        {/* <TimelineSeparator className="group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:h-full group-data-[orientation=vertical]/timeline:translate-y-0" /> */}
                        
                        {/* --- FIX #1: The Date is now positioned absolutely to the left --- */}
                        {isFirstEventOfYear && (
                          <TimelineDate className="absolute -left-[2.5rem] -top-12 mb-0 ">
                            {yearEntry.year}
                          </TimelineDate>
                        )}
                        
                        <TimelineTitle className='text-lg font-semibold ml-4 '>{event.title}</TimelineTitle>
                        
                        {/* --- FIX #2: The Indicator is restyled to be an outline --- */}
                        <TimelineIndicator 
                          className="mt-3 flex size-5 items-center justify-center group-data-completed/timeline-item:bg-black/70 dark:group-data-completed/timeline-item:bg-white group-data-completed/timeline-item:text-white dark:group-data-completed/timeline-item:text-neutral-700 group-data-completed/timeline-item:border-none group-data-[orientation=vertical]/timeline:-left-7"
                        >
                          {/* The CheckIcon is now styled based on the completion state */}
                          <CheckIcon
                            className="font-bold group-not-data-completed/timeline-item:hidden"
                            size={16}
                          />
                        </TimelineIndicator>
                        
                      </TimelineHeader>
                      <TimelineContent className='pb-6 mt-1 ml-4'>{event.description}</TimelineContent>
                    </TimelineItem>
                  );
                })}
              </React.Fragment>
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
            <h1 className="border-t border-gray-200 dark:border-neutral-600 text-4xl px-6 font-bold text-gray-800 dark:text-white pt-6 [box-shadow:inset_0_10px_8px_-5px_rgba(0,0,0,0.05)]">
              Beyond the Code
            </h1>
          </motion.div>

          <motion.div className="text-start px-6 mb-4 text-md lg:text-md text-gray-700 dark:text-white/60"
            initial={{ opacity: 0, filter: "blur(10px)", y: 10}}
            whileInView={{ opacity: 1, filter: "blur(0px)", y: 0}}
            transition={{
              duration: 0.4,
              ease: "easeInOut",
            }}
          >
            <p>
              I believe great design and clean code share a common source: a new perspective. I find mine exploring the world with a camera in hand. Travel teaches me how to approach problems differently, while photography trains my eye for the details that make an experience feel just right.
            </p>
          </motion.div>

        
          <DraggableCardContainer className="border-b border-gray-200 dark:border-neutral-600 mb-8 relative flex min-h-screen items-center justify-center overflow-clip [box-shadow:inset_0_-10px_8px_-5px_rgba(0,0,0,0.05)]">
              <p className="absolute top-1/2 mx-auto max-w-lg -translate-y-3/4 text-center text-2xl font-black text-neutral-700 md:text-4xl dark:text-neutral-100">
                  Building pixel-perfect apps and capturing picture-perfect moments.
              </p>
              {items.map((item, index) => (
                  <DraggableCardBody key={item.title} className={item.className}>
                  <img
                      src={item.image}
                      alt={item.title}
                      className="pointer-events-none relative z-10 h-64 w-80 object-cover"
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

