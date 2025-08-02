import React from 'react';
import { useLMS } from '@/contexts/LMSContext';
import { useUser } from '@/contexts/UserContext';
import { useLazyLoading } from '@/hooks/useLazyLoading';
import { useOptimizedCache } from '@/hooks/useOptimizedCache';
import NotificationCenter from '../notifications/NotificationCenter';
import Breadcrumbs from '../navigation/Breadcrumbs';
import WelcomeBanner from '../dashboard/WelcomeBanner';
import RecentAnnouncements from '../dashboard/RecentAnnouncements';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, CheckCircle, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TeacherDashboard() {
  const { groups, tasks, announcements } = useLMS();
  const { users, currentUser } = useUser();
  const { isIntersecting: showStats, elementRef: statsRef } = useLazyLoading({ threshold: 0.1, once: true });
  const { prefetchData } = useOptimizedCache();

  // Filter data relevant to the teacher
  const teacherGroups = groups.filter(group => group.teacherId === currentUser?.id);
  const teacherTasks = tasks.filter(task => task.createdBy === currentUser?.id);
  const pendingTasks = teacherTasks.filter(task => task.status === 'pending');
  const completedTasks = teacherTasks.filter(task => task.status === 'completed');
  
  // Get students in teacher's groups
  const teacherStudents = teacherGroups.reduce((acc, group) => {
    return acc + group.students.length;
  }, 0);

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

      {/* Teacher Statistics Cards */}
      <div ref={statsRef}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mis Grupos</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{teacherGroups.length}</div>
              <p className="text-xs text-muted-foreground">
                Grupos asignados
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estudiantes</CardTitle>
              <BookOpen className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">{teacherStudents}</div>
              <p className="text-xs text-muted-foreground">
                Total en mis grupos
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tareas Pendientes</CardTitle>
              <Clock className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{pendingTasks.length}</div>
              <p className="text-xs text-muted-foreground">
                Por revisar
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tareas Completadas</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{completedTasks.length}</div>
              <p className="text-xs text-muted-foreground">
                Este periodo
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Teacher Specific Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Groups */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Mis Grupos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {teacherGroups.length > 0 ? (
              <div className="space-y-3">
                {teacherGroups.slice(0, 5).map((group) => (
                  <div key={group.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">{group.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {group.grade}° {group.letter} - {group.specialty}
                      </p>
                      <p className="text-xs text-primary font-medium">
                        {group.students.length} estudiantes
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Ver Grupo
                    </Button>
                  </div>
                ))}
                {teacherGroups.length > 5 && (
                  <p className="text-sm text-muted-foreground text-center">
                    Y {teacherGroups.length - 5} más...
                  </p>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No tienes grupos asignados
              </p>
            )}
          </CardContent>
        </Card>

        {/* Pending Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Tareas por Revisar
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingTasks.length > 0 ? (
              <div className="space-y-3">
                {pendingTasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Sin fecha límite'}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Revisar
                    </Button>
                  </div>
                ))}
                {pendingTasks.length > 5 && (
                  <p className="text-sm text-muted-foreground text-center">
                    Y {pendingTasks.length - 5} más...
                  </p>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No hay tareas pendientes de revisión
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Acciones Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <BookOpen className="h-6 w-6" />
              <span>Crear Tarea</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Users className="h-6 w-6" />
              <span>Gestionar Grupos</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <CheckCircle className="h-6 w-6" />
              <span>Revisar Entregas</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Announcements */}
      <div className="grid grid-cols-1 gap-6">
        <RecentAnnouncements 
          announcements={announcements}
          onHover={() => handleSectionHover('announcements')}
        />
      </div>
    </div>
  );
}