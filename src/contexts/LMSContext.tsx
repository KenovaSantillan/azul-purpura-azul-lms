import React, { createContext, useContext, useState, useEffect } from 'react';
import { Group, User, Task, Announcement, StudentProgress, Team, UserRole } from '@/types/lms';
import { useAuth } from './AuthContext';

interface LMSContextType {
  groups: Group[];
  users: User[];
  tasks: Task[];
  announcements: Announcement[];
  teams: Team[];
  currentUser: User | null;
  addGroup: (group: Omit<Group, 'id' | 'createdAt'>) => void;
  updateGroup: (id: string, group: Partial<Group>) => void;
  deleteGroup: (id: string) => void;
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'createdAt'>) => void;
  addUsersToGroup: (groupId: string, userIds: string[]) => void;
  removeUserFromGroup: (groupId: string, userId: string) => void;
  createTeam: (team: Omit<Team, 'id'>) => void;
  updateTeam: (id: string, team: Partial<Team>) => void;
  getStudentProgress: (studentId: string, groupId: string) => StudentProgress | null;
}

const LMSContext = createContext<LMSContextType | undefined>(undefined);

export function LMSProvider({ children }: { children: React.ReactNode }) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  
  const { user: authUser } = useAuth();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    if (authUser) {
      setCurrentUser({
        id: authUser.id,
        name: authUser.user_metadata.name ?? authUser.email!,
        email: authUser.email!,
        role: authUser.user_metadata.role ?? 'student',
        avatar: authUser.user_metadata.avatar_url,
      });
    } else {
      setCurrentUser(null);
    }
  }, [authUser]);

  // Initialize with sample data
  useEffect(() => {
    const sampleUsers: User[] = [
      { id: '1', name: 'Prof. María González', email: 'maria@escuela.edu', role: 'teacher' },
      { id: '2', name: 'Juan Pérez', email: 'juan@estudiante.edu', role: 'student' },
      { id: '3', name: 'Ana Martínez', email: 'ana@estudiante.edu', role: 'student' },
      { id: '4', name: 'Carlos López', email: 'carlos@estudiante.edu', role: 'student' },
      { id: '5', name: 'Tutor Rodríguez', email: 'tutor@escuela.edu', role: 'tutor' },
    ];

    const sampleGroups: Group[] = [
      {
        id: '1',
        name: '1° A - Programación Matutino',
        grade: '1o',
        letter: 'A',
        specialty: 'Programación',
        shift: 'Matutino',
        teacherId: '1',
        tutorId: '5',
        students: sampleUsers.filter(u => u.role === 'student'),
        createdAt: new Date(),
      }
    ];

    const sampleTasks: Task[] = [
      {
        id: '1',
        title: 'Proyecto Final HTML/CSS',
        description: 'Crear una página web completa usando HTML y CSS',
        type: 'collective',
        groupId: '1',
        assignedTo: ['2', '3', '4'],
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: 'pending',
        createdBy: '1',
        createdAt: new Date(),
      }
    ];

    const sampleAnnouncements: Announcement[] = [
      {
        id: '1',
        title: 'Bienvenidos al nuevo semestre',
        content: 'Esperamos que tengan un excelente semestre lleno de aprendizaje.',
        groupId: '1',
        createdBy: '1',
        createdAt: new Date(),
        priority: 'high',
      }
    ];

    setUsers(sampleUsers);
    setGroups(sampleGroups);
    setTasks(sampleTasks);
    setAnnouncements(sampleAnnouncements);
  }, []);

  const addGroup = (group: Omit<Group, 'id' | 'createdAt'>) => {
    const newGroup: Group = {
      ...group,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setGroups(prev => [...prev, newGroup]);
  };

  const updateGroup = (id: string, group: Partial<Group>) => {
    setGroups(prev => prev.map(g => g.id === id ? { ...g, ...group } : g));
  };

  const deleteGroup = (id: string) => {
    setGroups(prev => prev.filter(g => g.id !== id));
  };

  const addUser = (user: Omit<User, 'id'>) => {
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
    };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (id: string, user: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...user } : u));
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (id: string, task: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...task } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const addAnnouncement = (announcement: Omit<Announcement, 'id' | 'createdAt'>) => {
    const newAnnouncement: Announcement = {
      ...announcement,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setAnnouncements(prev => [...prev, newAnnouncement]);
  };

  const addUsersToGroup = (groupId: string, userIds: string[]) => {
    const usersToAdd = users.filter(u => userIds.includes(u.id));
    setGroups(prev => prev.map(g => 
      g.id === groupId 
        ? { ...g, students: [...g.students, ...usersToAdd] }
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

  const createTeam = (team: Omit<Team, 'id'>) => {
    const newTeam: Team = {
      ...team,
      id: Date.now().toString(),
    };
    setTeams(prev => [...prev, newTeam]);
  };

  const updateTeam = (id: string, team: Partial<Team>) => {
    setTeams(prev => prev.map(t => t.id === id ? { ...t, ...team } : t));
  };

  const getStudentProgress = (studentId: string, groupId: string): StudentProgress | null => {
    const groupTasks = tasks.filter(t => t.groupId === groupId && t.assignedTo.includes(studentId));
    const completedTasks = groupTasks.filter(t => t.status === 'completed').length;
    
    return {
      studentId,
      groupId,
      completedTasks,
      totalTasks: groupTasks.length,
      grade: completedTasks > 0 ? (completedTasks / groupTasks.length) * 100 : 0,
      lastActivity: new Date(),
    };
  };

  return (
    <LMSContext.Provider value={{
      groups,
      users,
      tasks,
      announcements,
      teams,
      currentUser,
      addGroup,
      updateGroup,
      deleteGroup,
      addUser,
      updateUser,
      deleteUser,
      addTask,
      updateTask,
      deleteTask,
      addAnnouncement,
      addUsersToGroup,
      removeUserFromGroup,
      createTeam,
      updateTeam,
      getStudentProgress,
    }}>
      {children}
    </LMSContext.Provider>
  );
}

export function useLMS() {
  const context = useContext(LMSContext);
  if (context === undefined) {
    throw new Error('useLMS must be used within an LMSProvider');
  }
  return context;
}
