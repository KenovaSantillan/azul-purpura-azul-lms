
import React, { useState, useMemo, useEffect } from 'react';
import { Task } from '@/types/lms';
import { useLMS } from '@/contexts/LMSContext';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface GradeTaskDialogProps {
  task: Task;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const GradeTaskDialog: React.FC<GradeTaskDialogProps> = ({ task, isOpen, onOpenChange }) => {
  const { users } = useUser();
  const { addTaskSubmission, updateTaskSubmission, taskSubmissions } = useLMS();
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [maxScore, setMaxScore] = useState(task.max_score || 100);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const assignedStudents = useMemo(() => {
    return users.filter(user => task.assignedTo.includes(user.id) && user.role === 'student');
  }, [users, task.assignedTo]);

  useEffect(() => {
    if(isOpen) {
        setSelectedStudents([]);
        setMaxScore(task.max_score || 100);
    }
  }, [isOpen, task.max_score]);

  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      setSelectedStudents(assignedStudents.map(s => s.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleStudentSelect = (studentId: string, checked: boolean) => {
    setSelectedStudents(prev => 
      checked ? [...prev, studentId] : prev.filter(id => id !== studentId)
    );
  };

  const originalMaxScore = useMemo(() => {
    if (!task.rubric_structured || !Array.isArray(task.rubric_structured)) return 100;
    const total = task.rubric_structured.reduce((sum, criterion) => sum + (criterion.points || 0), 0);
    return total > 0 ? total : 100;
  }, [task.rubric_structured]);

  const handleGrade = async () => {
    setIsLoading(true);

    if (!task.rubric_structured) {
      toast({
        title: 'Error',
        description: 'La tarea no tiene una rúbrica estructurada para la evaluación.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    if (selectedStudents.length === 0) {
      toast({
        title: 'Atención',
        description: 'Debes seleccionar al menos un estudiante para calificar.',
        variant: 'default',
      });
      setIsLoading(false);
      return;
    }

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

    let gradedCount = 0;
    const promises = selectedStudents.map(async (studentId) => {
      try {
        const { data, error } = await supabase.functions.invoke('grade-submission-v2', {
          body: {
            rubric_structured: task.rubric_structured,
            submissionContent: mockSubmissionContent,
          },
        });

        if (error) throw error;
        
        const { total_score: aiScore, feedback, score_details } = data;
        
        const finalScore = Math.round((aiScore / originalMaxScore) * maxScore);

        const existingSubmission = taskSubmissions.find(s => s.taskId === task.id && s.studentId === studentId);
        
        const submissionPayload = {
            total_score: finalScore,
            score_details,
            teacherFeedback: feedback,
            content: mockSubmissionContent,
        };

        if (existingSubmission) {
          updateTaskSubmission(existingSubmission.id, submissionPayload);
        } else {
          addTaskSubmission({
            taskId: task.id,
            studentId,
            ...submissionPayload
          });
        }
        gradedCount++;
      } catch (error: any) {
        const student = users.find(u => u.id === studentId);
        toast({
          title: `Error al evaluar a ${student?.name || 'un estudiante'}`,
          description: error.message || 'Ocurrió un error inesperado.',
          variant: 'destructive',
        });
      }
    });
    
    await Promise.all(promises);

    setIsLoading(false);
    onOpenChange(false);
    toast({
      title: 'Calificación completada',
      description: `Se han calificado ${gradedCount} de ${selectedStudents.length} estudiantes seleccionados.`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Calificar Tarea: {task.title}</DialogTitle>
          <DialogDescription>
            Selecciona los estudiantes a calificar y ajusta la ponderación si es necesario.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Estudiantes</Label>
            <div className="relative max-h-60 overflow-y-auto border p-2 rounded-md space-y-1">
                <div className="flex items-center space-x-2 sticky top-0 bg-background py-1 border-b">
                    <Checkbox
                        id="select-all"
                        onCheckedChange={handleSelectAll}
                        checked={selectedStudents.length > 0 && selectedStudents.length === assignedStudents.length}
                        // @ts-ignore
                        indeterminate={selectedStudents.length > 0 && selectedStudents.length < assignedStudents.length}
                    />
                    <label htmlFor="select-all" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Seleccionar todos
                    </label>
                </div>
                {assignedStudents.map(student => (
                    <div key={student.id} className="flex items-center space-x-2 pl-1">
                        <Checkbox
                            id={`student-${student.id}`}
                            onCheckedChange={(checked) => handleStudentSelect(student.id, !!checked)}
                            checked={selectedStudents.includes(student.id)}
                        />
                        <label htmlFor={`student-${student.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {student.name}
                        </label>
                    </div>
                ))}
                {assignedStudents.length === 0 && <p className='text-sm text-muted-foreground p-2 text-center'>No hay estudiantes asignados a esta tarea.</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="max-score">Ponderación (Puntaje Máximo)</Label>
            <Input
              id="max-score"
              type="number"
              value={maxScore}
              onChange={(e) => setMaxScore(Number(e.target.value))}
              placeholder="Ej. 100"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>Cancelar</Button>
          <Button onClick={handleGrade} disabled={isLoading || selectedStudents.length === 0}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Calificar {selectedStudents.length > 0 ? `(${selectedStudents.length})` : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
