import React, { useState, useEffect, useRef } from 'react';
import { fileSystem, type File, type Folder } from '@/lib/fileSystemData';
import { get } from 'lodash';

const happyMacArt = `
                                                                                                            
                             MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMN                           
                         MNMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMNNN                       
                       MMMM                                               MMNNNM                     
                     MMMMM                                                 NMMMM                    
                     MMNN                                                    NMMM                   
                    NMMM     MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMNN     NMN                   
                    NMMN    NMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMN    MMM                   
                    NMMN    MMM                                       NMMN    MMM                   
                    NMMN    MMM                                       NMMN    MMM                   
                    NMMN    MMM                                       NMMN    MMM                   
                    NMMN    MMM          MN       MN      MN          NMMN    MMM                   
                    NMMN    MMM         NMMN      NMN    NMMN         NMMN    MMM                   
                    NMMN    MMM         MMMM      NMN    MMMM         NMMN    MMM                   
                    NMMN    MMM          MM       NMN     NM          NMMN    MMM                   
                    NMMN    MMM                   NMN                 NMMN    MMM                   
                    NMMN    MMM                   NMN                 NMMN    MMM                   
                    NMMN    MMM                   NMN                 NMMN    MMM                   
                    NMMN    MMM               NMMMMNM                 NMMN    MMM                   
                    NMMN    MMM                MMMMM                  NMMN    MMM                   
                    NMMN    MMM                                       NMMN    MMM                   
                    NMMN    MMM           MNM            MNM          NMMN    MMM                   
                    NMMN    MMM           MNMNNNNNNNNNNMNMMM          NMMN    MMM                   
                    NMMN    MMM            NMMNMMMMMMMMNNMM           NMMN    MMM                   
                    NMMN    MMM                                       NMMN    MMM                   
                    NMMN    MMM                                       NMMN    MMM                   
                    NMMN    MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM    MMM                   
                    NMMN    NNNMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMNM    MMM                   
                    NMMN       MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM       MMM                   
                    NMMN                                                      MMM                   
                    NMMN                                                      MMM                   
                    NMMN    CMC   CMC   CMC          CANNNNNNNNNNNNNNNAC      MMM                   
                    NMMN    MMM   MMM   MMM          CANNNNNNNNNNNNNNNAC      MMM                   
                    NMMN    CMC   CNC   CMC                                   MMM                   
                    NMMN                                                      MMM                   
                    NMMN                                                      MMM                   
                    NMMN                                                      MMM                   
                     MMNN                                                    NMMM                   
                     NMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMNNN                   
                        NNMMNMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM                       
                         NMMN                                            MMM                        
                         NMMN                                            NMN                        
                          MMMMNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNMMMM                        
                            MNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNM                          
                                                                                                    
                                                               MM          NM                       
                                                            MMMMNMMM     NMNNMNM                    
                                                          MMMM    NNN   MN    NM                    
                       NNNMMNMNMNNNNN   MNMMNMN   NMMMMMM MMN      NMN  NNMM  M                     
                        MMM  NMMN  NMN  NM  MMM  MMM  NM  NMN      NMN   NMNMNN                     
                        MMN   NN   NMM  NNMNMMN  MM       MMM      MMM     NNMNM                    
                        MMN   NN   NMN NMN  NMM  MMM      MNM      MMM  NM    NM                    
                        MMN   NN   NMN NMNMMNNN  MNNMM MN  MMMN  NMMN   MN   NMM                    
                       MNMN  NMNN MNMNN MNNM MMM   MNMMM     NMNMNM     MMMNNMM                     
                                                                                                    
`;

