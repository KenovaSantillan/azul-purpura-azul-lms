
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLMS } from '@/contexts/LMSContext';
import { useUser } from '@/contexts/UserContext';
import { Users, List, User, Folder, CheckCircle, TrendingUp, BarChart3, Calendar } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import NotificationCenter from './notifications/NotificationCenter';
import Breadcrumbs from './navigation/Breadcrumbs';
import AnalyticsDashboard from './analytics/AnalyticsDashboard';
import { useLazyLoading, useViewportLazyLoading } from '@/hooks/useLazyLoading';
import { useOptimizedCache } from '@/hooks/useOptimizedCache';

export default function Dashboard() {
  const { groups, tasks, announcements } = useLMS();
  const { users, currentUser } = useUser();
  const { isIntersecting: showAnalytics, elementRef: analyticsRef } = useViewportLazyLoading(0.2);
  const { isIntersecting: showStats, elementRef: statsRef } = useLazyLoading({ threshold: 0.1, once: true });
  const { prefetchData } = useOptimizedCache();

  // Prefetch related data when user hovers over sections
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

  const getInitials = (name: string) => {
    if (!name) return "";
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };
  
  const students = users.filter(u => u.role === 'student');
  const teachers = users.filter(u => u.role === 'teacher');
  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const recentAnnouncements = announcements.slice(0, 3);

  const stats = [
    {
      title: 'Total Grupos',
      value: groups.length,
      description: 'Grupos activos',
      icon: Users,
      color: 'bg-lms-purple-500',
      trend: '+12%',
    },
    {
      title: 'Estudiantes',
      value: students.length,
      description: 'Estudiantes registrados',
      icon: User,
      color: 'bg-lms-blue-500',
      trend: '+8%',
    },
    {
      title: 'Tareas Pendientes',
      value: pendingTasks.length,
      description: 'Tareas por completar',
      icon: List,
      color: 'bg-orange-500',
      trend: '-3%',
    },
    {
      title: 'Profesores',
      value: teachers.length,
      description: 'Docentes activos',
      icon: Folder,
      color: 'bg-green-500',
      trend: '+5%',
    },
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Navigation and Notifications */}
      <div className="flex items-center justify-between">
        <Breadcrumbs showHome={false} maxItems={4} />
        <NotificationCenter />
      </div>

      {/* Welcome Banner */}
      {currentUser && (
        <Card className="bg-gradient-to-r from-primary/10 to-card animate-fade-in">
          <CardContent className="p-6 flex flex-col sm:flex-row items-center sm:justify-between text-center sm:text-left gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">¡Bienvenido, {currentUser.name}!</h1>
              <p className="text-muted-foreground">Aquí tienes un resumen de tu actividad reciente y métricas importantes.</p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  Ver Calendario
                </Button>
                <Button size="sm" variant="outline">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Reportes
                </Button>
              </div>
            </div>
            <Avatar className="h-16 w-16 border-2 border-primary">
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback className="text-2xl bg-primary/20">
                {getInitials(currentUser.name)}
              </AvatarFallback>
            </Avatar>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Statistics Cards - Lazy Loaded */}
      <div ref={statsRef}>
        {showStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={stat.title} className="hover:shadow-lg transition-all duration-300 hover:scale-105 animate-scale-in" style={{animationDelay: `${index * 100}ms`}}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <div className={`p-2 rounded-full ${stat.color} text-white`}>
                    <stat.icon className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-muted-foreground">{stat.description}</p>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-green-500 font-medium">{stat.trend}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity - Enhanced */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Groups */}
        <Card 
          className="animate-fade-in hover:shadow-md transition-shadow" 
          style={{animationDelay: '400ms'}}
          onMouseEnter={() => handleSectionHover('groups')}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Grupos Recientes
            </CardTitle>
            <CardDescription>Últimos grupos creados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {groups.slice(0, 3).map((group) => (
                <div key={group.id} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg hover:bg-accent/70 transition-colors">
                  <div>
                    <p className="font-medium">{group.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {group.specialty} - {group.shift}
                    </p>
                  </div>
                  <Badge variant="secondary" className="shrink-0">
                    {group.students.length} estudiantes
                  </Badge>
                </div>
              ))}
              {groups.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No hay grupos recientes.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Announcements - Enhanced */}
        <Card 
          className="animate-fade-in hover:shadow-md transition-shadow" 
          style={{animationDelay: '500ms'}}
          onMouseEnter={() => handleSectionHover('announcements')}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <List className="h-5 w-5" />
              Anuncios Recientes
            </CardTitle>
            <CardDescription>Últimas notificaciones importantes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAnnouncements.map((announcement) => (
                <div key={announcement.id} className="p-3 bg-accent/50 rounded-lg hover:bg-accent/70 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium line-clamp-1">{announcement.title}</h4>
                    <Badge 
                      variant={announcement.priority === 'high' ? 'destructive' : announcement.priority === 'medium' ? 'default' : 'secondary'}
                      className="shrink-0 ml-2"
                    >
                      {announcement.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {announcement.content}
                  </p>
                </div>
              ))}
              {recentAnnouncements.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No hay anuncios recientes.</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Pending Tasks - Enhanced */}
        <Card 
          className="animate-fade-in hover:shadow-md transition-shadow" 
          style={{animationDelay: '600ms'}}
          onMouseEnter={() => handleSectionHover('tasks')}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Tareas Pendientes
            </CardTitle>
            <CardDescription>Tus próximas entregas</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
              {pendingTasks.slice(0, 3).map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg hover:bg-accent/70 transition-colors">
                  <div className="flex-1">
                    <p className="font-medium line-clamp-1">{task.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Vence: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-orange-500 border-orange-500 shrink-0">
                    Pendiente
                  </Badge>
                </div>
              ))}
              {pendingTasks.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                    <CheckCircle className="mx-auto h-8 w-8 mb-2 text-green-500" />
                    <p>¡Felicidades!</p>
                    <p className="text-sm">No tienes tareas pendientes.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Section - Lazy Loaded */}
      <div ref={analyticsRef}>
        {showAnalytics && (
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Analytics del Portal
              </CardTitle>
              <CardDescription>
                Métricas detalladas y estadísticas del sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnalyticsDashboard />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
