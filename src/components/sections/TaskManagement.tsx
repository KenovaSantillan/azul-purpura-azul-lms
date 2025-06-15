
import { useState } from 'react';
import { useLMS } from '@/contexts/LMSContext';
import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Task } from '@/types/lms';
import { GradeTaskDialog } from './GradeTaskDialog';

const TaskManagement = () => {
  const { tasks } = useLMS();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  return (
    <div className="p-6 animate-fade-in">
      <h1 className="text-3xl font-bold mb-4">Gestión de Tareas</h1>
      <p className="text-muted-foreground mb-6">Aquí puedes probar la calificación con IA para las tareas que tengan una rúbrica definida.</p>
      <div className="space-y-4">
        {tasks.map((task, i) => (
          <div key={task.id} className="p-4 border rounded-lg bg-card flex justify-between items-center animate-scale-in" style={{animationDelay: `${i * 100}ms`}}>
            <div>
              <h3 className="font-medium">{task.title}</h3>
              <p className="text-sm text-muted-foreground">Pendiente • 1° A Programación</p>
              {task.rubric && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="link" className="p-0 h-auto text-xs mt-1">Ver Rúbrica</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Rúbrica para "{task.title}"</AlertDialogTitle>
                      <AlertDialogDescription asChild>
                         <div className="text-sm text-muted-foreground whitespace-pre-wrap max-h-[60vh] overflow-y-auto p-1">{task.rubric}</div>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cerrar</AlertDialogCancel>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
            <Button onClick={() => setSelectedTask(task)} disabled={!task.rubric_structured} size="sm">
              <Bot className="mr-2 h-4 w-4" />
              Calificar con IA
            </Button>
          </div>
        ))}
      </div>
      {selectedTask && (
        <GradeTaskDialog
          task={selectedTask}
          isOpen={!!selectedTask}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setSelectedTask(null);
            }
          }}
        />
      )}
    </div>
  );
};

export default TaskManagement;
