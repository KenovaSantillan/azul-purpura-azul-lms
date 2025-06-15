
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Trash2 } from 'lucide-react';

interface NotificationHeaderProps {
  unreadCount: number;
  hasNotifications: boolean;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
}

const NotificationHeader = ({ unreadCount, hasNotifications, onMarkAllAsRead, onClearAll }: NotificationHeaderProps) => {
  return (
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <CardTitle className="text-lg">Notificaciones</CardTitle>
        <div className="flex gap-1">
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onMarkAllAsRead}
              className="text-xs"
            >
              <Check className="h-3 w-3 mr-1" />
              Marcar todas
            </Button>
          )}
          {hasNotifications && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClearAll}
              className="text-xs text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    </CardHeader>
  );
};

export default NotificationHeader;
