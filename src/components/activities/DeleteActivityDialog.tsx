
import React, { useState } from 'react';
import { useActivities } from '@/contexts/ActivityContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Activity } from '@/types/activity';

interface DeleteActivityDialogProps {
  activity: Activity | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const DeleteActivityDialog = ({ activity, isOpen, onOpenChange }: DeleteActivityDialogProps) => {
  const { deleteActivity } = useActivities();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!activity) return;

    setIsDeleting(true);
    try {
      await deleteActivity(activity.id);
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting activity:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!activity) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar actividad?</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro de que quieres eliminar la actividad <strong>#{activity.activity_number} - {activity.name}</strong>?
            Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? 'Eliminando...' : 'Eliminar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
