import React from 'react';
import { useLMS } from '@/contexts/LMSContext';
import { useUser } from '@/contexts/UserContext';
import { useLazyLoading, useViewportLazyLoading } from '@/hooks/useLazyLoading';
import { useOptimizedCache } from '@/hooks/useOptimizedCache';
import NotificationCenter from '../notifications/NotificationCenter';
import Breadcrumbs from '../navigation/Breadcrumbs';
import WelcomeBanner from '../dashboard/WelcomeBanner';
import StatsCards from '../dashboard/StatsCards';
import RecentGroups from '../dashboard/RecentGroups';
import RecentAnnouncements from '../dashboard/RecentAnnouncements';
import PendingTasks from '../dashboard/PendingTasks';
import AnalyticsSection from '../dashboard/AnalyticsSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Shield, Activity, Settings } from 'lucide-react';

export default function AdminDashboard() {
  const { groups, tasks, announcements } = useLMS();
  const { users, currentUser } = useUser();
  const { isIntersecting: showAnalytics, elementRef: analyticsRef } = useViewportLazyLoading(0.2);
  const { isIntersecting: showStats, elementRef: statsRef } = useLazyLoading({ threshold: 0.1, once: true });
  const { prefetchData } = useOptimizedCache();

  const pendingUsers = users.filter(user => user.status === 'pending');
  const totalActiveUsers = users.filter(user => user.status === 'active').length;
  const totalGroups = groups.length;
  const totalTasks = tasks.length;

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

      {/* Admin Statistics Cards */}
      <div ref={statsRef}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card variant="neomorphic" className="bg-gradient-to-br from-primary/5 to-primary/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuarios Pendientes</CardTitle>
              <div className="neomorphic-subtle rounded-full p-2">
                <Users className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{pendingUsers.length}</div>
              <p className="text-xs text-muted-foreground">
                Requieren aprobación
              </p>
            </CardContent>
          </Card>

          <Card variant="neomorphic" className="bg-gradient-to-br from-secondary/5 to-secondary/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
              <div className="neomorphic-subtle rounded-full p-2">
                <Shield className="h-4 w-4 text-secondary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">{totalActiveUsers}</div>
              <p className="text-xs text-muted-foreground">
                En el sistema
              </p>
            </CardContent>
          </Card>

          <Card variant="neomorphic" className="bg-gradient-to-br from-accent/5 to-accent/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Grupos</CardTitle>
              <div className="neomorphic-subtle rounded-full p-2">
                <Activity className="h-4 w-4 text-accent" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{totalGroups}</div>
              <p className="text-xs text-muted-foreground">
                Grupos creados
              </p>
            </CardContent>
          </Card>

          <Card variant="neomorphic" className="bg-gradient-to-br from-destructive/5 to-destructive/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tareas</CardTitle>
              <div className="neomorphic-subtle rounded-full p-2">
                <Settings className="h-4 w-4 text-destructive" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{totalTasks}</div>
              <p className="text-xs text-muted-foreground">
                En el sistema
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Admin Specific Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Approvals */}
        <Card variant="neomorphic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="neomorphic-subtle rounded-full p-2">
                <Users className="h-5 w-5 text-primary" />
              </div>
              Usuarios Pendientes de Aprobación
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingUsers.length > 0 ? (
              <div className="space-y-3">
                {pendingUsers.slice(0, 5).map((user) => (
                  <div key={user.id} className="neomorphic-subtle p-3 rounded-lg">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <p className="text-xs text-primary font-medium">{user.role}</p>
                    </div>
                  </div>
                ))}
                {pendingUsers.length > 5 && (
                  <p className="text-sm text-muted-foreground text-center">
                    Y {pendingUsers.length - 5} más...
                  </p>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No hay usuarios pendientes de aprobación
              </p>
            )}
          </CardContent>
        </Card>

        {/* System Overview */}
        <Card variant="neomorphic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="neomorphic-subtle rounded-full p-2">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              Resumen del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Docentes</span>
                <span className="text-sm text-muted-foreground">
                  {users.filter(u => u.role === 'teacher').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Estudiantes</span>
                <span className="text-sm text-muted-foreground">
                  {users.filter(u => u.role === 'student').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Tutores</span>
                <span className="text-sm text-muted-foreground">
                  {users.filter(u => u.role === 'tutor').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Padres</span>
                <span className="text-sm text-muted-foreground">
                  {users.filter(u => u.role === 'parent').length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
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