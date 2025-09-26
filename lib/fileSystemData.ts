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
    icon: '/assets/icons/folder.png',
    type: 'folder',
    children: [
      {
        id: 'Doom',
        name: 'Doom.app',
        icon: '/assets/icons/Doom.png',
        type: 'file',
        opens: 'Doom',
      },
      {
        id: 'MacPaint',
        name: 'MacPaint.app',
        icon: '/assets/icons/MacPaint.png',
        type: 'file',
        opens: 'MacPaint',
      },
      {
        id: 'Google Chrome',
        name: 'Chrome.app',
        icon: '/assets/icons/Chrome.png',
        type: 'file',
        opens: 'Google Chrome',
      },
      {
        id: 'Terminal',
        name: 'Terminal.app',
        icon: '/assets/icons/Terminal.jpg',
        type: 'file',
        opens: 'Terminal',
      },
    ],
  },
  {
    id: 'Users',
    name: 'Users',
    icon: '/assets/icons/folder.png',
    type: 'folder',
    children: [
      {
        id: 'Hargun',
        name: 'Hargun',
        icon: '/assets/icons/folder.png',
        type: 'folder',
        children: [
          {
            id: 'Desktop',
            name: 'Desktop',
            icon: '/assets/icons/folder.png',
            type: 'folder',
            children: [
              {
                id: 'Projects',
                name: 'Projects',
                icon: '/assets/icons/folder.png',
                type: 'folder',
                children: [
                  {
                    id: 'project01',
                    name: 'macOS Portfolio',
                    icon: '/assets/icons/apple.png',
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
    icon: '/assets/icons/folder.png',
    type: 'folder',
    children: [
      {
        id: 'bin',
        name: 'bin',
        icon: '/assets/icons/folder.png',
        type: 'folder',
        children: [
            { id: 'ls', name: 'ls', icon: '/assets/icons/terminal.png', type: 'file', opens: 'ls' },
            { id: 'cd', name: 'cd', icon: '/assets/icons/terminal.png', type: 'file', opens: 'cd' },
            { id: 'cat', name: 'cat', icon: '/assets/icons/terminal.png', type: 'file', opens: 'cat' },
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