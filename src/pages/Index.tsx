
import React, { useState, Suspense, lazy } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Button } from '@/components/ui/button';
import { Brain } from 'lucide-react';
import { UserNav } from '@/components/UserNav';
import { PageLoader } from '@/components/PageLoader';

const Dashboard = lazy(() => import('@/components/Dashboard'));
const GroupsManager = lazy(() => import('@/components/GroupsManager'));
const VirtualClassroom = lazy(() => import('@/components/sections/VirtualClassroom'));
const StudentManagement = lazy(() => import('@/components/sections/StudentManagement'));
const TaskManagement = lazy(() => import('@/components/sections/TaskManagement'));
const Announcements = lazy(() => import('@/components/sections/Announcements'));
const ProgressTracking = lazy(() => import('@/components/sections/ProgressTracking'));
const ThemeCustomizerSection = lazy(() => import('@/components/ThemeCustomizer').then(m => ({ default: m.ThemeCustomizer })));
const Library = lazy(() => Promise.resolve({ default: () => <div className="p-6"><h1>Biblioteca de Recursos</h1><p>Próximamente disponible.</p></div> }));


const Index = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'groups':
        return <GroupsManager />;
      case 'aula-virtual':
        return <VirtualClassroom />;
      case 'students':
        return <StudentManagement />;
      case 'tasks':
        return <TaskManagement />;
      case 'announcements':
        return <Announcements />;
      case 'progress':
        return <ProgressTracking />;
      case 'customization':
        return <ThemeCustomizerSection />;
      case 'library':
        return <Library />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        <main className="flex-1 flex flex-col">
          {/* Header */}
          <header className="border-b bg-card p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div>
                <h2 className="text-lg font-semibold">Portal Kenova</h2>
                <p className="text-sm text-muted-foreground">Sistema de Gestión Educativa</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => alert('Asistente de IA próximamente')}>
                <Brain className="h-5 w-5" />
              </Button>
              <UserNav />
            </div>
          </header>
          
          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            <Suspense fallback={<PageLoader />}>
              {renderContent()}
            </Suspense>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
