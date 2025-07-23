import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Grade, Letter, Specialty, Shift, User } from '@/types/lms';

interface GroupFormProps {
  newGroup: {
    name: string;
    grade: Grade | '';
    letter: Letter | '';
    specialty: Specialty | '';
    shift: Shift | '';
    teacherId: string;
    tutorId: string;
  };
  setNewGroup: React.Dispatch<React.SetStateAction<GroupFormProps['newGroup']>>;
  teachers: User[];
  tutors: User[];
}

const augustGroups = [
  { name: '1°A SERVICIOS DE HOSPEDAJE', grade: '1o', letter: 'A', specialty: 'Servicios de Hospedaje' },
  { name: '1°B PROGRAMACION', grade: '1o', letter: 'B', specialty: 'Programación' },
  { name: '1°C CONTABILIDAD', grade: '1o', letter: 'C', specialty: 'Contabilidad' },
  { name: '1°D PROGRAMACION', grade: '1o', letter: 'D', specialty: 'Programación' },
  { name: '1°E CONSTRUCCION', grade: '1o', letter: 'E', specialty: 'Construcción' },
  { name: '3°A SERVICIOS DE HOSPEDAJE', grade: '3o', letter: 'A', specialty: 'Servicios de Hospedaje' },
  { name: '3°B PROGRAMACION', grade: '3o', letter: 'B', specialty: 'Programación' },
  { name: '3°C CONTABILIDAD', grade: '3o', letter: 'C', specialty: 'Contabilidad' },
  { name: '3°D PROGRAMACION', grade: '3o', letter: 'D', specialty: 'Programación' },
  { name: '3°E CONSTRUCCION', grade: '3o', letter: 'E', specialty: 'Construcción' },
  { name: '5°A SERVICIOS DE HOSPEDAJE', grade: '5o', letter: 'A', specialty: 'Servicios de Hospedaje' },
  { name: '5°B PROGRAMACION', grade: '5o', letter: 'B', specialty: 'Programación' },
  { name: '5°C CONTABILIDAD', grade: '5o', letter: 'C', specialty: 'Contabilidad' },
  { name: '5°D PROGRAMACION', grade: '5o', letter: 'D', specialty: 'Programación' },
  { name: '5°E CONSTRUCCION', grade: '5o', letter: 'E', specialty: 'Construcción' },
];

const februaryGroups = [
  { name: '2°A SERVICIOS DE HOSPEDAJE', grade: '2o', letter: 'A', specialty: 'Servicios de Hospedaje' },
  { name: '2°B PROGRAMACION', grade: '2o', letter: 'B', specialty: 'Programación' },
  { name: '2°C CONTABILIDAD', grade: '2o', letter: 'C', specialty: 'Contabilidad' },
  { name: '2°D PROGRAMACION', grade: '2o', letter: 'D', specialty: 'Programación' },
  { name: '2°E CONSTRUCCION', grade: '2o', letter: 'E', specialty: 'Construcción' },
  { name: '4°A SERVICIOS DE HOSPEDAJE', grade: '4o', letter: 'A', specialty: 'Servicios de Hospedaje' },
  { name: '4°B PROGRAMACION', grade: '4o', letter: 'B', specialty: 'Programación' },
  { name: '4°C CONTABILIDAD', grade: '4o', letter: 'C', specialty: 'Contabilidad' },
  { name: '4°D PROGRAMACION', grade: '4o', letter: 'D', specialty: 'Programación' },
  { name: '4°E CONSTRUCCION', grade: '4o', letter: 'E', specialty: 'Construcción' },
  { name: '6°A SERVICIOS DE HOSPEDAJE', grade: '6o', letter: 'A', specialty: 'Servicios de Hospedaje' },
  { name: '6°B PROGRAMACION', grade: '6o', letter: 'B', specialty: 'Programación' },
  { name: '6°C CONTABILIDAD', grade: '6o', letter: 'C', specialty: 'Contabilidad' },
  { name: '6°D PROGRAMACION', grade: '6o', letter: 'D', specialty: 'Programación' },
  { name: '6°E CONSTRUCCION', grade: '6o', letter: 'E', specialty: 'Construcción' },
];

export default function GroupForm({ newGroup, setNewGroup, teachers, tutors }: GroupFormProps) {
  const [semester, setSemester] = useState('');
  const [availableGroups, setAvailableGroups] = useState<typeof augustGroups>([]);

  useEffect(() => {
    if (semester === 'Agosto 2025') {
      setAvailableGroups(augustGroups);
    } else if (semester === 'Febrero 2026') {
      setAvailableGroups(februaryGroups);
    } else {
      setAvailableGroups([]);
    }
    setNewGroup(prev => ({ ...prev, name: '', grade: '', letter: '', specialty: '' }));
  }, [semester, setNewGroup]);

  const handleGroupChange = (groupName: string) => {
    const selectedGroup = availableGroups.find(g => g.name === groupName);
    if (selectedGroup) {
      setNewGroup(prev => ({
        ...prev,
        name: selectedGroup.name,
        grade: selectedGroup.grade as Grade,
        letter: selectedGroup.letter as Letter,
        specialty: selectedGroup.specialty as Specialty,
        shift: 'Matutino',
      }));
    }
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>Semestre</Label>
          <Select value={semester} onValueChange={setSemester}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona semestre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Agosto 2025">Agosto 2025</SelectItem>
              <SelectItem value="Febrero 2026">Febrero 2026</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Turno</Label>
          <Select value={newGroup.shift} onValueChange={(value: Shift) => setNewGroup({ ...newGroup, shift: value })} disabled={!semester}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona turno" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Matutino">Matutino</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="sm:col-span-2">
          <Label>Grupo</Label>
          <Select
            value={newGroup.name}
            onValueChange={handleGroupChange}
            disabled={!semester || !newGroup.shift}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona grupo" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {availableGroups.map(group => (
                <SelectItem key={group.name} value={group.name}>{group.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Docente *</Label>
          <Select value={newGroup.teacherId} onValueChange={(value) => setNewGroup({ ...newGroup, teacherId: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona docente" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {teachers.map(teacher => (
                <SelectItem key={teacher.id} value={teacher.id}>{teacher.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {teachers.length === 0 && (
            <p className="text-xs text-muted-foreground mt-1">No hay docentes disponibles</p>
          )}
        </div>
        <div>
          <Label>Tutor (Opcional)</Label>
          <Select value={newGroup.tutorId} onValueChange={(value) => setNewGroup({ ...newGroup, tutorId: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona tutor" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {tutors.map(tutor => (
                <SelectItem key={tutor.id} value={tutor.id}>{tutor.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {tutors.length === 0 && (
            <p className="text-xs text-muted-foreground mt-1">No hay tutores disponibles</p>
          )}
        </div>
      </div>
    </div>
  );
}
