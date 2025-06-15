import React, { createContext, useContext, useState, useEffect } from 'react';
import { Group, User, Task, Announcement, StudentProgress, Team, TaskSubmission, UserRole } from '@/types/lms';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { User as AuthUser, RealtimeChannel } from '@supabase/supabase-js';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface LMSContextType {
  groups: Group[];
  users: User[];
  tasks: Task[];
  announcements: Announcement[];
  teams: Team[];
  taskSubmissions: TaskSubmission[];
  currentUser: User | null;
  loadingCurrentUser: boolean;
  addGroup: (group: Omit<Group, 'id' | 'createdAt'>) => Group;
  updateGroup: (id: string, group: Partial<Group>) => void;
  archiveGroup: (id: string) => void;
  restoreGroup: (id: string) => void;
  copyGroup: (id: string) => void;
  deleteGroup: (id: string) => void;
  addUser: (user: Omit<User, 'id'>) => void;
  bulkAddUsers: (users: User[]) => void;
  updateUser: (id: string, user: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'createdAt'>) => void;
  updateAnnouncement: (id: string, announcement: Partial<Omit<Announcement, 'id' | 'createdAt' | 'createdBy'>>) => void;
  deleteAnnouncement: (id: string) => void;
  addUsersToGroup: (groupId: string, userIds: string[]) => void;
  removeUserFromGroup: (groupId: string, userId: string) => void;
  createTeam: (team: Omit<Team, 'id'>) => void;
  updateTeam: (id: string, team: Partial<Team>) => void;
  getStudentProgress: (studentId: string, groupId: string) => StudentProgress | null;
  addTaskSubmission: (submission: Omit<TaskSubmission, 'id' | 'createdAt' | 'submittedAt' | 'submissionHash'>) => void;
  updateTaskSubmission: (id: string, submission: Partial<TaskSubmission>) => void;
  sendGroupChatMessage: (groupId: string, content: string) => Promise<void>;
}

const LMSContext = createContext<LMSContextType | undefined>(undefined);

// A simple hashing function (not cryptographically secure, just for demonstration)
const simpleHash = (text: string): string => {
  if (!text) return '';
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString();
};

