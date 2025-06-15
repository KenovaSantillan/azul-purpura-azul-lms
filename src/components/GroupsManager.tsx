
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useLMS } from '@/contexts/LMSContext';
import { Grade, Letter, Specialty, Shift } from '@/types/lms';
import { Users, User, Circle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function GroupsManager() {
  const { groups, users, addGroup, updateGroup, deleteGroup } = useLMS();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  
  const [newGroup, setNewGroup] = useState({
    name: '',
    grade: '' as Grade,
    letter: '' as Letter,
    specialty: '' as Specialty,
    shift: '' as Shift,
    teacherId: '',
    tutorId: '',
  });

  const teachers = users.filter(u => u.role === 'teacher');
  const tutors = users.filter(u => u.role === 'tutor');

  const handleCreateGroup = () => {
    if (newGroup.name && newGroup.grade && newGroup.letter && newGroup.specialty && newGroup.shift && newGroup.teacherId) {
      addGroup({
        ...newGroup,
        students: [],
        tutorId: newGroup.tutorId || undefined,
      });
      setNewGroup({
        name: '',
        grade: '' as Grade,
        letter: '' as Letter,
        specialty: '' as Specialty,
        shift: '' as Shift,
        teacherId: '',
        tutorId: '',
      });
      setIsCreateOpen(false);
    }
  };

  const getSpecialtyColor = (specialty: Specialty) => {
    const colors = {
      'Servicios de Hospedaje': 'bg-blue-500',
      'Programación': 'bg-lms-purple-500',
      'Contabilidad': 'bg-green-500',
      'Construcción': 'bg-orange-500',
    };
    return colors[specialty];
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Gestión de Grupos</h1>
          <p className="text-muted-foreground">Administra los grupos académicos</p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-lms-purple-500 hover:bg-lms-purple-600">
              <Circle className="mr-2 h-4 w-4" />
              Crear Grupo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Grupo</DialogTitle>
              <DialogDescription>
                Configura los detalles del nuevo grupo académico
              </DialogDescription>
            </DialogHeader>
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
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateGroup} className="bg-lms-purple-500 hover:bg-lms-purple-600">
                Crear Grupo
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group, index) => (
          <Card 
            key={group.id} 
            className="hover:shadow-lg transition-all duration-200 cursor-pointer animate-scale-in border-l-4 border-l-lms-purple-500"
            style={{animationDelay: `${index * 100}ms`}}
            onClick={() => setSelectedGroup(selectedGroup === group.id ? null : group.id)}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{group.name}</CardTitle>
                  <CardDescription>
                    {group.grade} {group.letter} - {group.shift}
                  </CardDescription>
                </div>
                <div className={`p-2 rounded-full ${getSpecialtyColor(group.specialty)} text-white`}>
                  <Users className="h-4 w-4" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Badge variant="secondary" className="w-full justify-center">
                  {group.specialty}
                </Badge>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {group.students.length} estudiantes
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    group.shift === 'Matutino' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {group.shift}
                  </span>
                </div>

                {selectedGroup === group.id && (
                  <div className="mt-4 pt-4 border-t space-y-2 animate-fade-in">
                    <p className="text-sm"><strong>Docente:</strong> {users.find(u => u.id === group.teacherId)?.name}</p>
                    {group.tutorId && (
                      <p className="text-sm"><strong>Tutor:</strong> {users.find(u => u.id === group.tutorId)?.name}</p>
                    )}
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" className="flex-1">
                        Editar
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        Ver Detalles
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {groups.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay grupos creados</h3>
            <p className="text-muted-foreground mb-4">
              Crea tu primer grupo para comenzar a gestionar estudiantes
            </p>
            <Button onClick={() => setIsCreateOpen(true)} className="bg-lms-purple-500 hover:bg-lms-purple-600">
              Crear Primer Grupo
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
