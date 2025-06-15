
import React, { useState } from 'react';
import { useLMS } from '@/contexts/LMSContext';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import AddResourceDialog from './AddResourceDialog';
import ResourceCard from './ResourceCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Library = () => {
    const { resources, loadingResources } = useLMS();
    const { currentUser } = useUser();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    
    const canAddResources = currentUser?.role === 'teacher' || currentUser?.role === 'admin';

    const filteredResources = resources.filter(resource => {
        const searchMatch = 
            resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (resource.description && resource.description.toLowerCase().includes(searchTerm.toLowerCase()));

        const typeMatch = filterType === 'all' || resource.type === filterType;

        return searchMatch && typeMatch;
    });

    return (
        <div className="p-6">
            <header className="mb-6">
                <div className="flex items-center justify-between mb-4">
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
                </div>
                <div className="flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Buscar por título o descripción..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="w-full sm:w-[200px]">
                            <SelectValue placeholder="Filtrar por tipo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos los tipos</SelectItem>
                            <SelectItem value="file">Archivos</SelectItem>
                            <SelectItem value="link">Enlaces</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </header>

            {loadingResources && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
                </div>
            )}

            {!loadingResources && filteredResources.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <h2 className="text-xl font-semibold">
                        {resources.length > 0 ? "No se encontraron recursos" : "No hay recursos disponibles"}
                    </h2>
                    <p className="text-muted-foreground mt-2">
                        {resources.length > 0 
                            ? "Intenta con otra búsqueda o filtro."
                            : (canAddResources ? 'Empieza añadiendo tu primer recurso.' : 'Pronto se añadirán recursos a la biblioteca.')
                        }
                    </p>
                </div>
            )}
            
            {!loadingResources && filteredResources.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredResources.map(resource => <ResourceCard key={resource.id} resource={resource} />)}
                </div>
            )}
        </div>
    );
};

export default Library;
