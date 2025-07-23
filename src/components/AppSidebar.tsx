
import React from 'react';
import { Sidebar, SidebarContent } from '@/components/ui/sidebar';
import { useUser } from '@/contexts/UserContext';
import AppSidebarMenu from './sidebar/SidebarMenu';
import AdminMenu from './sidebar/AdminMenu';
import AppSidebarFooter from './sidebar/SidebarFooter';
import SidebarLoading from './sidebar/SidebarLoading';

interface AppSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function AppSidebar({ activeSection, onSectionChange }: AppSidebarProps) {
  const { currentUser, loadingCurrentUser } = useUser();

  if (loadingCurrentUser) {
    return <SidebarLoading />;
  }

  if (!currentUser) {
    return null;
  }

  return (
    <Sidebar className="animate-slide-in-right">
      <SidebarContent>
        <AppSidebarMenu 
          activeSection={activeSection}
          onSectionChange={onSectionChange}
          currentUserRole={currentUser.role}
        />
        {(currentUser.role === 'admin' || currentUser.role === 'superadmin') && (
          <AdminMenu 
            activeSection={activeSection}
            onSectionChange={onSectionChange}
          />
        )}
      </SidebarContent>
      <AppSidebarFooter />
    </Sidebar>
  );
}
