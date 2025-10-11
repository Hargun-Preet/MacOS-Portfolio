// Define the types for our files and folders
export interface File {
  id: string;
  name: string;
  icon: string;
  type: 'file';
  opens: string; // The ID of the window to open
}

export interface Folder {
  id: string;
  name: string;
  icon: string;
  type: 'folder';
  children: (File | Folder)[];
}

// Define the file system structure
export const fileSystem: (File | Folder)[] = [
  {
    id: 'Applications',
    name: 'Applications',
    icon: '/assets/Icons/folder-full.png',
    type: 'folder',
    children: [
      {
        id: 'Google Chrome',
        name: 'Chrome.app',
        icon: '/assets/Icons/chrome.png',
        type: 'file',
        opens: 'Google Chrome',
      },
      {
        id: 'VSCode',
        name: 'VS Code.app',
        icon: '/assets/Icons/vscode.png',
        type: 'file',
        opens: 'VS Code',
      },
      {
        id: 'Terminal',
        name: 'Terminal.app',
        icon: '/assets/Icons/terminal.jpg',
        type: 'file',
        opens: 'Terminal',
      },
      {
        id: 'Notes',
        name: 'Notes.app',
        icon: '/assets/Icons/notes.png',
        type: 'file',
        opens: 'Notes',
      },
      {
        id: 'Photos',
        name: 'Photos.app',
        icon: '/assets/Icons/photos.png',
        type: 'file',
        opens: 'Photos',
      },
      {
        id: 'Photo Booth',
        name: 'Photo Booth.app',
        icon: '/assets/Icons/photo-booth.png',
        type: 'file',
        opens: 'Photo Booth',
      },
      {
        id: 'Spotify',
        name: 'Spotify.app',
        icon: '/assets/Icons/spotify.png',
        type: 'file',
        opens: 'Spotify',
      },
      {
        id: 'Trash',
        name: 'Trash.app',
        icon: '/assets/Icons/trash.png',
        type: 'file',
        opens: 'Trash',
      },
      {
        id: 'Settings',
        name: 'System Settings.app',
        icon: '/assets/Icons/settings.jpg',
        type: 'file',
        opens: 'System Settings',
      },
      {
        id: 'Utilities',
        name: 'Utilities',
        icon: '/assets/Icons/folder-full.png',
        type: 'folder',
        children: [
          {
            id: 'Doom',
            name: 'Doom.app',
            icon: '/assets/Icons/doom.png',
            type: 'file',
            opens: 'Doom',
          },
          {
            id: 'MacPaint',
            name: 'MacPaint.app',
            icon: '/assets/Icons/macpaint.png',
            type: 'file',
            opens: 'MacPaint',
          },
        ],
      },
    ],
  },
  {
    id: 'Users',
    name: 'Users',
    icon: '/assets/Icons/folder-full.png',
    type: 'folder',
    children: [
      {
        id: 'Hargun',
        name: 'Hargun',
        icon: '/assets/Icons/folder-full.png',
        type: 'folder',
        children: [
          {
            id: 'Desktop',
            name: 'Desktop',
            icon: '/assets/Icons/folder-full.png',
            type: 'folder',
            children: [
              {
                id: 'Projects',
                name: 'Projects',
                icon: '/assets/Icons/folder-full.png',
                type: 'folder',
                children: [
                  {
                    id: 'project01',
                    name: 'macOS Portfolio',
                    icon: '/assets/Icons/apple.png',
                    type: 'file',
                    opens: 'Projects',
                  },
                  {
                    id: 'project02',
                    name: 'Inquate',
                    icon: '/assets/Icons/inquate.png',
                    type: 'file',
                    opens: 'Projects',
                  },
                  {
                    id: 'project03',
                    name: 'Budgetly',
                    icon: '/assets/Icons/budgetly.png',
                    type: 'file',
                    opens: 'Projects',
                  },
                  {
                    id: 'project04',
                    name: 'hir0',
                    icon: '/assets/Icons/hir0.png',
                    type: 'file',
                    opens: 'Projects',
                  },
                  {
                    id: 'project05',
                    name: 'Project Aegis',
                    icon: '/assets/Icons/aegis.png',
                    type: 'file',
                    opens: 'Projects',
                  },
                  {
                    id: 'project06',
                    name: 'Mystic Brawl',
                    icon: '/assets/Icons/mb.png',
                    type: 'file',
                    opens: 'Projects',
                  },
                  {
                    id: 'project07',
                    name: 'Stock Genie',
                    icon: '/assets/Icons/stock.png',
                    type: 'file',
                    opens: 'Projects',
                  },
                  {
                    id: 'project08',
                    name: 'Kamikaze',
                    icon: '/assets/Icons/kamikaze.png',
                    type: 'file',
                    opens: 'Projects',
                  },
                ],
              },
              {
                id: 'Resume',
                name: 'Resume.pdf',
                icon: '/assets/Icons/pdf.png',
                type: 'file',
                opens: 'Resume',
              },
              {
                id: 'About Me',
                name: 'About_Me.txt',
                icon: '/assets/Icons/text.png',
                type: 'file',
                opens: 'About Me',
              },
              {
                id: 'Secrets',
                name: '.secrets.txt',
                icon: '/assets/Icons/text.png',
                type: 'file',
                opens: 'Secrets',
                // hidden: true, // you can use this flag in your UI to hide unless "ls -a"
              },
            ],
          },
          {
            id: 'Documents',
            name: 'Documents',
            icon: '/assets/Icons/folder.png',
            type: 'folder',
            children: [],
          },
          {
            id: 'Downloads',
            name: 'Downloads',
            icon: '/assets/Icons/folder.png',
            type: 'folder',
            children: [],
          },
          {
            id: 'Pictures',
            name: 'Pictures',
            icon: '/assets/Icons/folder.png',
            type: 'folder',
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: 'System',
    name: 'System',
    icon: '/assets/Icons/folder-full.png',
    type: 'folder',
    children: [
      {
        id: 'bin',
        name: 'bin',
        icon: '/assets/Icons/folder-full.png',
        type: 'folder',
        children: [
            { id: 'ls', name: 'ls', icon: '/assets/Icons/exec.png', type: 'file', opens: 'ls' },
            { id: 'cd', name: 'cd', icon: '/assets/Icons/exec.png', type: 'file', opens: 'cd' },
            { id: 'cat', name: 'cat', icon: '/assets/Icons/exec.png', type: 'file', opens: 'cat' },
            { id: 'clear', name: 'clear', icon: '/assets/Icons/exec.png', type: 'file', opens: 'clear' },
            { id: 'help', name: 'help', icon: '/assets/Icons/exec.png', type: 'file', opens: 'help' },
        ],
      },
    ],
  },
];


// Define favorites for the sidebar
export const favorites = [
  { id: 'Projects', name: 'Projects', icon: '/assets/Icons/folder.png' },
  { id: 'Resume', name: 'Resume', icon: '/assets/Icons/pdf.png' },
  { id: 'Photos', name: 'Photos', icon: '/assets/Icons/photos.png' },
];