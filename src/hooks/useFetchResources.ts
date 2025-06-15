
```typescript
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Resource } from '@/types/lms';
import { PostgrestError } from '@supabase/supabase-js';

const fetchResources = async (): Promise<Resource[]> => {
    const { data, error } = await supabase
        .from('resources')
        .select(`
            id,
            title,
            description,
            type,
            content,
            file_name,
            file_type,
            group_id,
            uploaded_by,
            created_at,
            updated_at,
            profiles (
                first_name,
                last_name
            )
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching resources:", error);
        throw error;
    }

    return data as Resource[];
};

export const useFetchResources = () => {
    return useQuery<Resource[], PostgrestError>({
        queryKey: ['resources'],
        queryFn: fetchResources,
    });
};
```
