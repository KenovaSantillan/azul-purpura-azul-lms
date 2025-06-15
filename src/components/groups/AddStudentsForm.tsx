
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLMS } from '@/contexts/LMSContext';
import { useUser } from '@/contexts/UserContext';
import { User, UserRole } from '@/types/lms';
import { toast } from 'sonner';
import { FileUp, Loader2 } from 'lucide-react';

interface AddStudentsFormProps {
  groupId: string;
  onFinished: () => void;
}

export default function AddStudentsForm({ groupId, onFinished }: AddStudentsFormProps) {
  const { addUsersToGroup } = useLMS();
  const { createUser } = useUser();
  const [studentList, setStudentList] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleAddStudents = async () => {
    if (!studentList.trim()) {
      toast.info('La lista de estudiantes está vacía. Finalizando sin agregar alumnos.');
      onFinished();
      return;
    }

    setIsCreating(true);
    try {
      const lines = studentList.trim().split('\n');
      const studentsToCreate = lines.map(line => {
        const parts = line.split(',').map(p => p.trim());
        if (parts.length < 3) {
          throw new Error(`Línea inválida, se esperan 3 partes (N° Control, Apellidos, Nombres): "${line}"`);
        }
        const [id, lastNames, firstNames] = parts;
        return {
          first_name: firstNames,
          last_name: lastNames,
          email: `${id}@estudiante.kenova.edu`,
          role: 'student' as UserRole,
        };
      });

      const results = await Promise.allSettled(
        studentsToCreate.map(student => createUser(student))
      );
      
      const createdUsers: User[] = [];
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          createdUsers.push(result.value);
        } else {
          toast.error(`Error al crear ${studentsToCreate[index].email}: ${result.reason.message}`);
          console.error(`Error creando estudiante ${studentsToCreate[index].email}:`, result.reason);
        }
      });

      if (createdUsers.length > 0) {
        addUsersToGroup(groupId, createdUsers.map(u => u.id));
        toast.success(`${createdUsers.length} de ${studentsToCreate.length} estudiantes procesados exitosamente.`);
      }
      
      onFinished();
    } catch (error: any) {
      toast.error(`Error al procesar la lista: ${error.message}`);
    } finally {
        setIsCreating(false);
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
          disabled={isCreating}
        />
      </div>
      <div className="flex justify-between items-center">
        <Button variant="outline" disabled>
          <FileUp className="mr-2 h-4 w-4" />
          Subir lista (próximamente)
        </Button>
        <Button onClick={handleAddStudents} disabled={isCreating} className="bg-lms-purple-500 hover:bg-lms-purple-600">
          {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isCreating ? 'Agregando Estudiantes...' : 'Agregar Estudiantes y Finalizar'}
        </Button>
      </div>
    </div>
  );
}
