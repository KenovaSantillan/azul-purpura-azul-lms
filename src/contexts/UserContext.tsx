
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types/lms';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface UserContextType {
  users: User[];
  currentUser: User | null;
  loadingCurrentUser: boolean;
  addUser: (user: Omit<User, 'id'>) => void;
  bulkAddUsers: (users: User[]) => void;
  updateUser: (id: string, user: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
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
  }, [currentUser, allUsersFromQuery]);

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
      const previousUsersQuery = queryClient.getQueryData<User[]>(['allUsers']);
      const previousUsersState = users;
      
      const optimisticUpdate = (old?: User[]) => old?.map(u => u.id === variables.id ? { ...u, ...variables.user } : u);

      queryClient.setQueryData<User[]>(['allUsers'], optimisticUpdate);
      setUsers(prev => optimisticUpdate(prev) || []);
      
      return { previousUsersQuery, previousUsersState };
    },
    onError: (err, variables, context: any) => {
      if (context?.previousUsersQuery) {
        queryClient.setQueryData(['allUsers'], context.previousUsersQuery);
      }
       if (context?.previousUsersState) {
        setUsers(context.previousUsersState);
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

  const value = {
    users,
    currentUser: currentUser ?? null,
    loadingCurrentUser,
    addUser,
    bulkAddUsers,
    updateUser,
    deleteUser,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
