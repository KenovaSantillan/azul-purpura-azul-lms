
import React from 'react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroupLabel } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';

const SidebarLoading = () => {
  return (
    <Sidebar className="animate-slide-in-right">
      <SidebarContent>
        <div className="p-4 space-y-2">
          <SidebarGroupLabel className="text-lg font-bold text-primary mb-2 px-2 pt-2">
            <Skeleton className="h-7 w-48" />
          </SidebarGroupLabel>
          <div className='px-3 space-y-1'>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <div className="p-4 space-y-2">
          <SidebarGroupLabel className="text-lg font-bold text-primary mb-2 px-2 pt-2">
            <Skeleton className="h-7 w-32" />
          </SidebarGroupLabel>
          <div className='px-3 space-y-1'>
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4 space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-4 w-24 mx-auto" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SidebarLoading;
