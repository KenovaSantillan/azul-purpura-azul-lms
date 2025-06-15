
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLMS } from '@/contexts/LMSContext';
import { Users, List, User, Folder } from 'lucide-react';

export function Dashboard() {
  const { groups, users, tasks, announcements } = useLMS();
  
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
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Bienvenido a Portal Kenova</p>
      </div>

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
