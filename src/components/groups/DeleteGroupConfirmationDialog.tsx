
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useLMS } from "@/contexts/LMSContext";
import { Group } from "@/types/lms";
import { toast } from "sonner";

interface DeleteGroupConfirmationDialogProps {
  group: Group | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function DeleteGroupConfirmationDialog({ group, isOpen, onOpenChange }: DeleteGroupConfirmationDialogProps) {
  const { deleteGroup } = useLMS();

  const handleDelete = () => {
    if (group) {
      deleteGroup(group.id);
      toast.success(`Grupo "${group.name}" eliminado.`);
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro de que quieres eliminar este grupo?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Esto eliminará permanentemente el grupo "{group?.name}" y todos sus datos asociados.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Eliminar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
