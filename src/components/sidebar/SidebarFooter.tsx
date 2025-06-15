
import React from 'react';
import { Button } from '@/components/ui/button';
import { SidebarFooter } from '@/components/ui/sidebar';
import { useTheme } from '@/contexts/ThemeContext';

const AppSidebarFooter = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <SidebarFooter>
      <div className="p-4 space-y-2">
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
