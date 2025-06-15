
import React from 'react';
import { Users, User, Folder, List, User as UserIcon, Circle } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';

const menuItems = [
  {
    title: 'Dashboard',
    url: '#dashboard',
    icon: Circle,
  },
  {
    title: 'Grupos',
    url: '#groups',
    icon: Users,
  },
  {
    title: 'Aula Virtual',
    url: '#aula-virtual',
    icon: Circle,
  },
  {
    title: 'Estudiantes',
    url: '#students',
    icon: User,
  },
  {
    title: 'Tareas',
    url: '#tasks',
    icon: List,
  },
  {
    title: 'Tablón',
    url: '#announcements',
    icon: Folder,
  },
  {
    title: 'Progreso',
    url: '#progress',
    icon: UserIcon,
  },
];

interface AppSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function AppSidebar({ activeSection, onSectionChange }: AppSidebarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <Sidebar className="animate-slide-in-right">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-bold text-primary mb-4">
            🎓 Portal Kenova
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={activeSection === item.url.replace('#', '')}
                    className="hover:bg-accent transition-colors duration-200"
                  >
                    <button
                      onClick={() => onSectionChange(item.url.replace('#', ''))}
                      className="w-full flex items-center gap-3 p-3 rounded-lg"
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
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
    </Sidebar>
  );
}
