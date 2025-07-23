import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';

const SuperAdminDashboard = () => {
  const { currentUser, setActiveView } = useUser();

  const switchToTeacherView = () => {
    setActiveView('teacher');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Dashboard de Superadministrador</h1>
        <p className="text-muted-foreground mt-1">Bienvenido, {currentUser?.name}.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Cambiar de Vista</CardTitle>
          <CardDescription>
            Cambia a la vista de docente para ver tus grupos y actividades.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={switchToTeacherView}>
            Cambiar a vista de Docente
          </Button>
        </CardContent>
      </Card>

      {/* Aquí se pueden añadir más tarjetas y componentes para el dashboard de superadmin */}
    </div>
  );
};

export default SuperAdminDashboard;
