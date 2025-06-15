
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import GroupForm from './GroupForm';
import { useLMS } from '@/contexts/LMSContext';
import { Group } from '@/types/lms';
import { toast } from 'sonner';

interface EditGroupDialogProps {
  group: Group | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const initialGroupState = {
    name: '',
    grade: '' as any,
    letter: '' as any,
    specialty: '' as any,
    shift: '' as any,
    teacherId: '',
    tutorId: '',
};

export default function EditGroupDialog({ group, isOpen, onOpenChange }: EditGroupDialogProps) {
    const { users, updateGroup } = useLMS();
    const [editedGroup, setEditedGroup] = useState<any>(initialGroupState);

    useEffect(() => {
        if (group) {
            setEditedGroup({
                id: group.id,
                name: group.name,
                grade: group.grade,
                letter: group.letter,
                specialty: group.specialty,
                shift: group.shift,
                teacherId: group.teacherId,
                tutorId: group.tutorId || '',
            });
        }
    }, [group]);
    
    const teachers = users.filter(u => u.role === 'teacher');
    const tutors = users.filter(u => u.role === 'tutor');

    if (!group) return null;

    const handleSaveChanges = () => {
        if (editedGroup.name && editedGroup.grade && editedGroup.letter && editedGroup.specialty && editedGroup.shift && editedGroup.teacherId) {
            updateGroup(group.id, {
                ...editedGroup,
                tutorId: editedGroup.tutorId || undefined,
            });
            toast.success(`Grupo "${editedGroup.name}" actualizado exitosamente.`);
            onOpenChange(false);
        } else {
            toast.error("Por favor, completa todos los campos requeridos.");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Editar Grupo: {group.name}</DialogTitle>
                    <DialogDescription>Modifica los detalles del grupo.</DialogDescription>
                </DialogHeader>
                <GroupForm newGroup={editedGroup} setNewGroup={setEditedGroup} teachers={teachers} tutors={tutors} />
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
                    <Button onClick={handleSaveChanges} className="bg-lms-purple-500 hover:bg-lms-purple-600">Guardar Cambios</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
