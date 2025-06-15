
import { useCallback } from 'react';
import { Notification } from '@/types/notifications';

export const useNotificationGeneration = () => {
  const generateTaskNotifications = useCallback((tasks: any[], existingNotifications: Notification[]): Notification[] => {
    const newNotifications: Notification[] = [];

    const pendingTasks = tasks.filter(task => {
      const dueDate = new Date(task.dueDate || '');
      const now = new Date();
      const daysDiff = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff <= 3 && daysDiff >= 0;
    });

    pendingTasks.forEach(task => {
      const existingNotif = existingNotifications.find(n => n.id === `task-${task.id}`);
      if (!existingNotif) {
        const dueDate = new Date(task.dueDate || '');
        const now = new Date();
        const daysDiff = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        newNotifications.push({
          id: `task-${task.id}`,
          title: daysDiff === 0 ? 'Tarea vence hoy' : 'Tarea próxima a vencer',
          message: `"${task.title}" ${daysDiff === 0 ? 'vence hoy' : `vence en ${daysDiff} día${daysDiff === 1 ? '' : 's'}`}`,
          type: daysDiff === 0 ? 'error' : 'warning',
          timestamp: new Date(),
          read: false,
          actionUrl: `/tasks/${task.id}`,
        });
      }
    });

    return newNotifications;
  }, []);

  const generateAnnouncementNotifications = useCallback((announcements: any[], existingNotifications: Notification[]): Notification[] => {
    const newNotifications: Notification[] = [];
    const recentAnnouncements = announcements.slice(0, 3);
    
    recentAnnouncements.forEach(announcement => {
      const existingNotif = existingNotifications.find(n => n.id === `announcement-${announcement.id}`);
      if (!existingNotif) {
        newNotifications.push({
          id: `announcement-${announcement.id}`,
          title: 'Nuevo anuncio',
          message: announcement.title,
          type: announcement.priority === 'high' ? 'error' : 'info',
          timestamp: new Date(announcement.createdAt || ''),
          read: false,
          actionUrl: `/announcements/${announcement.id}`,
        });
      }
    });

    return newNotifications;
  }, []);

  return {
    generateTaskNotifications,
    generateAnnouncementNotifications
  };
};
