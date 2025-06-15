
import React from 'react';
import { Resource } from '@/types/lms';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, File, Trash2, User, Calendar, Download, Edit } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useLMS } from '@/contexts/LMSContext';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import EditResourceDialog from './EditResourceDialog';

const SUPABASE_URL = "https://nezvfjxihrwuhkbufxkg.supabase.co";

const ResourceCard = ({ resource }: { resource: Resource }) => {
    const { currentUser } = useUser();
    const { deleteResource, isDeleting } = useLMS();

    const canDelete = currentUser?.id === resource.uploaded_by || currentUser?.role === 'admin';
    const uploaderName = resource.profiles ? `${resource.profiles.first_name || ''} ${resource.profiles.last_name || ''}`.trim() : 'Desconocido';

    const handleDownload = () => {
        if (resource.type === 'file') {
            const url = `${SUPABASE_URL}/storage/v1/object/public/resource_files/${resource.content}`;
            window.open(url, '_blank');
        } else if (resource.type === 'link') {
            window.open(resource.content, '_blank');
        }
    };
    
    return (
        <Card className="flex flex-col transition-all hover:shadow-md">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                        {resource.type === 'link' ? <Link className="h-5 w-5 text-primary" /> : <File className="h-5 w-5 text-primary" />}
                        <CardTitle className="text-lg leading-tight">{resource.title}</CardTitle>
                    </div>
                </div>
                <CardDescription className="line-clamp-2 pt-2 h-10">{resource.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow text-sm text-muted-foreground space-y-2">
                 <div className="flex items-center gap-2">
                    <User className="h-4 w-4"/>
                    <span>{uploaderName}</span>
                </div>
                 <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4"/>
                    <span>{format(new Date(resource.created_at), "d MMM yyyy", { locale: es })}</span>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center pt-4">
                <Button variant="outline" size="sm" onClick={handleDownload}>
                    {resource.type === 'file' ? <Download className="mr-2 h-4 w-4" /> : <Link className="mr-2 h-4 w-4" />}
                    {resource.type === 'file' ? 'Descargar' : 'Abrir Enlace'}
                </Button>

                {canDelete && (
                    <div className="flex items-center">
                        <EditResourceDialog resource={resource}>
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                                <Edit className="h-4 w-4" />
                            </Button>
                        </EditResourceDialog>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Esta acción no se puede deshacer. Esto eliminará permanentemente el recurso.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => deleteResource(resource)} disabled={isDeleting}>
                                        {isDeleting ? 'Eliminando...' : 'Eliminar'}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                )}
            </CardFooter>
        </Card>
    );
};

export default ResourceCard;
