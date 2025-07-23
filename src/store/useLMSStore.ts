import create from 'zustand';
import { Group, User } from '@/types/lms';
import { toast } from 'sonner';

interface GroupSlice {
  groups: Group[];
  loadingGroups: boolean;
  addGroup: (group: Omit<Group, 'id' | 'createdAt'>) => Group;
  updateGroup: (id: string, group: Partial<Group>) => void;
  archiveGroup: (id: string) => void;
  restoreGroup: (id: string) => void;
  copyGroup: (id: string) => void;
  deleteGroup: (id: string) => void;
  addUsersToGroup: (groupId: string, users: User[]) => void;
  removeUserFromGroup: (groupId: string, userId: string) => void;
  initializeGroups: (users: User[]) => void;
}

const useLMSStore = create<GroupSlice>((set, get) => ({
  groups: [],
  loadingGroups: true,
  initializeGroups: (users) => {
    if (get().groups.length === 0 && users.length > 0) {
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
          teacherId: defaultTeacher?.id || 'teacher-19',
          tutorId: defaultTutor?.id || 'tutor-6',
          students: students,
          createdAt: new Date(),
          status: 'active',
        }
      ];
      set({ groups: sampleGroups, loadingGroups: false });
    }
  },
  addGroup: (group) => {
    const newGroup: Group = {
      ...group,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    set(state => ({ groups: [...state.groups, newGroup] }));
    toast.success(`Grupo "${newGroup.name}" creado.`);
    return newGroup;
  },
  updateGroup: (id, group) => {
    set(state => ({
      groups: state.groups.map(g => (g.id === id ? { ...g, ...group } : g)),
    }));
  },
  archiveGroup: (id) => get().updateGroup(id, { status: 'archived' }),
  restoreGroup: (id) => get().updateGroup(id, { status: 'active' }),
  copyGroup: (id) => {
    const groupToCopy = get().groups.find(g => g.id === id);
    if (groupToCopy) {
      get().addGroup({
        ...groupToCopy,
        name: `Copia de ${groupToCopy.name}`,
        students: [],
      });
      toast.success(`Grupo "${groupToCopy.name}" copiado.`);
    }
  },
  deleteGroup: (id) => {
    set(state => ({ groups: state.groups.filter(g => g.id !== id) }));
  },
  addUsersToGroup: (groupId, users) => {
    set(state => ({
      groups: state.groups.map(g =>
        g.id === groupId
          ? { ...g, students: [...new Set([...g.students, ...users])] }
          : g
      ),
    }));
  },
  removeUserFromGroup: (groupId, userId) => {
    set(state => ({
      groups: state.groups.map(g =>
        g.id === groupId
          ? { ...g, students: g.students.filter(s => s.id !== userId) }
          : g
      ),
    }));
  },
}));

export default useLMSStore;
