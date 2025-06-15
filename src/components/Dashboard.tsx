
import React from 'react';
import { useLMS } from '@/contexts/LMSContext';
import { useUser } from '@/contexts/UserContext';
import { useLazyLoading, useViewportLazyLoading } from '@/hooks/useLazyLoading';
import { useOptimizedCache } from '@/hooks/useOptimizedCache';
import NotificationCenter from './notifications/NotificationCenter';
import Breadcrumbs from './navigation/Breadcrumbs';
import WelcomeBanner from './dashboard/WelcomeBanner';
import StatsCards from './dashboard/StatsCards';
import RecentGroups from './dashboard/RecentGroups';
import RecentAnnouncements from './dashboard/RecentAnnouncements';
import PendingTasks from './dashboard/PendingTasks';
import AnalyticsSection from './dashboard/AnalyticsSection';

export default function Dashboard() {
  const { groups, tasks, announcements } = useLMS();
  const { users, currentUser } = useUser();
  const { isIntersecting: showAnalytics, elementRef: analyticsRef } = useViewportLazyLoading(0.2);
  const { isIntersecting: showStats, elementRef: statsRef } = useLazyLoading({ threshold: 0.1, once: true });
  const { prefetchData } = useOptimizedCache();

  const handleSectionHover = (section: string) => {
    switch (section) {
      case 'groups':
        prefetchData(['groups'], async () => groups);
        break;
      case 'tasks':
        prefetchData(['tasks'], async () => tasks);
        break;
      case 'announcements':
        prefetchData(['announcements'], async () => announcements);
        break;
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Navigation and Notifications */}
      <div className="flex items-center justify-between">
        <Breadcrumbs showHome={false} maxItems={4} />
        <NotificationCenter />
      </div>

      {/* Welcome Banner */}
      {currentUser && <WelcomeBanner currentUser={currentUser} />}

      {/* Statistics Cards */}
      <div ref={statsRef}>
        <StatsCards 
          groups={groups}
          tasks={tasks}
          users={users}
          isVisible={showStats}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentGroups 
          groups={groups}
          onHover={() => handleSectionHover('groups')}
        />
        <RecentAnnouncements 
          announcements={announcements}
          onHover={() => handleSectionHover('announcements')}
        />
        <PendingTasks 
          tasks={tasks}
          onHover={() => handleSectionHover('tasks')}
        />
      </div>

      {/* Analytics Section */}
      <div ref={analyticsRef}>
        <AnalyticsSection isVisible={showAnalytics} />
      </div>
    </div>
  );
}
