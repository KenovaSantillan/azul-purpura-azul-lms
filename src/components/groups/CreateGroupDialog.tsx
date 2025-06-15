
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLMS } from '@/contexts/LMSContext';
import { Grade, Letter, Specialty, Shift } from '@/types/lms';
import GroupForm from './GroupForm';
import { Circle } from 'lucide-react';

interface CreateGroupDialogProps {
  isCreateOpen: boolean;
  setIsCreateOpen: (isOpen: boolean) => void;
}

export default function CreateGroupDialog({ isCreateOpen, setIsCreateOpen }: CreateGroupDialogProps) {
  const { users, addGroup } = useLMS();
  const [newGroup, setNewGroup] = useState({
    name: '',
    grade: '' as Grade,
    letter: '' as Letter,
    specialty: '' as Specialty,
    shift: '' as Shift,
    teacherId: '',
    tutorId: '',
  });

  const teachers = users.filter(u => u.role === 'teacher');
  const tutors = users.filter(u => u.role === 'tutor');

  const handleCreateGroup = () => {
    if (newGroup.name && newGroup.grade && newGroup.letter && newGroup.specialty && newGroup.shift && newGroup.teacherId) {
      addGroup({
        ...newGroup,
        students: [],
        tutorId: newGroup.tutorId || undefined,
      });
      setNewGroup({
        name: '',
        grade: '' as Grade,
        letter: '' as Letter,
        specialty: '' as Specialty,
        shift: '' as Shift,
        teacherId: '',
        tutorId: '',
      });
      setIsCreateOpen(false);
    }
  };

  return (
    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
      <DialogTrigger asChild>
        <Button className="bg-lms-purple-500 hover:bg-lms-purple-600">
          <Circle className="mr-2 h-4 w-4" />
          Crear Grupo
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Grupo</DialogTitle>
          <DialogDescription>
            Configura los detalles del nuevo grupo académico
          </DialogDescription>
        </DialogHeader>
        <GroupForm newGroup={newGroup} setNewGroup={setNewGroup} teachers={teachers} tutors={tutors} />
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleCreateGroup} className="bg-lms-purple-500 hover:bg-lms-purple-600">
            Crear Grupo
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
