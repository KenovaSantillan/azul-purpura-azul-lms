
import { useCallback } from 'react';
import { Notification, NOTIFICATION_STORAGE_KEY } from '@/types/notifications';

export const useNotificationPersistence = () => {
  const persistNotifications = useCallback((notifications: Notification[]) => {
    try {
      localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(notifications));
    } catch (error) {
      console.warn('Failed to save notifications to localStorage:', error);
    }
  }, []);

  const loadPersistedNotifications = useCallback((): Notification[] => {
    const saved = localStorage.getItem(NOTIFICATION_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }));
      } catch (error) {
        console.warn('Failed to load notifications from localStorage:', error);
      }
    }
    return [];
  }, []);

  const clearPersistedNotifications = useCallback(() => {
    localStorage.removeItem(NOTIFICATION_STORAGE_KEY);
  }, []);

  return {
    persistNotifications,
    loadPersistedNotifications,
    clearPersistedNotifications
  };
};
