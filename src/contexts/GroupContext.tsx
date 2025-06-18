
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Group, User } from '@/types/lms';
import { useUser } from './UserContext';
import { toast } from 'sonner';

export interface GroupContextType {
  groups: Group[];
  loadingGroups: boolean;
  addGroup: (group: Omit<Group, 'id' | 'createdAt'>) => Group;
  updateGroup: (id: string, group: Partial<Group>) => void;
  archiveGroup: (id: string) => void;
  restoreGroup: (id: string) => void;
  copyGroup: (id: string) => void;
  deleteGroup: (id: string) => void;
  addUsersToGroup: (groupId: string, userIds: string[]) => void;
  removeUserFromGroup: (groupId: string, userId: string) => void;
}

const GroupContext = createContext<GroupContextType | undefined>(undefined);

export function GroupProvider({ children }: { children: React.ReactNode }) {
  const [groups, setGroups] = useState<Group[]>([]);
  const { users, loadingUsers } = useUser();

  useEffect(() => {
    if (users.length === 0) return;

    // Buscar un maestro y tutor por defecto de la nueva lista
    const defaultTeacher = users.find(u => u.role === 'teacher' && u.name.includes('Santillán'));
    const defaultTutor = users.find(u => u.role === 'tutor' && u.name.includes('García'));
    const students = users.filter(u => u.role === 'student');

    const sampleGroups: Group[] = [
      {
        id: '1',
        name: '1° A - Programación Matutino',
        grade: '1o',
        letter: 'A',
        specialty: 'Programación',
        shift: 'Matutino',
        teacherId: defaultTeacher?.id || '1',
        tutorId: defaultTutor?.id || '5',
        students: students,
        createdAt: new Date(),
        status: 'active',
      }
    ];

    setGroups(sampleGroups);
  }, [users]);

  const addGroup = (group: Omit<Group, 'id' | 'createdAt'>): Group => {
    const newGroup: Group = {
      ...group,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setGroups(prev => [...prev, newGroup]);
    toast.success(`Grupo "${newGroup.name}" creado.`);
    return newGroup;
  };

  const updateGroup = (id: string, group: Partial<Group>) => {
    setGroups(prev => prev.map(g => g.id === id ? { ...g, ...group } : g));
  };

  const archiveGroup = (id: string) => {
    updateGroup(id, { status: 'archived' });
  };

  const restoreGroup = (id: string) => {
    updateGroup(id, { status: 'active' });
  };

  const copyGroup = (id: string) => {
    const groupToCopy = groups.find(g => g.id === id);
    if (!groupToCopy) {
      toast.error("No se pudo encontrar el grupo para copiar.");
      return;
    }

    const newGroup: Group = {
      ...groupToCopy,
      id: Date.now().toString(),
      name: `Copia de ${groupToCopy.name}`,
      createdAt: new Date(),
      students: [], // No se copian los estudiantes
      status: 'active',
    };
    setGroups(prev => [...prev, newGroup]);
    toast.success(`Grupo "${groupToCopy.name}" copiado.`);
  };

  const deleteGroup = (id: string) => {
    setGroups(prev => prev.filter(g => g.id !== id));
  };

  const addUsersToGroup = (groupId: string, userIds: string[]) => {
    const usersToAdd = users.filter(u => userIds.includes(u.id));
    setGroups(prev => prev.map(g => 
      g.id === groupId 
        ? { ...g, students: [...new Set([...g.students, ...usersToAdd])] }
        : g
    ));
  };

  const removeUserFromGroup = (groupId: string, userId: string) => {
    setGroups(prev => prev.map(g => 
      g.id === groupId 
        ? { ...g, students: g.students.filter(s => s.id !== userId) }
        : g
    ));
  };

  const value = {
    groups,
    loadingGroups: loadingUsers,
    addGroup,
    updateGroup,
    archiveGroup,
    restoreGroup,
    copyGroup,
    deleteGroup,
    addUsersToGroup,
    removeUserFromGroup,
  };

  return (
    <GroupContext.Provider value={value}>
      {children}
    </GroupContext.Provider>
  );
}

export function useGroups() {
  const context = useContext(GroupContext);
  if (context === undefined) {
    throw new Error('useGroups must be used within a GroupProvider');
  }
  return context;
}
