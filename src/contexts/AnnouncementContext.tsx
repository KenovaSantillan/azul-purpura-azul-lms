
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Announcement } from '@/types/lms';

export interface AnnouncementContextType {
  announcements: Announcement[];
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'createdAt'>) => void;
  updateAnnouncement: (id: string, announcement: Partial<Omit<Announcement, 'id' | 'createdAt' | 'createdBy'>>) => void;
  deleteAnnouncement: (id: string) => void;
}

const AnnouncementContext = createContext<AnnouncementContextType | undefined>(undefined);

export function AnnouncementProvider({ children }: { children: React.ReactNode }) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    const sampleAnnouncements: Announcement[] = [
      {
        id: '1',
        title: 'Bienvenidos al nuevo semestre',
        content: 'Esperamos que tengan un excelente semestre lleno de aprendizaje.',
        groupId: '1',
        createdBy: '1',
        createdAt: new Date(),
        priority: 'high',
      }
    ];
    setAnnouncements(sampleAnnouncements);
  }, []);

  const addAnnouncement = (announcement: Omit<Announcement, 'id' | 'createdAt'>) => {
    const newAnnouncement: Announcement = {
      ...announcement,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setAnnouncements(prev => [...prev, newAnnouncement]);
  };

  const updateAnnouncement = (id: string, announcement: Partial<Omit<Announcement, 'id' | 'createdAt' | 'createdBy'>>) => {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, ...announcement } : a));
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  const value = { announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement };

  return (
    <AnnouncementContext.Provider value={value}>
      {children}
    </AnnouncementContext.Provider>
  );
}

export function useAnnouncements() {
  const context = useContext(AnnouncementContext);
  if (context === undefined) {
    throw new Error('useAnnouncements must be used within an AnnouncementProvider');
  }
  return context;
}