// Helper function to navigate the file system object
const getDirectoryFromPath = (path: string[]): Folder | null => {
  let current: any = { type: 'folder', children: fileSystem };
  for (const part of path) {
    if (current && current.type === 'folder' && current.children) {
      const next = current.children.find((item: File | Folder) => item.name === part);
      if (next) { // Can be a file or folder for path resolution
        current = next;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
  return current.type === 'folder' ? current : null;
};

const getItemFromPath = (path: string[], itemName: string): File | Folder | null => {
    const dir = getDirectoryFromPath(path);
    if (!dir || !dir.children) return null;
    return dir.children.find(item => item.name === itemName) || null;
};

export const TerminalWindowContent = ({ openWindow }: { openWindow: (id: string) => void }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<{ command?: string; path?: string; result: React.ReactNode }[]>([
    { result: `Welcome to Hargun's MacOS Portfolio! Type 'help' for commands.` }
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentPath, setCurrentPath] = useState<string[]>(['Users', 'Hargun']);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    containerRef.current?.scrollTo(0, containerRef.current.scrollHeight);
  }, [output]);

  const processCommand = (commandStr: string): React.ReactNode => {
    const [cmd, ...args] = commandStr.trim().split(' ');
    const currentDirectory = getDirectoryFromPath(currentPath);
    if (!currentDirectory) return "Fatal Error: Current directory not found. Please refresh.";

    switch (cmd) {
      case 'help':
        return `
  COMMANDS:
  - ls:         List files and directories
  - cd <dir>:   Change directory
  - pwd:        Print working directory
  - cat <file>: Display file content
  - clear:      Clear the terminal screen
  - help:       Show this help message
  
  PORTFOLIO:
  - about:      Display my bio
  - projects:   List my projects
  - resume:     Open my resume
  - contact:    Show contact information
  - open <app>: Launch an application (e.g., open Doom.app)

  FUN:
  - neofetch:   Display system information
  - whoami:     Display the current user
  - date:       Show the current date and time
  - fortune:    Display a random quote
  - sudo:       ...
        `;

      case 'ls':
        return currentDirectory.children.map(item => item.name).join('   ');

      case 'pwd':
        return `/${currentPath.join('/')}`;

      case 'cd':
                const dir = args[0];
                if (!dir || dir === '~') {
                    setCurrentPath(['Users', 'Hargun']);
                    return '';
                }
                if (dir === '..') {
                    if (currentPath.length > 0) setCurrentPath(prev => prev.slice(0, -1));
                    return '';
                }
                // Handle absolute paths
                const pathToGo = dir.split('/');
                let newPath = [...currentPath];
                if (dir.startsWith('/')) {
                    newPath = []; // Start from root if path is absolute
                }

                for (const part of pathToGo) {
                    if (part === '..') {
                        newPath.pop();
                    } else if (part !== '.') {
                        const tempDir = getDirectoryFromPath(newPath);
                        const newDir = tempDir?.children.find(item => item.name === part && item.type === 'folder');
                        if (newDir) {
                            newPath.push(part);
                        } else {
                            return `cd: no such file or directory: ${dir}`;
                        }
                    }
                }
                
                setCurrentPath(newPath);
                return '';

      case 'cat':
                const fileName = args[0];
                if (!fileName) return "Usage: cat <filename>";
                const file = currentDirectory.children.find(item => item.name === fileName && item.type === 'file');
                if (file) {
                    // This is a placeholder. You would have more detailed content in your fileSystemData.
                    return `Content of ${file.name}:\n--------------------\nThis file opens the '${file.opens}' application.`;
                }
                const isDir = currentDirectory.children.some(item => item.name === fileName && item.type === 'folder');
                if (isDir) return `cat: ${fileName}: Is a directory`;
                return `cat: ${fileName}: No such file or directory`;
      
      case 'clear':
      case 'cls':
        setOutput([]);
        return '';

      case 'about':
        openWindow('About Me');
        return `Opening 'About Me'...`;

      case 'projects':
        openWindow('Projects');
        return `Opening 'Projects'...`;

      case 'resume':
        openWindow('Resume');
        return 'Opening Resume...';

      case 'contact':
        return "Email: Singhhargun077@gmail.com\nLinkedIn: linkedin.com/in/hargun-preet-singh-964224282";

      case 'open':
        if (!args[0]) return 'Usage: open <app_name>. Try "open Doom.app" or "open MacPaint.app".';
        const appName = args[0].replace('.app', '');
        openWindow(appName);
        return `Opening ${appName}...`;

      case 'neofetch':
        return (
          <div className="flex gap-2 overflow-x:none">
            <div className="ascii-art">{happyMacArt}</div>
            <div className="whitespace-pre">
              <span>Hargun@macOS-Portfolio</span>
              <br />---------------------
              <br />
              <span >OS:</span>       macOS Portfolio v1.0
              <br />
              <span >Host:</span>     Your Browser
              <br />
              <span >Kernel:</span>   React.js / Next.js
              <br />
              <span >Uptime:</span>   As long as you've been here!
              <br />
              <span >Shell:</span>    zsh (simulated)
              <br />
              <span >Theme:</span>    Aqua / Dark
            </div>
          </div>
        );


      case 'whoami':
        return "Hargun";

      case 'date':
        return new Date().toLocaleString();

      case 'fortune':
        const fortunes = ["The best way to predict the future is to create it.", "Simplicity is the ultimate sophistication.", "Code is like humor. When you have to explain it, it’s bad."];
        return fortunes[Math.floor(Math.random() * fortunes.length)];

      case 'sudo':
        return "Permission denied: nice try ;)";
      
      default:
        return `zsh: command not found: ${cmd}`;
    }
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCommand = input.trim();

    const pathOnSubmit = currentPath.join('/').startsWith('Users/Hargun')
        ? `~${currentPath.join('/').substring('Users/Hargun'.length)}`
        : `/${currentPath.join('/')}`;

    if (newCommand === '') {
      setOutput(prev => [...prev, { path: pathOnSubmit, result: '' }]);
      return;
    }

    const result = processCommand(newCommand);
    setOutput(prev => [...prev, { command: newCommand, path: pathOnSubmit, result }]);
    if (newCommand) {
      setCommandHistory(prev => [newCommand, ...prev]);
    }
    setHistoryIndex(-1);
    setInput('');
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
      if (newIndex >= 0) {
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const newIndex = Math.max(historyIndex - 1, -1);
      setHistoryIndex(newIndex);
      setInput(newIndex >= 0 ? commandHistory[newIndex] : '');
    }
  };

  const Prompt = ({ path }: { path: string }) => {
    return (
        <>
        <span className="dark:text-lime-400 text-blue-600">Hargun-Macbook</span>
        <span className="text-gray-400 ">:</span>
        <span className="dark:text-cyan-400 text-emerald-400">{path}</span>
        <span className="text-gray-400">$ </span>
        </>
    );
  };

  const liveDisplayPath = currentPath.join('/').startsWith('Users/Hargun')
    ? `~${currentPath.join('/').substring('Users/Hargun'.length)}`
    : `/${currentPath.join('/')}`;

  return (
    <div
      ref={containerRef}
      className="h-full w-full bg-neutral-100 text-black dark:bg-[#1e1e1e]  p-2 text-sm dark:text-gray-200 font-fira-code overflow-y-auto"
      onClick={() => inputRef.current?.focus()}
    >
      {output.map((line, index) => (
        <div key={index}>
          {line.command && (
            <div className="flex">
              <Prompt path={line.path!}/>
              <span className="flex-1 ml-2">{line.command}</span>
            </div>
          )}
          <div className="whitespace-pre-wrap">{line.result}</div>
        </div>
      ))}
      <form onSubmit={handleInputSubmit} className="flex">
        <Prompt path={liveDisplayPath}/>
        <input
          ref={inputRef}
          type="text"
          spellCheck="false"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-grow bg-transparent border-none text-black dark:text-gray-200 focus:outline-none ml-2 "
          autoFocus
        />
      </form>
    </div>
  );
};
