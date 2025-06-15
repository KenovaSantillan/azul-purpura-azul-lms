
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileUp } from 'lucide-react';
import { useLMS } from '@/contexts/LMSContext';
import { User, Group } from '@/types/lms';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Accordion } from '@/components/ui/accordion';
import GroupStudentList from '../students/GroupStudentList';
import StudentResultsView from '../students/StudentResultsView';
import AddStudentsToGroupDialog from '../students/AddStudentsToGroupDialog';
import { Skeleton } from '@/components/ui/skeleton';

const StudentManagement = () => {
  const { groups, loadingGroups } = useLMS();
  const [selectedStudent, setSelectedStudent] = useState<{ student: User; group: Group } | null>(null);
  const [isAddStudentsDialogOpen, setIsAddStudentsDialogOpen] = useState(false);

  if (selectedStudent) {
    return (
      <StudentResultsView
        student={selectedStudent.student}
        group={selectedStudent.group}
        onBack={() => setSelectedStudent(null)}
      />
    );
  }

  if (loadingGroups) {
    return (
      <div className="p-6 animate-fade-in space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Skeleton className="h-9 w-64 mb-2" />
            <Skeleton className="h-5 w-80" />
          </div>
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="w-full space-y-2">
          <Skeleton className="h-14 w-full rounded-lg" />
          <Skeleton className="h-14 w-full rounded-lg" />
          <Skeleton className="h-14 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (!groups || groups.length === 0) {
    return (
        <div className="p-6">
            <Alert>
                <AlertDescription>No hay grupos disponibles. Por favor, crea un grupo para gestionar estudiantes.</AlertDescription>
            </Alert>
        </div>
    );
  }

  return (
    <>
      <div className="p-6 animate-fade-in space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Estudiantes</h1>
            <p className="text-muted-foreground">Revisa la lista de alumnos por grupo y su progreso.</p>
          </div>
          <Button onClick={() => setIsAddStudentsDialogOpen(true)}>
            <FileUp className="mr-2 h-4 w-4" />
            Agregar Alumnos (PDF)
          </Button>
        </div>
        
        <Accordion type="single" collapsible className="w-full space-y-2">
          {groups.filter(g => g.status !== 'archived').map((group) => (
            <GroupStudentList
              key={group.id}
              group={group}
              onStudentSelect={(student) => setSelectedStudent({ student, group })}
            />
          ))}
        </Accordion>
      </div>

      <AddStudentsToGroupDialog
        isOpen={isAddStudentsDialogOpen}
        onOpenChange={setIsAddStudentsDialogOpen}
      />
    </>
  );
};

export default StudentManagement;
