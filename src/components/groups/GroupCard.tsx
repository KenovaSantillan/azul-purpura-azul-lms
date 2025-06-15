import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Group, Specialty } from '@/types/lms';
import { useLMS } from '@/contexts/LMSContext';
import { Users, User as UserIcon, Pencil, Copy, MessageSquare, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface GroupCardProps {
    group: Group;
    index: number;
    isSelected: boolean;
    onSelect: (id: string | null) => void;
    onEnterClassroom: (groupId: string) => void;
    onEdit: (group: Group) => void;
    onDelete: (group: Group) => void;
}

const getSpecialtyColor = (specialty: Specialty) => {
    const colors = {
      'Servicios de Hospedaje': 'bg-blue-500',
      'Programación': 'bg-lms-purple-500',
      'Contabilidad': 'bg-green-500',
      'Construcción': 'bg-orange-500',
    };
    return colors[specialty];
};

export default function GroupCard({ group, index, isSelected, onSelect, onEnterClassroom, onEdit, onDelete }: GroupCardProps) {
    const { users, copyGroup } = useLMS();

    const handleEditClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onEdit(group);
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onDelete(group);
    };

    const handleCopyClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      copyGroup(group.id);
      onSelect(null);
    }

    const handleEnterClassroom = (e: React.MouseEvent) => {
      e.stopPropagation();
      onEnterClassroom(group.id);
    };

    return (
        <Card 
            key={group.id} 
            className="hover:shadow-lg transition-all duration-200 cursor-pointer animate-scale-in border-l-4 border-l-primary"
            style={{animationDelay: `${index * 100}ms`}}
            onClick={() => onSelect(isSelected ? null : group.id)}
        >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg truncate" title={group.name}>{group.name}</CardTitle>
                    <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0" onClick={handleEditClick}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardDescription>
                    {group.grade} {group.letter} - {group.shift}
                  </CardDescription>
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
                    <UserIcon className="h-4 w-4" />
                    {group.students.length} estudiantes
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    group.shift === 'Matutino' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {group.shift}
                  </span>
                </div>

                {isSelected && (
                  <div className="mt-4 pt-4 border-t space-y-2 animate-fade-in">
                    <p className="text-sm"><strong>Docente:</strong> {users.find(u => u.id === group.teacherId)?.name}</p>
                    {group.tutorId && (
                      <p className="text-sm"><strong>Tutor:</strong> {users.find(u => u.id === group.tutorId)?.name}</p>
                    )}
                    <div className="flex flex-col gap-2 pt-2">
                        <Button size="sm" className="w-full" onClick={handleEnterClassroom}>
                            <MessageSquare className="h-4 w-4 mr-2" /> Aula Virtual
                        </Button>
                        <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="flex-1" onClick={handleEditClick}>
                                <Pencil className="h-4 w-4 mr-2" /> Editar
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1" onClick={handleCopyClick}>
                                <Copy className="h-4 w-4 mr-2" /> Copiar
                            </Button>
                        </div>
                        <div className="flex gap-2">
                            <Button size="sm" variant="destructive" className="flex-1" onClick={handleDeleteClick}>
                                <Trash2 className="h-4 w-4 mr-2" /> Eliminar
                            </Button>
                        </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
        </Card>
    );
}
