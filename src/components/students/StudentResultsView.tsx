
import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { User, Group } from '@/types/lms';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLMS } from '@/contexts/LMSContext';
import { Badge } from '@/components/ui/badge';

interface StudentResultsViewProps {
  student: User;
  group: Group;
  onBack: () => void;
}

const StudentResultsView = ({ student, group, onBack }: StudentResultsViewProps) => {
  const { getStudentProgress, tasks, taskSubmissions } = useLMS();
  
  const progress = getStudentProgress(student.id, group.id);

  const studentSubmissions = useMemo(() => 
    taskSubmissions.filter(sub => sub.studentId === student.id),
    [taskSubmissions, student.id]
  );

  const averageGrade = progress?.grade ?? 0;

  const recentGrades = useMemo(() => studentSubmissions
    .map(sub => {
      const task = tasks.find(t => t.id === sub.taskId);
      return {
        task: task?.title ?? 'Tarea desconocida',
        grade: sub.total_score,
        submittedAt: sub.submittedAt,
      };
    })
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 3),
    [studentSubmissions, tasks]
  );
  
  const completionPercentage = useMemo(() => progress && progress.totalTasks > 0
    ? Math.round((progress.completedTasks / progress.totalTasks) * 100)
    : 0,
    [progress]
  );

  return (
    <div className="p-6 animate-fade-in space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Resultados del Estudiante</h1>
          <p className="text-muted-foreground">Detalles del progreso de {student.name}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={student.avatar} alt={student.name} />
                <AvatarFallback>{student.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{student.name}</CardTitle>
                <CardDescription>{student.email}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>Grupo:</strong> {group.name}</p>
                <p><strong>ID de Estudiante:</strong> {student.id}</p>
                <p><strong>Estado:</strong> <Badge variant={student.status === 'active' ? 'default' : 'destructive'}>{student.status === 'active' ? 'Activo' : 'Inactivo'}</Badge></p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Resumen de Progreso</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-muted rounded-lg text-center">
                <p className="text-2xl font-bold">{completionPercentage}%</p>
                <p className="text-sm text-muted-foreground">Completado</p>
              </div>
              <div className="p-4 bg-muted rounded-lg text-center">
                <p className="text-2xl font-bold">{averageGrade}</p>
                <p className="text-sm text-muted-foreground">Promedio</p>
              </div>
              <div className="p-4 bg-muted rounded-lg text-center">
                <p className="text-2xl font-bold">{progress?.completedTasks ?? 0}</p>
                <p className="text-sm text-muted-foreground">Tareas Completas</p>
              </div>
              <div className="p-4 bg-muted rounded-lg text-center">
                <p className="text-2xl font-bold">{progress?.totalTasks ?? 0}</p>
                <p className="text-sm text-muted-foreground">Tareas Totales</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Calificaciones Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              {recentGrades.length > 0 ? (
                <ul className="space-y-2">
                  {recentGrades.map((grade, index) => (
                    <li key={index} className="flex justify-between items-center p-2 rounded-md hover:bg-muted">
                      <span>{grade.task}</span>
                      <span className="font-semibold">{typeof grade.grade === 'number' ? `${grade.grade}/100` : 'Sin calificar'}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No hay calificaciones recientes.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default React.memo(StudentResultsView);
