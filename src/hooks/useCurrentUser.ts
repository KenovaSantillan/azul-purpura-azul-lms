
import { useEffect } from 'react';
import { User } from '@/types/lms';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export function useCurrentUser() {
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

    return { currentUser: currentUser ?? null, loadingCurrentUser };
}
