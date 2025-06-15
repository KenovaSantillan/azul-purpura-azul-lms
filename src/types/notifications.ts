
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  persistent?: boolean;
}

export const NOTIFICATION_STORAGE_KEY = 'kenova_notifications_state';
export const MAX_NOTIFICATIONS = 50;
