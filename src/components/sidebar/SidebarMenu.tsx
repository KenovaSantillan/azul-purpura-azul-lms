
import React from 'react';
import { Users, User, Folder, List, User as UserIcon, Circle, Settings, BookOpen, Shield } from 'lucide-react';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
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
  {
    title: 'Legalmente',
    items: [
      { title: 'Avisos Legales', url: '#legal', icon: Shield, roles: ['admin', 'teacher', 'student', 'tutor', 'parent'] },
    ]
  }
];

interface SidebarMenuProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  currentUserRole: UserRole;
}

const AppSidebarMenu = ({ activeSection, onSectionChange, currentUserRole }: SidebarMenuProps) => {
  const menuGroups = menuConfig
    .map(group => ({
      ...group,
      items: group.items.filter(item => item.roles.includes(currentUserRole)),
    }))
    .filter(group => group.items.length > 0);

  return (
    <>
      {menuGroups.map((group, index) => (
        <SidebarGroup key={group.title}>
          <SidebarGroupLabel className="text-lg font-bold text-sidebar-foreground mb-2 px-2 pt-2">
            {index === 0 ? (
              <div className="flex items-center justify-center py-2">
                <img 
                  src="/lovable-uploads/c25f0b68-5713-4917-bcfb-9b936b589f47.png" 
                  alt="Portal Kenova" 
                  className="h-8 w-auto object-contain"
                />
              </div>
            ) : (
              <span className="text-sidebar-foreground font-semibold">{group.title}</span>
            )}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={activeSection === item.url.replace('#', '')}
                    className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors duration-200 data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
                  >
                    <button
                      onClick={() => onSectionChange(item.url.replace('#', ''))}
                      className="w-full flex items-center gap-3 p-3 rounded-lg group text-sidebar-foreground hover:text-sidebar-accent-foreground"
                    >
                      <item.icon className="h-5 w-5 transition-transform duration-300 ease-in-out group-hover:scale-110 text-current" />
                      <span className="transition-transform duration-300 ease-in-out group-hover:translate-x-1 text-current">{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
};

export default AppSidebarMenu;
