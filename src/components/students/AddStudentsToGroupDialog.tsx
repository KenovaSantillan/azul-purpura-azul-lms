
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AddStudentsForm from '../groups/AddStudentsForm';
import { useLMS } from '@/contexts/LMSContext';
import { Label } from '@/components/ui/label';

interface AddStudentsToGroupDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function AddStudentsToGroupDialog({ isOpen, onOpenChange }: AddStudentsToGroupDialogProps) {
  const { groups } = useLMS();
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  const activeGroups = groups.filter(g => g.status !== 'archived');

  const handleDialogStateChange = (open: boolean) => {
    if (!open) {
      setSelectedGroupId(null); // Reset on close
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogStateChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Agregar Estudiantes a un Grupo</DialogTitle>
          <DialogDescription>
            Selecciona un grupo y luego agrega la lista de estudiantes.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="group-select">Seleccionar Grupo</Label>
            <Select onValueChange={setSelectedGroupId} value={selectedGroupId ?? ''}>
              <SelectTrigger id="group-select" className="w-full">
                <SelectValue placeholder="Elige un grupo..." />
              </SelectTrigger>
              <SelectContent>
                {activeGroups.map(group => (
                  <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {selectedGroupId && (
            <AddStudentsForm 
              groupId={selectedGroupId} 
              onFinished={() => handleDialogStateChange(false)} 
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
