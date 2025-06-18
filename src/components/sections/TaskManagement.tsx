
import { useState } from 'react';
import { useLMS } from '@/contexts/LMSContext';
import { Button } from '@/components/ui/button';
import { Bot, ArrowLeft } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
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
import { useUser } from '@/contexts/UserContext';

const TaskManagement = () => {
  const { tasks, groups } = useLMS();
  const { currentUser } = useUser();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');

  const canUseAIGrading = currentUser?.role === 'teacher' && (currentUser.ai_grading_enabled ?? true);

  // Filtrar tareas por grupo seleccionado
  const filteredTasks = selectedGroupId 
    ? tasks.filter(task => task.groupId === selectedGroupId)
    : tasks;

  const selectedGroup = groups.find(g => g.id === selectedGroupId);

  return (
    <div className="p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestión de Tareas</h1>
          <p className="text-muted-foreground">
            {selectedGroup 
              ? `Tareas del grupo: ${selectedGroup.name}`
              : 'Selecciona un grupo para ver sus tareas específicas'
            }
          </p>
        </div>
      </div>

      <div className="mb-6">
        <Label htmlFor="group-select">Seleccionar Grupo</Label>
        <Select value={selectedGroupId} onValueChange={setSelectedGroupId}>
          <SelectTrigger className="w-full max-w-md">
            <SelectValue placeholder="Todos los grupos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos los grupos</SelectItem>
            {groups.filter(g => g.status !== 'archived').map(group => (
              <SelectItem key={group.id} value={group.id}>
                {group.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task, i) => {
            const taskGroup = groups.find(g => g.id === task.groupId);
            return (
              <div key={task.id} className="p-4 border rounded-lg bg-card flex justify-between items-center animate-scale-in" style={{animationDelay: `${i * 100}ms`}}>
                <div>
                  <h3 className="font-medium">{task.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {task.status === 'pending' ? 'Pendiente' : 'Completada'} • {taskGroup?.name || 'Grupo no encontrado'}
                  </p>
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
                {canUseAIGrading && (
                  <Button onClick={() => setSelectedTask(task)} disabled={!task.rubric_structured} size="sm">
                    <Bot className="mr-2 h-4 w-4" />
                    Calificar con IA
                  </Button>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            {selectedGroupId 
              ? `No hay tareas para el grupo seleccionado.`
              : 'No hay tareas disponibles.'
            }
          </div>
        )}
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
