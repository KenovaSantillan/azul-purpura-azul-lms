import React from 'react';
import { User, UserRole } from '@/types/lms';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUserActions() {
    const queryClient = useQueryClient();

    const createUserMutation = useMutation({
        mutationFn: async (userData: { email: string; role: UserRole; first_name: string; last_name: string; }) => {
            const { email, role, first_name, last_name } = userData;
            // Generate a secure temporary password. User will need to reset it.
            const password = crypto.randomUUID();

            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        first_name,
                        last_name,
                        role,
                    },
                },
            });

            if (error) {
                // Check if user already exists
                if (error.message.includes('User already registered')) {
                    throw new Error(`El correo ${email} ya está registrado.`);
                }
                throw new Error(error.message);
            }

            if (!data.user) {
                throw new Error("No se pudo crear el usuario.");
            }

            // The trigger handle_new_user creates the profile.
            // We can optimistically return the new user data.
            const newUser: User = {
                id: data.user.id,
                name: `${first_name} ${last_name}`,
                email: data.user.email!,
                role: role,
                status: 'pending', // The trigger sets the initial status
            };
            return newUser;
        },
        onSuccess: (newUser) => {
            queryClient.invalidateQueries({ queryKey: ['allUsers'] });
            toast.success(`Usuario "${newUser.name}" creado exitosamente.`);
        },
        onError: (error: Error) => {
            // Toast is handled in the component for more specific messages
            console.error('Error creating user:', error);
        },
    });

    const createUser = async (userData: { email: string; role: UserRole; first_name: string; last_name: string; }) => {
        return await createUserMutation.mutateAsync(userData);
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
            
            return { previousUsers };
        },
        onError: (err, variables, context: any) => {
            if (context?.previousUsers) {
                queryClient.setQueryData(['allUsers'], context.previousUsers);
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

    return { createUser, updateUser };
}
