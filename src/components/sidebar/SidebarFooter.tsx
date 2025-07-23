
import React from 'react';
import { Button } from '@/components/ui/button';
import { SidebarFooter } from '@/components/ui/sidebar';
import { useTheme } from '@/contexts/ThemeContext';
import { useUser } from '@/contexts/UserContext';

const AppSidebarFooter = () => {
  const { theme, toggleTheme } = useTheme();
  const { currentUser, activeView, setActiveView } = useUser();

  const handleViewChange = () => {
    setActiveView(activeView === 'superadmin' ? 'teacher' : 'superadmin');
  };

  return (
    <SidebarFooter>
      <div className="p-4 space-y-2">
        {currentUser?.role === 'superadmin' && (
          <Button
            variant="outline"
            onClick={handleViewChange}
            className="w-full"
          >
            {activeView === 'superadmin' ? 'Ver como Docente' : 'Ver como Superadmin'}
          </Button>
        )}
        <Button
          variant="outline"
          onClick={toggleTheme}
          className="w-full"
        >
          {theme === 'light' ? '🌙 Modo Oscuro' : '☀️ Modo Claro'}
        </Button>
        <div className="text-xs text-muted-foreground text-center">
          Portal Kenova v1.0
        </div>
      </div>
    </SidebarFooter>
  );
};

export default AppSidebarFooter;
