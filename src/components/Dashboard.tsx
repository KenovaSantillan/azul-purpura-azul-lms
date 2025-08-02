
import React from 'react';
import { useUser } from '@/contexts/UserContext';
import AdminDashboard from './dashboards/AdminDashboard';
import TeacherDashboard from './dashboards/TeacherDashboard';
import StudentDashboard from './dashboards/StudentDashboard';

export default function Dashboard() {
  const { currentUser } = useUser();

  if (!currentUser) {
    return (
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  // Render role-specific dashboard
  switch (currentUser.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'teacher':
      return <TeacherDashboard />;
    case 'student':
      return <StudentDashboard />;
    case 'tutor':
      // Tutors see the same dashboard as students for now
      return <StudentDashboard />;
    case 'parent':
      // Parents see the same dashboard as students for now  
      return <StudentDashboard />;
    default:
      return <AdminDashboard />;
  }
}
