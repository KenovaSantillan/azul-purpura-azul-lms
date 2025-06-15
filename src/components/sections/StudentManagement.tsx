
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileUp } from 'lucide-react';
import { useLMS } from '@/contexts/LMSContext';
import { User, Group } from '@/types/lms';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Accordion } from '@/components/ui/accordion';
import GroupStudentList from '../students/GroupStudentList';
import StudentResultsView from '../students/StudentResultsView';

const StudentManagement = () => {
  const { groups } = useLMS();
  const [selectedStudent, setSelectedStudent] = useState<{ student: User; group: Group } | null>(null);

  if (selectedStudent) {
    return (
      <StudentResultsView
        student={selectedStudent.student}
        group={selectedStudent.group}
        onBack={() => setSelectedStudent(null)}
      />
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
    <div className="p-6 animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Estudiantes</h1>
          <p className="text-muted-foreground">Revisa la lista de alumnos por grupo y su progreso.</p>
        </div>
        <Button>
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
  );
};

export default StudentManagement;
