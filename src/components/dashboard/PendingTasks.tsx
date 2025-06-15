
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';
import { Task } from '@/types/lms';

interface PendingTasksProps {
  tasks: Task[];
  onHover: () => void;
}

const PendingTasks = ({ tasks, onHover }: PendingTasksProps) => {
  const pendingTasks = tasks.filter(t => t.status === 'pending');

  return (
    <Card 
      className="animate-fade-in hover:shadow-md transition-shadow" 
      style={{animationDelay: '600ms'}}
      onMouseEnter={onHover}
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
  );
};

export default PendingTasks;