export function LMSProvider({ children }: { children: React.ReactNode }) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [taskSubmissions, setTaskSubmissions] = useState<TaskSubmission[]>([]);
  
  const { user: authUser } = useAuth();
  const queryClient = useQueryClient();

  const { data: currentUser, isLoading: loadingCurrentUser } = useQuery({
    queryKey: ['currentUserProfile', authUser?.id],
    queryFn: async () => {
      if (!authUser) return null;
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        toast.error("No se pudo cargar el perfil del usuario.");
        console.error("Error fetching profile:", error);
        return null;
      }
      if (profile) {
        const userWithStatus: User = {
          id: profile.id,
          name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
          email: profile.email!,
          role: profile.role,
          avatar: profile.avatar_url,
          status: profile.status,
        };
        return userWithStatus;
      }
      return null;
    },
    enabled: !!authUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    let channel: RealtimeChannel | undefined;
    if (authUser) {
      channel = supabase.channel(`profile-changes-for-${authUser.id}`)
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${authUser.id}` },
          (payload) => {
            console.log('User profile updated via realtime:', payload);
            toast.info('Tu perfil ha sido actualizado.');
            queryClient.invalidateQueries({ queryKey: ['currentUserProfile', authUser.id] });
          }
        )
        .subscribe();
    }
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [authUser, queryClient]);

  const { data: allUsersFromQuery } = useQuery({
    queryKey: ['allUsers'],
    queryFn: async (): Promise<User[]> => {
      const { data, error } = await supabase.from('profiles').select('*');
      if (error) {
        toast.error('No se pudieron cargar los usuarios.');
        console.error('Error fetching users:', error);
        return [];
      } else {
        return data.map(profile => ({
          id: profile.id,
          name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
          email: profile.email!,
          role: profile.role,
          avatar: profile.avatar_url,
          status: profile.status,
        }));
      }
    },
    enabled: !!currentUser && currentUser.role === 'admin',
  });

  // Initialize with data
  useEffect(() => {
    const sampleUsers: User[] = [
      { id: '1', name: 'Prof. María González', email: 'maria@escuela.edu', role: 'teacher', status: 'active' },
      { id: '2', name: 'Juan Pérez', email: 'juan@estudiante.edu', role: 'student', status: 'active' },
      { id: '3', name: 'Ana Martínez', email: 'ana@estudiante.edu', role: 'student', status: 'active' },
      { id: '4', name: 'Carlos López', email: 'carlos@estudiante.edu', role: 'student', 'status': 'inactive' },
      { id: '5', name: 'Tutor Rodríguez', email: 'tutor@escuela.edu', role: 'tutor', status: 'active' },
    ];
    
    let usersForSetup: User[] = sampleUsers;
    if (currentUser?.role === 'admin' && allUsersFromQuery) {
        usersForSetup = allUsersFromQuery;
    }
    setUsers(usersForSetup);
    
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
        students: usersForSetup.filter(u => u.role === 'student'),
        createdAt: new Date(),
        status: 'active',
      }
    ];

    const sampleTasks: Task[] = [
      {
        id: '1',
        title: 'Proyecto Final HTML/CSS',
        description: 'Crear una página web completa usando HTML y CSS',
        type: 'collective',
        groupId: '1',
        assignedTo: usersForSetup.filter(u => u.role === 'student').map(s => s.id),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: 'pending',
        createdBy: '1',
        createdAt: new Date(),
        max_score: 100,
        allow_late_submissions: true,
        rubric: `
          - **Estructura HTML (30%)**: Uso correcto de etiquetas semánticas (header, footer, nav, section, article).
          - **Estilos CSS (40%)**: Diseño visualmente atractivo, uso de Flexbox o Grid, consistencia en colores y fuentes.
          - **Responsividad (20%)**: La página se adapta correctamente a tamaños de pantalla de escritorio y móvil.
          - **Creatividad y Originalidad (10%)**: El diseño es único y creativo.
        `.trim(),
        rubric_structured: [
          { id: 'html_structure', description: 'Estructura HTML', points: 30 },
          { id: 'css_styles', description: 'Estilos CSS', points: 40 },
          { id: 'responsiveness', description: 'Responsividad', points: 20 },
          { id: 'creativity', description: 'Creatividad y Originalidad', points: 10 },
        ],
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

    setGroups(sampleGroups);
    setTasks(sampleTasks);
    setAnnouncements(sampleAnnouncements);
    setTaskSubmissions([]);
  }, [currentUser, allUsersFromQuery]);

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

  const addUser = (user: Omit<User, 'id'>) => {
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
    };
    setUsers(prev => [...prev, newUser]);
  };

  const bulkAddUsers = (newUsers: User[]) => {
    setUsers(prev => {
        const existingIds = new Set(prev.map(u => u.id));
        const trulyNewUsers = newUsers.filter(u => !existingIds.has(u.id));
        return [...prev, ...trulyNewUsers];
    });
  };

  const userMutation = useMutation({
    mutationFn: async ({ id, user }: { id: string, user: Partial<User> }) => {
      const updatePayload: { status?: 'pending' | 'active' | 'inactive', role?: UserRole } = {};
      if (user.status) {
        updatePayload.status = user.status;
      }
      if (user.role) {
        updatePayload.role = user.role;
      }

      if (Object.keys(updatePayload).length === 0) {
        console.warn("updateUser called without any fields to update.");
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update(updatePayload)
        .eq('id', id);

      if (error) {
        throw new Error('Error al actualizar el usuario.');
      }
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ['allUsers'] });
      const previousUsers = queryClient.getQueryData<User[]>(['allUsers']);
      
      const optimisticUpdate = (old?: User[]) => old?.map(u => u.id === variables.id ? { ...u, ...variables.user } : u);

      queryClient.setQueryData<User[]>(['allUsers'], optimisticUpdate);
      setUsers(prev => optimisticUpdate(prev) || []);
      
      return { previousUsers };
    },
    onError: (err, variables, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(['allUsers'], context.previousUsers);
        setUsers(context.previousUsers);
      }
      toast.error('Error al actualizar el usuario.');
      console.error('Error updating user:', err);
    },
    onSuccess: () => {
      toast.success('Usuario actualizado correctamente.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });

  const updateUser = async (id: string, user: Partial<User>) => {
    await userMutation.mutateAsync({ id, user });
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

  const updateAnnouncement = (id: string, announcement: Partial<Omit<Announcement, 'id' | 'createdAt' | 'createdBy'>>) => {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, ...announcement } : a));
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
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

  const sendGroupChatMessage = async (groupId: string, content: string) => {
    if (!currentUser) {
      toast.error("Debes iniciar sesión para enviar mensajes.");
      throw new Error("User not authenticated");
    }

    const { error } = await supabase.from('group_chat_messages').insert({
      group_id: groupId,
      user_id: currentUser.id,
      content: content,
    });

    if (error) {
      toast.error("Error al enviar el mensaje.");
      console.error("Error sending message:", error);
      throw error;
    }
  };

  const addTaskSubmission = (submission: Omit<TaskSubmission, 'id' | 'createdAt' | 'submittedAt' | 'submissionHash'>) => {
    const submissionHash = submission.content ? simpleHash(submission.content) : undefined;
    
    const newSubmission: TaskSubmission = {
      ...submission,
      id: Date.now().toString(),
      createdAt: new Date(),
      submittedAt: new Date(),
      submissionHash,
    };
    
    // Plagiarism check
    if (submissionHash) {
      const existingSubmission = taskSubmissions.find(
        s => s.taskId === submission.taskId && s.submissionHash === submissionHash && s.studentId !== submission.studentId
      );
      if (existingSubmission) {
        // Mark task as plagiarized for both submissions
        updateTask(submission.taskId, { status: 'plagiarized' });
        console.warn(`Plagiarism detected for task ${submission.taskId}`);
      }
    }
    
    setTaskSubmissions(prev => [...prev, newSubmission]);
    
    const task = tasks.find(t => t.id === submission.taskId);
    if (task && task.status !== 'plagiarized') {
      updateTask(submission.taskId, { status: 'submitted' });
    }
  };

  const updateTaskSubmission = (id: string, submission: Partial<TaskSubmission>) => {
    setTaskSubmissions(prev => prev.map(s => s.id === id ? { ...s, ...submission } : s));
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
      taskSubmissions,
      currentUser: currentUser ?? null,
      loadingCurrentUser,
      addGroup,
      updateGroup,
      archiveGroup,
      restoreGroup,
      copyGroup,
      deleteGroup,
      addUser,
      bulkAddUsers,
      updateUser,
      deleteUser,
      addTask,
      updateTask,
      deleteTask,
      addAnnouncement,
      updateAnnouncement,
      deleteAnnouncement,
      addUsersToGroup,
      removeUserFromGroup,
      createTeam,
      updateTeam,
      getStudentProgress,
      addTaskSubmission,
      updateTaskSubmission,
      sendGroupChatMessage,
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
