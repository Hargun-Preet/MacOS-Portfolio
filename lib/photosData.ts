export interface Photo {
  id: number;
  src: string;
  title: string;
  date: string; // e.g., "2025-08-26"
  category: 'Library' | 'Favorites' | 'Recents';
  isFavorite?: boolean;
}

export const photosData: Photo[] = [
  { id: 1, src: '/assets/wallpaper.jpg', title: 'Mountain Sunset', date: '2025-08-25', category: 'Library', isFavorite: true },
  { id: 2, src: '/assets/wallpaper.jpg', title: 'Forest Path', date: '2025-08-24', category: 'Library' },
  { id: 3, src: '/assets/wallpaper.jpg', title: 'Beach in Thailand', date: '2025-08-22', category: 'Recents', isFavorite: true },
  { id: 4, src: '/assets/wallpaper.jpg', title: 'Street Portrait', date: '2025-08-20', category: 'Library' },
  { id: 5, src: '/assets/wallpaper.jpg', title: 'Misty River', date: '2025-07-15', category: 'Recents' },
  { id: 6, src: '/assets/wallpaper.jpg', title: 'Cobblestone Street', date: '2025-06-01', category: 'Library' },
  // ... Add as many photos as you like
];