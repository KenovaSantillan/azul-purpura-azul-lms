
import React from 'react';
import { Users, User, Folder, List, User as UserIcon, Circle, Settings, BookOpen } from 'lucide-react';
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
import { useUser } from '@/contexts/UserContext';
import { UserRole } from '@/types/lms';

const menuConfig: {
  title: string;
  items: {
    title: string;
    url: string;
    icon: React.ElementType;
    roles: UserRole[];
  }[];
}[] = [
  {
    title: 'Principal',
    items: [
      { title: 'Dashboard', url: '#dashboard', icon: Circle, roles: ['admin', 'teacher', 'student', 'tutor', 'parent'] },
      { title: 'Grupos', url: '#groups', icon: Users, roles: ['admin', 'teacher'] },
      { title: 'Estudiantes', url: '#students', icon: User, roles: ['admin', 'teacher'] },
      { title: 'Tareas', url: '#tasks', icon: List, roles: ['admin', 'teacher', 'student'] },
      { title: 'Tablón', url: '#announcements', icon: Folder, roles: ['admin', 'teacher', 'student', 'tutor', 'parent'] },
      { title: 'Progreso', url: '#progress', icon: UserIcon, roles: ['admin', 'teacher', 'student'] },
    ],
  },
  {
    title: 'Configuración',
    items: [
      { title: 'Personalización', url: '#customization', icon: Settings, roles: ['admin', 'teacher', 'student', 'tutor', 'parent'] },
    ],
  },
  {
    title: 'Recursos',
    items: [
      { title: 'Biblioteca', url: '#library', icon: BookOpen, roles: ['admin', 'teacher', 'student', 'tutor', 'parent'] },
    ]
  },
];


interface AppSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function AppSidebar({ activeSection, onSectionChange }: AppSidebarProps) {
  const { theme, toggleTheme } = useTheme();
  const { currentUser } = useUser();

  const menuGroups = !currentUser ? [] : menuConfig
    .map(group => ({
      ...group,
      items: group.items.filter(item => item.roles.includes(currentUser.role)),
    }))
    .filter(group => group.items.length > 0);

  const adminMenuItems = [
    { title: 'Gestión de Usuarios', url: '#admin/users', icon: Users },
  ];

  return (
    <Sidebar className="animate-slide-in-right">
      <SidebarContent>
        {menuGroups.map((group, index) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="text-lg font-bold text-primary mb-2 px-2 pt-2">
              {index === 0 ? '🎓 Portal Kenova' : group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
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
        ))}
        {currentUser?.role === 'admin' && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-lg font-bold text-primary mb-2 px-2 pt-2">
              Administración
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminMenuItems.map((item) => (
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
        )}
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
