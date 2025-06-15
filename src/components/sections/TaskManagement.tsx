
import { useState } from 'react';
import { useLMS } from '@/contexts/LMSContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Bot, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const TaskManagement = () => {
  const { tasks } = useLMS();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleGrade = async (taskId: string) => {
    setIsLoading(taskId);
    const task = tasks.find(t => t.id === taskId);

    if (!task || !task.rubric) {
      toast({
        title: 'Error',
        description: 'La tarea no tiene una rúbrica para la evaluación.',
        variant: 'destructive',
      });
      setIsLoading(null);
      return;
    }

    // This is a mock submission for demonstration purposes.
    const mockSubmissionContent = `
      <!DOCTYPE html>
      <html>
      <head><title>Mi Proyecto</title></head>
      <body>
        <header><h1>Mi Página Web</h1></header>
        <p>Este es un proyecto de ejemplo.</p>
        <footer><p>Copyright 2025</p></footer>
      </body>
      </html>
    `;

    try {
      const { data, error } = await supabase.functions.invoke('grade-submission', {
        body: {
          rubric: task.rubric,
          submissionContent: mockSubmissionContent,
        },
      });

      if (error) throw error;
      
      const { score, feedback } = data;

      toast({
        title: `Evaluación para "${task.title}" completada`,
        description: (
          <div className="mt-2 p-2 rounded-md bg-accent">
            <p><strong>Puntuación:</strong> {score}/100</p>
            <p className="mt-1"><strong>Feedback:</strong> {feedback}</p>
          </div>
        ),
        duration: 9000,
      });

    } catch (error: any) {
      toast({
        title: 'Error al evaluar la tarea',
        description: error.message || 'Ocurrió un error inesperado.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(null);
    }
  };

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
            <Button onClick={() => handleGrade(task.id)} disabled={isLoading === task.id || !task.rubric} size="sm">
              {isLoading === task.id ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Bot className="mr-2 h-4 w-4" />
              )}
              Calificar con IA
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskManagement;
