
import React, { useState } from 'react';
import { useLMSResources } from '@/contexts/ResourceContext';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import AddResourceDialog from './AddResourceDialog';
import ResourceCard from './ResourceCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Breadcrumbs from '../navigation/Breadcrumbs';
import AdvancedSearch from '../search/AdvancedSearch';
import { useLazyLoading } from '@/hooks/useLazyLoading';

interface SearchFilters {
  type: string;
  status: string;
  dateRange: string;
  groups: string[];
}

const Library = () => {
    const { resources, loadingResources } = useLMSResources();
    const { currentUser } = useUser();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [advancedFilters, setAdvancedFilters] = useState<SearchFilters>({
        type: 'all',
        status: 'all',
        dateRange: 'all',
        groups: [],
    });
    const { isIntersecting: showMoreResources, elementRef: moreResourcesRef } = useLazyLoading();
    
    const canAddResources = currentUser?.role === 'teacher' || currentUser?.role === 'admin';

    const filteredResources = resources.filter(resource => {
        const searchMatch = 
            resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (resource.description && resource.description.toLowerCase().includes(searchTerm.toLowerCase()));

        const typeMatch = filterType === 'all' || resource.type === filterType;

        // Advanced filters
        const advancedTypeMatch = advancedFilters.type === 'all' || 
            (advancedFilters.type === 'resource' && (resource.type === 'file' || resource.type === 'link'));

        const groupMatch = advancedFilters.groups.length === 0 || 
            (resource.group_id && advancedFilters.groups.includes(resource.group_id)) ||
            !resource.group_id; // Include general resources

        const dateMatch = (() => {
            if (advancedFilters.dateRange === 'all') return true;
            const resourceDate = new Date(resource.created_at);
            const now = new Date();
            
            switch (advancedFilters.dateRange) {
                case 'today':
                    return resourceDate.toDateString() === now.toDateString();
                case 'week':
                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    return resourceDate >= weekAgo;
                case 'month':
                    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                    return resourceDate >= monthAgo;
                default:
                    return true;
            }
        })();

        return searchMatch && typeMatch && advancedTypeMatch && groupMatch && dateMatch;
    });

    const handleAdvancedSearch = (query: string, filters: SearchFilters) => {
        setSearchTerm(query);
        setAdvancedFilters(filters);
    };

    const breadcrumbItems = [
        { label: 'Biblioteca de Recursos' }
    ];

    // Lazy loading: show first 12 resources, then load more
    const visibleResources = showMoreResources ? filteredResources : filteredResources.slice(0, 12);

    return (
        <div className="p-6">
            <Breadcrumbs items={breadcrumbItems} />
            
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

                {/* Enhanced Search */}
                <div className="space-y-4">
                    <AdvancedSearch 
                        onSearch={handleAdvancedSearch}
                        placeholder="Buscar recursos por título o descripción..."
                    />
                    
                    {/* Quick Filters */}
                    <div className="flex gap-4">
                        <Select value={filterType} onValueChange={setFilterType}>
                            <SelectTrigger className="w-full sm:w-[200px]">
                                <SelectValue placeholder="Filtro rápido" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los tipos</SelectItem>
                                <SelectItem value="file">Archivos</SelectItem>
                                <SelectItem value="link">Enlaces</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </header>

            {/* Results Summary */}
            {!loadingResources && (
                <div className="mb-4">
                    <p className="text-sm text-muted-foreground">
                        {filteredResources.length === resources.length 
                            ? `Mostrando ${filteredResources.length} recursos`
                            : `Mostrando ${filteredResources.length} de ${resources.length} recursos`
                        }
                    </p>
                </div>
            )}

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
            
            {!loadingResources && visibleResources.length > 0 && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {visibleResources.map(resource => (
                            <ResourceCard key={resource.id} resource={resource} />
                        ))}
                    </div>
                    
                    {/* Load More Trigger */}
                    {filteredResources.length > 12 && (
                        <div ref={moreResourcesRef} className="text-center py-4">
                            {!showMoreResources && (
                                <Button variant="outline">
                                    Cargar más recursos...
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Library;
