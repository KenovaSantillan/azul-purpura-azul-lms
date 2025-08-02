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
import { BookOpen, Calendar, CheckCircle, Clock, AlertCircle, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function StudentDashboard() {
  const { groups, tasks, announcements } = useLMS();
  const { currentUser } = useUser();
  const { isIntersecting: showStats, elementRef: statsRef } = useLazyLoading({ threshold: 0.1, once: true });
  const { prefetchData } = useOptimizedCache();

  // Find student's group
  const studentGroup = groups.find(group => 
    group.students.some(student => student.id === currentUser?.id)
  );

  // Filter tasks assigned to the student
  const studentTasks = tasks.filter(task => 
    task.assignedTo.includes(currentUser?.id || '')
  );

  const pendingTasks = studentTasks.filter(task => task.status === 'pending');
  const completedTasks = studentTasks.filter(task => task.status === 'completed');
  const submittedTasks = studentTasks.filter(task => task.status === 'submitted');
  const gradedTasks = studentTasks.filter(task => task.status === 'graded');

  // Calculate progress
  const totalTasks = studentTasks.length;
  const completionRate = totalTasks > 0 ? ((completedTasks.length + submittedTasks.length + gradedTasks.length) / totalTasks) * 100 : 0;

  // Get upcoming deadlines
  const upcomingDeadlines = studentTasks
    .filter(task => task.dueDate && new Date(task.dueDate) > new Date())
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
    .slice(0, 5);

  const handleSectionHover = (section: string) => {
    switch (section) {
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

      {/* Student Statistics Cards */}
      <div ref={statsRef}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tareas Totales</CardTitle>
              <BookOpen className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{totalTasks}</div>
              <p className="text-xs text-muted-foreground">
                Asignadas este periodo
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
              <Clock className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">{pendingTasks.length}</div>
              <p className="text-xs text-muted-foreground">
                Por entregar
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Entregadas</CardTitle>
              <CheckCircle className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{submittedTasks.length}</div>
              <p className="text-xs text-muted-foreground">
                Esperando calificación
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Calificadas</CardTitle>
              <Trophy className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{gradedTasks.length}</div>
              <p className="text-xs text-muted-foreground">
                Con retroalimentación
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Mi Progreso Académico
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Progreso General</span>
              <span className="text-sm text-muted-foreground">{Math.round(completionRate)}%</span>
            </div>
            <Progress value={completionRate} className="h-2" />
            
            {studentGroup && (
              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Mi Grupo</p>
                    <p className="text-sm text-muted-foreground">
                      {studentGroup.name} - {studentGroup.grade}° {studentGroup.letter}
                    </p>
                    <p className="text-xs text-primary font-medium">
                      {studentGroup.specialty} ({studentGroup.shift})
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {studentGroup.students.length} estudiantes
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Student Specific Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Próximas Entregas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingDeadlines.length > 0 ? (
              <div className="space-y-3">
                {upcomingDeadlines.map((task) => {
                  const daysLeft = Math.ceil(
                    (new Date(task.dueDate!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                  );
                  return (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">{task.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Vence: {new Date(task.dueDate!).toLocaleDateString()}
                        </p>
                        <Badge 
                          variant={daysLeft <= 2 ? "destructive" : daysLeft <= 7 ? "secondary" : "outline"}
                          className="text-xs"
                        >
                          {daysLeft === 0 ? 'Hoy' : daysLeft === 1 ? 'Mañana' : `${daysLeft} días`}
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm">
                        Ver Tarea
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No hay entregas próximas
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Grades */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Calificaciones Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {gradedTasks.length > 0 ? (
              <div className="space-y-3">
                {gradedTasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Entregada: {new Date(task.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">
                        {task.max_score ? `${task.max_score}/10` : 'Calificada'}
                      </Badge>
                    </div>
                  </div>
                ))}
                {gradedTasks.length > 5 && (
                  <p className="text-sm text-muted-foreground text-center">
                    Y {gradedTasks.length - 5} más...
                  </p>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No hay calificaciones disponibles
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
              <span>Ver Tareas</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <CheckCircle className="h-6 w-6" />
              <span>Mi Progreso</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Trophy className="h-6 w-6" />
              <span>Calificaciones</span>
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