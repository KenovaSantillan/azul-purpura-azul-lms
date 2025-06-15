
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Resource } from '@/types/lms';
import { toast } from 'sonner';

export type ResourceInput = Omit<Resource, 'id' | 'created_at' | 'updated_at' | 'uploaded_by' | 'profiles'> & { uploaded_by?: string };

const uploadResourceFile = async (file: File) => {
    const filePath = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
        .from('resource_files')
        .upload(filePath, file);

    if (error) {
        toast.error(`Error al subir el archivo: ${error.message}`);
        throw error;
    }

    return { filePath };
};


export const useResourceActions = () => {
    const queryClient = useQueryClient();

    const addResourceMutation = useMutation({
        mutationFn: async ({ resource, file }: { resource: ResourceInput, file?: File }) => {
            let content = resource.content;
            if (resource.type === 'file' && file) {
                const { filePath } = await uploadResourceFile(file);
                content = filePath;
            } else if (resource.type === 'file' && !file) {
                throw new Error("Se requiere un archivo para el tipo de recurso 'file'.");
            }
            
            const { data: authData, error: authError } = await supabase.auth.getUser();
            if (authError || !authData.user) throw new Error("Usuario no autenticado.");
            
            const resourceToInsert = { ...resource, content, uploaded_by: authData.user.id };

            const { data, error } = await supabase
                .from('resources')
                .insert(resourceToInsert)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['resources'] });
        },
        onError: (error: Error) => {
            toast.error(`Error al añadir el recurso: ${error.message}`);
        }
    });

    const deleteResourceMutation = useMutation({
        mutationFn: async (resource: Resource) => {
            if (resource.type === 'file' && resource.content) {
                const { error: storageError } = await supabase.storage
                    .from('resource_files')
                    .remove([resource.content]);
                if (storageError) {
                    console.error('Fallo al eliminar objeto del almacenamiento:', storageError.message);
                    toast.warning("No se pudo eliminar el archivo del almacenamiento, pero se eliminó el registro del recurso.")
                }
            }

            const { error } = await supabase
                .from('resources')
                .delete()
                .eq('id', resource.id);
            
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['resources'] });
            toast.success('Recurso eliminado con éxito.');
        },
        onError: (error: Error) => {
            toast.error(`Error al eliminar el recurso: ${error.message}`);
        },
    });

    return {
        addResource: addResourceMutation.mutate,
        deleteResource: deleteResourceMutation.mutate,
        isAdding: addResourceMutation.isPending,
        isDeleting: deleteResourceMutation.isPending,
    };
};
