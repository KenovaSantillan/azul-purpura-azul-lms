
import React from 'react';
import { Users } from 'lucide-react';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const adminMenuItems = [
  { title: 'Gestión de Usuarios', url: '#admin/users', icon: Users },
];

interface AdminMenuProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const AdminMenu = ({ activeSection, onSectionChange }: AdminMenuProps) => {
  return (
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
                  className="w-full flex items-center gap-3 p-3 rounded-lg group"
                >
                  <item.icon className="h-5 w-5 transition-transform duration-300 ease-in-out group-hover:scale-110" />
                  <span className="transition-transform duration-300 ease-in-out group-hover:translate-x-1">{item.title}</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default AdminMenu;
