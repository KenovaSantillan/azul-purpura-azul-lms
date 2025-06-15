
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLMS } from '@/contexts/LMSContext';
import { useUser } from '@/contexts/UserContext';
import { User } from '@/types/lms';
import { toast } from 'sonner';
import { FileUp } from 'lucide-react';

interface AddStudentsFormProps {
  groupId: string;
  onFinished: () => void;
}

export default function AddStudentsForm({ groupId, onFinished }: AddStudentsFormProps) {
  const { addUsersToGroup } = useLMS();
  const { bulkAddUsers } = useUser();
  const [studentList, setStudentList] = useState('');

  const handleAddStudents = () => {
    if (!studentList.trim()) {
      toast.info('La lista de estudiantes está vacía. Finalizando sin agregar alumnos.');
      onFinished();
      return;
    }

    try {
      const lines = studentList.trim().split('\n');
      const newUsers: User[] = lines.map(line => {
        const parts = line.split(',').map(p => p.trim());
        if (parts.length < 3) {
          throw new Error(`Línea inválida, se esperan 3 partes (N° Control, Apellidos, Nombres): "${line}"`);
        }
        const [id, lastNames, firstNames] = parts;
        const name = `${firstNames} ${lastNames}`;
        
        return {
          id,
          name,
          email: `${id}@estudiante.kenova.edu`,
          role: 'student',
          status: 'active',
        };
      });

      bulkAddUsers(newUsers);
      addUsersToGroup(groupId, newUsers.map(u => u.id));
      
      toast.success(`${newUsers.length} estudiantes agregados al grupo exitosamente.`);
      onFinished();
    } catch (error: any) {
      toast.error(`Error al procesar la lista: ${error.message}`);
    }
  };

  return (
    <div className="space-y-4 py-4">
      <div>
        <p className="text-sm text-muted-foreground mb-2">
          Puedes agregar estudiantes pegando una lista en el formato: <br />
          <code className="bg-muted px-1 py-0.5 rounded">N° Control, Apellidos, Nombres</code> (un estudiante por línea).
        </p>
        <Label htmlFor="student-list">Pegar lista de estudiantes</Label>
        <Textarea
          id="student-list"
          value={studentList}
          onChange={(e) => setStudentList(e.target.value)}
          placeholder="12345,Perez Garcia,Juan&#10;67890,Lopez Martinez,Maria"
          rows={10}
        />
      </div>
      <div className="flex justify-between items-center">
        <Button variant="outline" disabled>
          <FileUp className="mr-2 h-4 w-4" />
          Subir lista (próximamente)
        </Button>
        <Button onClick={handleAddStudents} className="bg-lms-purple-500 hover:bg-lms-purple-600">
          Agregar Estudiantes y Finalizar
        </Button>
      </div>
    </div>
  );
}
