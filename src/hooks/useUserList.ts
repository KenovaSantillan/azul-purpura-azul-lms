
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/lms';
import { toast } from 'sonner';

export function useUserList(currentUser: User | null) {
    return useQuery({
        queryKey: ['allUsers'],
        queryFn: async (): Promise<User[]> => {
            const { data, error } = await supabase.from('profiles').select('*');
            if (error) {
                toast.error('No se pudieron cargar los usuarios.');
                console.error('Error fetching users:', error);
                return [];
            }
            return data.map(profile => ({
                id: profile.id,
                name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
                email: profile.email!,
                role: profile.role,
                avatar: profile.avatar_url,
                status: profile.status,
            }));
        },
        enabled: !!currentUser && currentUser.role === 'admin',
    });
}
