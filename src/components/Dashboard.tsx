import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLMS } from '@/contexts/LMSContext';
import { Users, List, User, Folder, CheckCircle } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export default function Dashboard() {
  const { groups, users, tasks, announcements, currentUser } = useLMS();

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
    },
    {
      title: 'Estudiantes',
      value: students.length,
      description: 'Estudiantes registrados',
      icon: User,
      color: 'bg-lms-blue-500',
    },
    {
      title: 'Tareas Pendientes',
      value: pendingTasks.length,
      description: 'Tareas por completar',
      icon: List,
      color: 'bg-orange-500',
    },
    {
      title: 'Profesores',
      value: teachers.length,
      description: 'Docentes activos',
      icon: Folder,
      color: 'bg-green-500',
    },
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      {currentUser && (
        <Card className="bg-gradient-to-r from-primary/10 to-card animate-fade-in">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">¡Bienvenido, {currentUser.name}!</h1>
              <p className="text-muted-foreground">Aquí tienes un resumen de tu actividad reciente.</p>
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

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow duration-200 animate-scale-in" style={{animationDelay: `${index * 100}ms`}}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-full ${stat.color} text-white`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Groups */}
        <Card className="animate-fade-in" style={{animationDelay: '400ms'}}>
          <CardHeader>
            <CardTitle>Grupos Recientes</CardTitle>
            <CardDescription>Últimos grupos creados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {groups.slice(0, 3).map((group) => (
                <div key={group.id} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                  <div>
                    <p className="font-medium">{group.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {group.specialty} - {group.shift}
                    </p>
                  </div>
                  <Badge variant="secondary">
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

        {/* Recent Announcements */}
        <Card className="animate-fade-in" style={{animationDelay: '500ms'}}>
          <CardHeader>
            <CardTitle>Anuncios Recientes</CardTitle>
            <CardDescription>Últimas notificaciones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAnnouncements.map((announcement) => (
                <div key={announcement.id} className="p-3 bg-accent/50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">{announcement.title}</h4>
                    <Badge 
                      variant={announcement.priority === 'high' ? 'destructive' : 'secondary'}
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
        
        {/* Pending Tasks */}
        <Card className="animate-fade-in" style={{animationDelay: '600ms'}}>
          <CardHeader>
            <CardTitle>Tareas Pendientes</CardTitle>
            <CardDescription>Tus próximas entregas</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
              {pendingTasks.slice(0, 3).map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Vence: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-orange-500 border-orange-500">
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
    </div>
  );
}
