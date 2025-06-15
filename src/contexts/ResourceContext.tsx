
import React, { createContext, useContext } from 'react';
import { Resource } from '@/types/lms';
import { useFetchResources } from '@/hooks/useFetchResources';
import { useResourceActions, ResourceInput } from '@/hooks/useResourceActions';
import { PostgrestError } from '@supabase/supabase-js';

export interface ResourceContextType {
    resources: Resource[];
    loadingResources: boolean;
    resourcesError: PostgrestError | null;
    addResource: (data: { resource: ResourceInput, file?: File }, options?: { onSuccess?: () => void, onError?: (error: Error) => void }) => void;
    deleteResource: (resource: Resource, options?: { onSuccess?: () => void, onError?: (error: Error) => void }) => void;
    isAdding: boolean;
    isDeleting: boolean;
}

const ResourceContext = createContext<ResourceContextType | undefined>(undefined);

export function ResourceProvider({ children }: { children: React.ReactNode }) {
    const { data: resources, isLoading, error } = useFetchResources();
    const { addResource, deleteResource, isAdding, isDeleting } = useResourceActions();
    
    const value = {
        resources: resources || [],
        loadingResources: isLoading,
        resourcesError: error,
        addResource,
        deleteResource,
        isAdding,
        isDeleting,
    };

    return (
        <ResourceContext.Provider value={value}>
            {children}
        </ResourceContext.Provider>
    );
}

export function useLMSResources() {
    const context = useContext(ResourceContext);
    if (context === undefined) {
        throw new Error('useLMSResources must be used within a ResourceProvider');
    }
    return context;
}
