import React, { useState, useMemo, useEffect } from 'react';

import { MacOSPortfolio } from './Projects/MacOsPortfolio';
import { IconSearch } from '@tabler/icons-react';
import { InquateContent } from './Projects/InquateContent';
import { BudgetlyContent } from './Projects/BudgetlyContent';
import { hir0Content } from './Projects/hir0Content';
import { MysticBrawlContent } from './Projects/MysticBrawlContent';
import { StockGenieContent } from './Projects/StockGenieContent';
import { AegisContent } from './Projects/AegisContent';
import { KamikazeContent } from './Projects/KamikazeContent';

const projectsData = [
  {
    id: "project01",
    title: "macOS Portfolio",
    component: MacOSPortfolio ,
  },
  {
    id: "project02",
    title: "Inquate",
    component: InquateContent,
  },
  {
    id: "project03",
    title: "Budgetly",
    component: BudgetlyContent,
  },
  {
    id: "project04",
    title: "hir0",
    component: hir0Content,
  },
  {
    id: "project05",
    title: "Project Aegis",
    component: AegisContent,
  },
  {
    id: "project06",
    title: "Mystic Brawl",
    component: MysticBrawlContent,
  },
  {
    id: "project07",
    title: "Stock Genie",
    component: StockGenieContent,
  },
  {
    id: "project08",
    title: "Kamikaze",
    component: KamikazeContent,
  },
];

export const ProjectsWindowContent = ({ isMaximized }: { isMaximized?: boolean }) => {
  // 3. Add new state for the search query
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("project01");

  // 4. Filter the projects based on the search query
  const filteredProjects = useMemo(() => {
    if (!searchQuery) {
      return projectsData;
    }
    return projectsData.filter(project =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // 5. If the selected project is filtered out, select the first visible one
  useEffect(() => {
    const isSelectedVisible = filteredProjects.some(p => p.id === selectedProjectId);
    if (!isSelectedVisible) {
      setSelectedProjectId(filteredProjects.length > 0 ? filteredProjects[0].id : null);
    }
  }, [filteredProjects, selectedProjectId]);
  
  const selectedProject = projectsData.find(p => p.id === selectedProjectId);

  return (
    <div className="flex h-full w-full bg-white dark:bg-neutral-700">
      {/* Sidebar */}
      <div className="flex-shrink-0 w-1/4 max-w-[200px] h-full bg-gray-100/80 dark:bg-neutral-600/90 border-r border-gray-300 dark:border-neutral-600 flex flex-col">
        <div className="p-2">
          <div className="relative">
            <IconSearch
              className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 dark:text-white" 
            />
            <input
              type="search"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-7 pr-2 py-1 text-sm border border-gray-300 dark:border-neutral-600 rounded-md bg-gray-300/50 dark:bg-neutral-500 text-gray-600 dark:text-white focus:outline-none"
            />
          </div>
        </div>
        <div className="p-2 flex-grow overflow-y-auto">
          {/* <h2 className="text-xs font-bold text-gray-500 uppercase mb-2">Projects</h2> */}
          <ul className="text-sm space-y-1">
            {/* 7. Map over the filtered list */}
            {filteredProjects.map((project) => (
              <li
                key={project.id}
                onClick={() => setSelectedProjectId(project.id)}
                className={`w-full text-left py-1.5 px-3 rounded-lg cursor-pointer ${
                  selectedProjectId === project.id
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-200 text-gray-800 dark:text-white dark:hover:bg-neutral-700"
                }`}
              >
                {project.title}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow p-6 h-full overflow-y-auto">
        {selectedProject ? (
          // 2. This is the fix: create the element and pass the prop down
          React.createElement(selectedProject.component, { isMaximized })
        ) : (
          <p className="text-gray-500">Select a project to view details.</p>
        )}
      </div>
    </div>
  );
};