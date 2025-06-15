
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, User, List, Folder, TrendingUp } from 'lucide-react';
import { Group, Task, User as UserType } from '@/types/lms';

interface StatsCardsProps {
  groups: Group[];
  tasks: Task[];
  users: UserType[];
  isVisible: boolean;
}

const StatsCards = ({ groups, tasks, users, isVisible }: StatsCardsProps) => {
  const students = users.filter(u => u.role === 'student');
  const teachers = users.filter(u => u.role === 'teacher');
  const pendingTasks = tasks.filter(t => t.status === 'pending');

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

  if (!isVisible) return null;

  return (
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
  );
};

export default StatsCards;
