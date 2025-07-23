
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLMS } from '@/contexts/LMSContext';
import { useUser } from '@/contexts/UserContext';
import { Grade, Letter, Specialty, Shift, Group } from '@/types/lms';
import GroupForm from './GroupForm';
import { Circle } from 'lucide-react';
import AddStudentsForm from './AddStudentsForm';
import { toast } from 'sonner';

interface CreateGroupDialogProps {
  isCreateOpen: boolean;
  setIsCreateOpen: (isOpen: boolean) => void;
}

const initialGroupState = {
  name: '',
  grade: '' as Grade,
  letter: '' as Letter,
  specialty: '' as Specialty,
  shift: '' as Shift,
  teacherId: '',
  tutorId: '',
};

export default function CreateGroupDialog({ isCreateOpen, setIsCreateOpen }: CreateGroupDialogProps) {
  const { addGroup } = useLMS();
  const { users } = useUser();
  const [step, setStep] = useState(1);
  const [createdGroup, setCreatedGroup] = useState<Group | null>(null);

  const [newGroup, setNewGroup] = useState(initialGroupState);

  const teachers = users.filter(u => u.role === 'teacher');
  const tutors = users.filter(u => u.role === 'tutor');

  const handleNextStep = () => {
    console.log("Submitting new group:", newGroup);
    if (newGroup.name && newGroup.teacherId) {
      const created = addGroup({
        ...newGroup,
        students: [],
        tutorId: newGroup.tutorId || undefined,
      });
      setCreatedGroup(created);
      setStep(2);
    } else {
      toast.error("Por favor, selecciona un grupo y un docente.");
    }
  };
  
  const resetAndClose = () => {
    setIsCreateOpen(false);
    setTimeout(() => {
        setStep(1);
        setCreatedGroup(null);
        setNewGroup(initialGroupState);
    }, 300);
  };

  return (
    <Dialog open={isCreateOpen} onOpenChange={(open) => {
        if (!open) {
            resetAndClose();
        } else {
            setIsCreateOpen(true);
        }
    }}>
      <DialogTrigger asChild>
        <Button className="bg-lms-purple-500 hover:bg-lms-purple-600">
          <Circle className="mr-2 h-4 w-4" />
          Crear Grupo
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        {step === 1 && (
            <>
                <DialogHeader>
                    <DialogTitle>Crear Nuevo Grupo</DialogTitle>
                    <DialogDescription>
                        Configura los detalles del nuevo grupo académico
                    </DialogDescription>
                </DialogHeader>
                <GroupForm newGroup={newGroup} setNewGroup={setNewGroup} teachers={teachers} tutors={tutors} />
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={resetAndClose}>
                        Cancelar
                    </Button>
                    <Button onClick={handleNextStep} className="bg-lms-purple-500 hover:bg-lms-purple-600">
                        Siguiente: Agregar Alumnos
                    </Button>
                </div>
            </>
        )}
        {step === 2 && createdGroup && (
            <>
                <DialogHeader>
                    <DialogTitle>Agregar Alumnos a "{createdGroup.name}"</DialogTitle>
                    <DialogDescription>
                        Agrega los estudiantes que pertenecerán a este grupo. Puedes hacerlo ahora o más tarde.
                    </DialogDescription>
                </DialogHeader>
                <AddStudentsForm groupId={createdGroup.id} onFinished={resetAndClose} />
            </>
        )}
      </DialogContent>
    </Dialog>
  );
}
