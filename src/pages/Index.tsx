
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Dashboard } from '@/components/Dashboard';
import { GroupsManager } from '@/components/GroupsManager';
import { ThemeCustomizer } from '@/components/ThemeCustomizer';
import { Button } from '@/components/ui/button';
import { Circle, Mic } from 'lucide-react';

const Index = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'groups':
        return <GroupsManager />;
      case 'aula-virtual':
        return (
          <div className="p-6 animate-fade-in">
            <h1 className="text-3xl font-bold mb-4">Aula Virtual</h1>
            <p className="text-muted-foreground mb-6">Próximamente: Aulas virtuales interactivas para clases en tiempo real.</p>
            <div className="border rounded-lg p-8 text-center bg-accent/20 animate-scale-in">
              <h3 className="text-xl font-semibold">El aula virtual está en construcción</h3>
              <p className="text-muted-foreground mt-2">Pronto podrás interactuar con tus estudiantes y profesores aquí.</p>
            </div>
          </div>
        );
      case 'students':
        return (
          <div className="p-6 animate-fade-in">
            <h1 className="text-3xl font-bold mb-4">Gestión de Estudiantes</h1>
            <p className="text-muted-foreground mb-6">Próximamente: Sistema completo de gestión de estudiantes con drag & drop</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="p-4 border rounded-lg bg-accent/20 animate-scale-in" style={{animationDelay: `${i * 100}ms`}}>
                  <div className="w-12 h-12 bg-primary rounded-full mb-3"></div>
                  <h3 className="font-medium">Estudiante {i + 1}</h3>
                  <p className="text-sm text-muted-foreground">1° A - Programación</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'tasks':
        return (
          <div className="p-6 animate-fade-in">
            <h1 className="text-3xl font-bold mb-4">Gestión de Tareas</h1>
            <p className="text-muted-foreground mb-6">Sistema de asignación de tareas colectivas, grupales e individuales</p>
            <div className="space-y-4">
              {['Proyecto Final HTML/CSS', 'Ejercicios de JavaScript', 'Trabajo en Equipo'].map((task, i) => (
                <div key={i} className="p-4 border rounded-lg bg-accent/20 animate-scale-in" style={{animationDelay: `${i * 100}ms`}}>
                  <h3 className="font-medium">{task}</h3>
                  <p className="text-sm text-muted-foreground">Pendiente • 1° A Programación</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'announcements':
        return (
          <div className="p-6 animate-fade-in">
            <h1 className="text-3xl font-bold mb-4">Tablón de Avisos</h1>
            <p className="text-muted-foreground mb-6">Centro de comunicaciones y anuncios</p>
            <div className="space-y-4">
              {['Bienvenidos al nuevo semestre', 'Horarios de exámenes', 'Actividades extracurriculares'].map((announcement, i) => (
                <div key={i} className="p-4 border rounded-lg bg-accent/20 animate-scale-in" style={{animationDelay: `${i * 100}ms`}}>
                  <h3 className="font-medium">{announcement}</h3>
                  <p className="text-sm text-muted-foreground">Publicado hace 2 días</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'progress':
        return (
          <div className="p-6 animate-fade-in">
            <h1 className="text-3xl font-bold mb-4">Seguimiento de Progreso</h1>
            <p className="text-muted-foreground mb-6">Monitoreo del rendimiento académico por estudiante</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="p-4 border rounded-lg bg-accent/20 animate-scale-in" style={{animationDelay: `${i * 100}ms`}}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">Estudiante {i + 1}</h3>
                    <span className="text-2xl font-bold text-primary">{85 + i * 2}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${85 + i * 2}%`, animationDelay: `${i * 200}ms` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
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
            <div className="flex items-center gap-2">
              <ThemeCustomizer />
              <Button variant="ghost" size="icon" onClick={() => alert('Control por voz próximamente')}>
                <Mic className="h-5 w-5" />
              </Button>
            </div>
          </header>
          
          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
