export interface Photo {
  id: number;
  src: string;
  title: string;
  date: string; // e.g., "2025-08-26"
  category: 'Library' | 'Favorites' | 'Recents';
  isFavorite?: boolean;
}

export const photosData: Photo[] = [
  { id: 14, src: '/assets/photos/me2.jpeg', title: 'Me', date: '2025-05-31', category: 'Recents' },
  { id: 13, src: '/assets/photos/snowman.jpeg', title: 'Snowman', date: '2025-04-14', category: 'Recents' },
  { id: 12, src: '/assets/photos/me3.jpeg', title: 'Me', date: '2025-04-13', category: 'Recents' },
  { id: 11, src: '/assets/photos/gtk2.jpeg', title: 'Monastry in Gangtok', date: '2025-04-13', category: 'Recents', isFavorite: true },
  { id: 10, src: '/assets/photos/djg2.jpeg', title: 'Red Panda in Darjeeling', date: '2025-04-11', category: 'Library', isFavorite: true },
  { id: 9, src: '/assets/photos/code.jpeg', title: 'Building Budgetly', date: '2025-03-27', category: 'Library' },
  { id: 8, src: '/assets/photos/me.jpeg', title: 'Me', date: '2024-12-25', category: 'Recents' },
  { id: 7, src: '/assets/photos/fest.jpeg', title: 'Sanam in College Fest', date: '2024-10-27', category: 'Library' },
  { id: 6, src: '/assets/photos/kanpur.jpeg', title: 'Deadpool Mural in Kanpur', date: '2024-10-05', category: 'Recents', isFavorite: true },
  { id: 5, src: '/assets/photos/dog.jpeg', title: 'Dog in Kasauli', date: '2024-07-07', category: 'Library' },
  { id: 4, src: '/assets/photos/bar.jpeg', title: 'Housewood Villa', date: '2024-06-16', category: 'Library', isFavorite: true },
  { id: 3, src: '/assets/photos/bagh.jpeg', title: 'The Bagh', date: '2024-06-06', category: 'Library', isFavorite: true },
  { id: 2, src: '/assets/photos/delhi2.jpeg', title: 'Connaught Place, Delhi', date: '2024-03-25', category: 'Library', isFavorite: true },
  { id: 1, src: '/assets/photos/air.jpeg', title: 'First Flight', date: '2023-08-16', category: 'Library' },
];