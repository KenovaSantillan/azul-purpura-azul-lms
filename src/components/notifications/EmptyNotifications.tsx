
import React from 'react';
import { Bell } from 'lucide-react';

const EmptyNotifications = () => {
  return (
    <div className="p-4 text-center text-muted-foreground">
      <Bell className="mx-auto h-8 w-8 mb-2 opacity-50" />
      <p>No hay notificaciones</p>
    </div>
  );
};

export default EmptyNotifications;
