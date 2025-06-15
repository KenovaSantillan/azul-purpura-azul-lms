
import React, { useState, useEffect, useCallback } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLMS } from '@/contexts/LMSContext';
import { useUser } from '@/contexts/UserContext';
import { useOptimizedCache } from '@/hooks/useOptimizedCache';
import NotificationHeader from './NotificationHeader';
import NotificationItem from './NotificationItem';
import EmptyNotifications from './EmptyNotifications';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  persistent?: boolean;
}

const NOTIFICATION_STORAGE_KEY = 'kenova_notifications_state';
const MAX_NOTIFICATIONS = 50;

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const { tasks, announcements } = useLMS();
  const { currentUser } = useUser();
  const { updateCache } = useOptimizedCache();

  // Load persisted notification state
  useEffect(() => {
    const saved = localStorage.getItem(NOTIFICATION_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const validNotifications = parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }));
        setNotifications(validNotifications);
        setUnreadCount(validNotifications.filter((n: Notification) => !n.read).length);
      } catch (error) {
        console.warn('Failed to load notifications from localStorage:', error);
      }
    }
  }, []);

  // Persist notification state
  const persistNotifications = useCallback((notifs: Notification[]) => {
    try {
      localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(notifs));
    } catch (error) {
      console.warn('Failed to save notifications to localStorage:', error);
    }
  }, []);

  // Generate notifications from tasks and announcements
  useEffect(() => {
    const generateNotifications = () => {
      const newNotifications: Notification[] = [];

      // Task notifications
      const pendingTasks = tasks.filter(task => {
        const dueDate = new Date(task.dueDate || '');
        const now = new Date();
        const daysDiff = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return daysDiff <= 3 && daysDiff >= 0;
      });

      pendingTasks.forEach(task => {
        const existingNotif = notifications.find(n => n.id === `task-${task.id}`);
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

      // Announcement notifications
      const recentAnnouncements = announcements.slice(0, 3);
      recentAnnouncements.forEach(announcement => {
        const existingNotif = notifications.find(n => n.id === `announcement-${announcement.id}`);
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

      if (newNotifications.length > 0) {
        setNotifications(prev => {
          const updated = [...newNotifications, ...prev]
            .slice(0, MAX_NOTIFICATIONS);
          persistNotifications(updated);
          return updated;
        });
        setUnreadCount(prev => prev + newNotifications.length);
      }
    };

    generateNotifications();
  }, [tasks, announcements, notifications, persistNotifications]);

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
    localStorage.removeItem(NOTIFICATION_STORAGE_KEY);
  }, []);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <Card className="border-0 shadow-lg">
          <NotificationHeader
            unreadCount={unreadCount}
            hasNotifications={notifications.length > 0}
            onMarkAllAsRead={markAllAsRead}
            onClearAll={clearAllNotifications}
          />
          <CardContent className="p-0">
            <ScrollArea className="h-96">
              {notifications.length === 0 ? (
                <EmptyNotifications />
              ) : (
                <div className="space-y-1">
                  {notifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={markAsRead}
                      onRemove={removeNotification}
                    />
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;
