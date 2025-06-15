
import React from 'react';
import { Input } from '@/components/ui/input';
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

export default function GroupForm({ newGroup, setNewGroup, teachers, tutors }: GroupFormProps) {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nombre del Grupo</Label>
          <Input
            id="name"
            value={newGroup.name}
            onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
            placeholder="Ej: 1° A - Programación"
          />
        </div>
        <div>
          <Label>Grado</Label>
          <Select value={newGroup.grade} onValueChange={(value: Grade) => setNewGroup({ ...newGroup, grade: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona grado" />
            </SelectTrigger>
            <SelectContent>
              {(['1o', '2o', '3o', '4o', '5o', '6o'] as Grade[]).map(grade => (
                <SelectItem key={grade} value={grade}>{grade}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Letra</Label>
          <Select value={newGroup.letter} onValueChange={(value: Letter) => setNewGroup({ ...newGroup, letter: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona letra" />
            </SelectTrigger>
            <SelectContent>
              {(['A', 'B', 'C', 'D', 'E'] as Letter[]).map(letter => (
                <SelectItem key={letter} value={letter}>{letter}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Especialidad</Label>
          <Select value={newGroup.specialty} onValueChange={(value: Specialty) => setNewGroup({ ...newGroup, specialty: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona especialidad" />
            </SelectTrigger>
            <SelectContent>
              {(['Servicios de Hospedaje', 'Programación', 'Contabilidad', 'Construcción'] as Specialty[]).map(specialty => (
                <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Turno</Label>
          <Select value={newGroup.shift} onValueChange={(value: Shift) => setNewGroup({ ...newGroup, shift: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona turno" />
            </SelectTrigger>
            <SelectContent>
              {(['Matutino', 'Vespertino'] as Shift[]).map(shift => (
                <SelectItem key={shift} value={shift}>{shift}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Docente</Label>
          <Select value={newGroup.teacherId} onValueChange={(value) => setNewGroup({ ...newGroup, teacherId: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona docente" />
            </SelectTrigger>
            <SelectContent>
              {teachers.map(teacher => (
                <SelectItem key={teacher.id} value={teacher.id}>{teacher.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Tutor (Opcional)</Label>
          <Select value={newGroup.tutorId} onValueChange={(value) => setNewGroup({ ...newGroup, tutorId: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona tutor" />
            </SelectTrigger>
            <SelectContent>
              {tutors.map(tutor => (
                <SelectItem key={tutor.id} value={tutor.id}>{tutor.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
