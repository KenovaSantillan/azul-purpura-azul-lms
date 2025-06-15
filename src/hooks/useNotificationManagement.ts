
import { useState, useEffect, useCallback } from 'react';
import { useLMS } from '@/contexts/LMSContext';
import { useOptimizedCache } from '@/hooks/useOptimizedCache';
import { useNotificationPersistence } from '@/hooks/useNotificationPersistence';
import { useNotificationGeneration } from '@/hooks/useNotificationGeneration';
import { Notification, MAX_NOTIFICATIONS } from '@/types/notifications';

export const useNotificationManagement = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { tasks, announcements } = useLMS();
  const { updateCache } = useOptimizedCache();
  const { persistNotifications, loadPersistedNotifications, clearPersistedNotifications } = useNotificationPersistence();
  const { generateTaskNotifications, generateAnnouncementNotifications } = useNotificationGeneration();

  // Load persisted notification state
  useEffect(() => {
    const loadedNotifications = loadPersistedNotifications();
    setNotifications(loadedNotifications);
    setUnreadCount(loadedNotifications.filter((n: Notification) => !n.read).length);
  }, [loadPersistedNotifications]);

  // Generate notifications from tasks and announcements
  useEffect(() => {
    const generateNotifications = () => {
      const taskNotifications = generateTaskNotifications(tasks, notifications);
      const announcementNotifications = generateAnnouncementNotifications(announcements, notifications);
      const allNewNotifications = [...taskNotifications, ...announcementNotifications];

      if (allNewNotifications.length > 0) {
        setNotifications(prev => {
          const updated = [...allNewNotifications, ...prev]
            .slice(0, MAX_NOTIFICATIONS);
          persistNotifications(updated);
          return updated;
        });
        setUnreadCount(prev => prev + allNewNotifications.length);
      }
    };

    generateNotifications();
  }, [tasks, announcements, notifications, persistNotifications, generateTaskNotifications, generateAnnouncementNotifications]);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => {
      const updated = prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      );
      persistNotifications(updated);
      return updated;
    });
    setUnreadCount(prev => Math.max(0, prev - 1));
    updateCache(['notifications'], (old) => ({ ...old, updated: Date.now() }));
  }, [persistNotifications, updateCache]);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => {
      const updated = prev.map(notif => ({ ...notif, read: true }));
      persistNotifications(updated);
      return updated;
    });
    setUnreadCount(0);
    updateCache(['notifications'], (old) => ({ ...old, allRead: Date.now() }));
  }, [persistNotifications, updateCache]);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => {
      const updated = prev.filter(notif => notif.id !== id);
      persistNotifications(updated);
      const wasUnread = prev.find(n => n.id === id)?.read === false;
      if (wasUnread) {
        setUnreadCount(count => Math.max(0, count - 1));
      }
      return updated;
    });
  }, [persistNotifications]);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
    clearPersistedNotifications();
  }, [clearPersistedNotifications]);

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications
  };
};
