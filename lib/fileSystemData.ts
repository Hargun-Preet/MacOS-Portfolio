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
    icon: '/assets/icons/folder-full.png',
    type: 'folder',
    children: [
      {
        id: 'Google Chrome',
        name: 'Chrome.app',
        icon: '/assets/icons/Chrome.png',
        type: 'file',
        opens: 'Google Chrome',
      },
      {
        id: 'VSCode',
        name: 'VS Code.app',
        icon: '/assets/icons/vsCode.png',
        type: 'file',
        opens: 'VS Code',
      },
      {
        id: 'Terminal',
        name: 'Terminal.app',
        icon: '/assets/icons/terminal.jpg',
        type: 'file',
        opens: 'Terminal',
      },
      {
        id: 'Notes',
        name: 'Notes.app',
        icon: '/assets/icons/notes.png',
        type: 'file',
        opens: 'Notes',
      },
      {
        id: 'Photos',
        name: 'Photos.app',
        icon: '/assets/icons/photos.png',
        type: 'file',
        opens: 'Photos',
      },
      {
        id: 'Photo Booth',
        name: 'Photo Booth.app',
        icon: '/assets/icons/photo-booth.png',
        type: 'file',
        opens: 'Photo Booth',
      },
      {
        id: 'Spotify',
        name: 'Spotify.app',
        icon: '/assets/icons/spotify.png',
        type: 'file',
        opens: 'Spotify',
      },
      {
        id: 'Trash',
        name: 'Trash.app',
        icon: '/assets/icons/trash.png',
        type: 'file',
        opens: 'Trash',
      },
      {
        id: 'Settings',
        name: 'System Settings.app',
        icon: '/assets/icons/settings.jpg',
        type: 'file',
        opens: 'System Settings',
      },
      {
        id: 'Utilities',
        name: 'Utilities',
        icon: '/assets/icons/folder-full.png',
        type: 'folder',
        children: [
          {
            id: 'Doom',
            name: 'Doom.app',
            icon: '/assets/icons/doom.png',
            type: 'file',
            opens: 'Doom',
          },
          {
            id: 'MacPaint',
            name: 'MacPaint.app',
            icon: '/assets/icons/macpaint.png',
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
    icon: '/assets/icons/folder-full.png',
    type: 'folder',
    children: [
      {
        id: 'Hargun',
        name: 'Hargun',
        icon: '/assets/icons/folder-full.png',
        type: 'folder',
        children: [
          {
            id: 'Desktop',
            name: 'Desktop',
            icon: '/assets/icons/folder-full.png',
            type: 'folder',
            children: [
              {
                id: 'Projects',
                name: 'Projects',
                icon: '/assets/icons/folder-full.png',
                type: 'folder',
                children: [
                  {
                    id: 'project01',
                    name: 'macOS Portfolio',
                    icon: '/assets/icons/apple.png',
                    type: 'file',
                    opens: 'Projects',
                  },
                  {
                    id: 'project02',
                    name: 'Inquate',
                    icon: '/assets/icons/inquate.png',
                    type: 'file',
                    opens: 'Projects',
                  },
                  {
                    id: 'project03',
                    name: 'Budgetly',
                    icon: '/assets/icons/budgetly.png',
                    type: 'file',
                    opens: 'Projects',
                  },
                  {
                    id: 'project04',
                    name: 'hir0',
                    icon: '/assets/icons/hir0.png',
                    type: 'file',
                    opens: 'Projects',
                  },
                  {
                    id: 'project05',
                    name: 'Project Aegis',
                    icon: '/assets/icons/aegis.png',
                    type: 'file',
                    opens: 'Projects',
                  },
                  {
                    id: 'project06',
                    name: 'Mystic Brawl',
                    icon: '/assets/icons/mb.png',
                    type: 'file',
                    opens: 'Projects',
                  },
                  {
                    id: 'project07',
                    name: 'Stock Genie',
                    icon: '/assets/icons/stock.png',
                    type: 'file',
                    opens: 'Projects',
                  },
                  {
                    id: 'project08',
                    name: 'Kamikaze',
                    icon: '/assets/icons/kamikaze.png',
                    type: 'file',
                    opens: 'Projects',
                  },
                ],
              },
              {
                id: 'Resume',
                name: 'Resume.pdf',
                icon: '/assets/icons/pdf.png',
                type: 'file',
                opens: 'Resume',
              },
              {
                id: 'About Me',
                name: 'About_Me.txt',
                icon: '/assets/icons/text.png',
                type: 'file',
                opens: 'About Me',
              },
              {
                id: 'Secrets',
                name: '.secrets.txt',
                icon: '/assets/icons/text.png',
                type: 'file',
                opens: 'Secrets',
                // hidden: true, // you can use this flag in your UI to hide unless "ls -a"
              },
            ],
          },
          {
            id: 'Documents',
            name: 'Documents',
            icon: '/assets/icons/folder.png',
            type: 'folder',
            children: [],
          },
          {
            id: 'Downloads',
            name: 'Downloads',
            icon: '/assets/icons/folder.png',
            type: 'folder',
            children: [],
          },
          {
            id: 'Pictures',
            name: 'Pictures',
            icon: '/assets/icons/folder.png',
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
    icon: '/assets/icons/folder-full.png',
    type: 'folder',
    children: [
      {
        id: 'bin',
        name: 'bin',
        icon: '/assets/icons/folder-full.png',
        type: 'folder',
        children: [
            { id: 'ls', name: 'ls', icon: '/assets/icons/exec.png', type: 'file', opens: 'ls' },
            { id: 'cd', name: 'cd', icon: '/assets/icons/exec.png', type: 'file', opens: 'cd' },
            { id: 'cat', name: 'cat', icon: '/assets/icons/exec.png', type: 'file', opens: 'cat' },
            { id: 'clear', name: 'clear', icon: '/assets/icons/exec.png', type: 'file', opens: 'clear' },
            { id: 'help', name: 'help', icon: '/assets/icons/exec.png', type: 'file', opens: 'help' },
        ],
      },
    ],
  },
];


// Define favorites for the sidebar
export const favorites = [
  { id: 'Projects', name: 'Projects', icon: '/assets/icons/folder.png' },
  { id: 'Resume', name: 'Resume', icon: '/assets/icons/pdf.png' },
  { id: 'Photos', name: 'Photos', icon: '/assets/icons/Photos.png' },
];