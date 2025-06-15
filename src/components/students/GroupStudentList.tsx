import React, { useState } from 'react';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Mail, Users } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useUser } from '@/contexts/UserContext';
import { Group, User } from '@/types/lms';
import { toast } from 'sonner';
import { AlertTutorDialog } from '@/components/sections/AlertTutorDialog';
import { AlertParentDialog } from '@/components/sections/AlertParentDialog';

interface GroupStudentListProps {
  group: Group;
  onStudentSelect: (student: User) => void;
}

const GroupStudentList = ({ group, onStudentSelect }: GroupStudentListProps) => {
  const { users, updateUser } = useUser();
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [isParentAlertDialogOpen, setIsParentAlertDialogOpen] = useState(false);
  const [selectedStudentForAlert, setSelectedStudentForAlert] = useState<User | null>(null);

  const students = group.students || [];
  const tutor = users.find(u => u.id === group.tutorId);

  const handleAlertClick = (student: User) => {
    if (!tutor) {
      toast.error("El grupo no tiene un tutor asignado para enviarle alertas.");
      return;
    }
    setSelectedStudentForAlert(student);
    setIsAlertDialogOpen(true);
  };

  const handleParentAlertClick = (student: User) => {
    setSelectedStudentForAlert(student);
    setIsParentAlertDialogOpen(true);
  };
  
  const handleStatusChange = (studentId: string, isActive: boolean) => {
    const newStatus = isActive ? 'active' : 'inactive';
    updateUser(studentId, { status: newStatus });
    toast.success(`Estudiante ${newStatus === 'active' ? 'habilitado' : 'inhabilitado'}.`);
  };

  return (
    <>
      <AccordionItem value={group.id}>
        <AccordionTrigger className="text-lg font-medium hover:no-underline px-4 py-3 rounded-lg hover:bg-muted">
          {group.name} ({students.length} estudiantes)
        </AccordionTrigger>
        <AccordionContent>
          {students.length > 0 ? (
            <div className="border rounded-lg overflow-hidden mt-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre Completo</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow
                      key={student.id}
                      className={cn("cursor-pointer hover:bg-muted/50", student.status === 'inactive' && "text-muted-foreground opacity-60")}
                      onClick={() => onStudentSelect(student)}
                    >
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          <Switch
                            id={`status-${student.id}-${group.id}`}
                            checked={student.status === 'active'}
                            onCheckedChange={(checked) => handleStatusChange(student.id, checked)}
                          />
                          <Label htmlFor={`status-${student.id}-${group.id}`}>
                            {student.status === 'active' ? "Activo" : "Inactivo"}
                          </Label>
                        </div>
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handleAlertClick(student)} title="Alertar al Tutor">
                              <Mail className="h-4 w-4" />
                              <span className="sr-only">Enviar Alerta al Tutor</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleParentAlertClick(student)} title="Enviar comunicado a Padres">
                              <Users className="h-4 w-4" />
                              <span className="sr-only">Enviar comunicado a Padres</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-muted-foreground text-center p-4">No hay estudiantes en este grupo.</p>
          )}
        </AccordionContent>
      </AccordionItem>

      {selectedStudentForAlert && tutor && (
        <AlertTutorDialog
            open={isAlertDialogOpen}
            onOpenChange={setIsAlertDialogOpen}
            student={selectedStudentForAlert}
            group={group}
            tutor={tutor}
        />
      )}

      {selectedStudentForAlert && (
        <AlertParentDialog
            open={isParentAlertDialogOpen}
            onOpenChange={setIsParentAlertDialogOpen}
            student={selectedStudentForAlert}
            group={group}
        />
      )}
    </>
  );
};

export default React.memo(GroupStudentList);
