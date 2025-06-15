
import React from 'react';
import { useLMS } from '@/contexts/LMSContext';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import AddResourceDialog from './AddResourceDialog';
import ResourceCard from './ResourceCard';

const Library = () => {
    const { resources, loadingResources } = useLMS();
    const { currentUser } = useUser();
    
    const canAddResources = currentUser?.role === 'teacher' || currentUser?.role === 'admin';

    return (
        <div className="p-6">
            <header className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Biblioteca de Recursos</h1>
                    <p className="text-muted-foreground">Encuentra archivos, enlaces y materiales para tus clases.</p>
                </div>
                {canAddResources && (
                    <AddResourceDialog>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Añadir Recurso
                        </Button>
                    </AddResourceDialog>
                )}
            </header>

            {loadingResources && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
                </div>
            )}

            {!loadingResources && resources.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <h2 className="text-xl font-semibold">No hay recursos disponibles</h2>
                    <p className="text-muted-foreground mt-2">
                        {canAddResources ? 'Empieza añadiendo tu primer recurso.' : 'Pronto se añadirán recursos a la biblioteca.'}
                    </p>
                </div>
            )}
            
            {!loadingResources && resources.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {resources.map(resource => <ResourceCard key={resource.id} resource={resource} />)}
                </div>
            )}
        </div>
    );
};

export default Library;
