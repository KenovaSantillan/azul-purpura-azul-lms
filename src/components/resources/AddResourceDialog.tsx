import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useLMSResources } from '@/contexts/ResourceContext';
import { useUser } from '@/contexts/UserContext';
import { ResourceInput } from '@/hooks/useResourceActions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Group } from '@/types/lms';

interface AddResourceDialogProps {
    children: React.ReactNode;
}

const fetchGroups = async (): Promise<Group[]> => {
    const { data, error } = await supabase.from('groups').select('*');
    if (error) {
        console.error("Error fetching groups:", error);
        throw error;
    }
    
    // Transform the Supabase data to match the Group interface
    return (data || []).map(group => ({
        id: group.id,
        name: group.name,
        grade: group.grade,
        letter: group.letter,
        specialty: group.specialty,
        shift: group.shift,
        teacherId: group.teacher_id || '',
        tutorId: group.tutor_id || undefined,
        students: [], // Empty array for now, as we don't need students for this dialog
        createdAt: new Date(group.created_at || ''),
        status: group.status
    }));
};

const AddResourceDialog = ({ children }: AddResourceDialogProps) => {
    const { addResource, isAdding } = useLMSResources();
    const { currentUser } = useUser();
    const { data: groups = [] } = useQuery({ queryKey: ['groups'], queryFn: fetchGroups });
    
    const [open, setOpen] = useState(false);
    const [type, setType] = useState<'file' | 'link'>('link');
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState(''); // for link URL
    const [groupId, setGroupId] = useState<string>('');

    const teacherGroups = groups.filter(g => g.teacherId === currentUser?.id);

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setContent('');
        setFile(null);
        setGroupId('');
        setType('link');
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const resource: ResourceInput = {
            title,
            description,
            type,
            content: type === 'link' ? content : '',
            file_name: type === 'file' ? file?.name : undefined,
            file_type: type === 'file' ? file?.type : undefined,
            group_id: groupId || undefined,
        };
        addResource({ resource, file: file || undefined }, {
            onSuccess: () => {
                toast.success('Recurso añadido con éxito.');
                setOpen(false);
                resetForm();
            }
        });
    };
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Añadir Nuevo Recurso</DialogTitle>
                    <DialogDescription>
                        Comparte un archivo o un enlace con tus estudiantes. Puede ser para un grupo específico o para todos.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div>
                        <Label>Tipo de Recurso</Label>
                        <RadioGroup defaultValue="link" value={type} onValueChange={(v: 'file' | 'link') => setType(v)} className="flex items-center gap-4 mt-2">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="link" id="r-link" />
                                <Label htmlFor="r-link">Enlace</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="file" id="r-file" />
                                <Label htmlFor="r-file">Archivo</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <div>
                        <Label htmlFor="title">Título</Label>
                        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>
                    <div>
                        <Label htmlFor="description">Descripción</Label>
                        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    {type === 'link' ? (
                        <div>
                            <Label htmlFor="url">URL del Enlace</Label>
                            <Input id="url" type="url" value={content} onChange={(e) => setContent(e.target.value)} required placeholder="https://ejemplo.com"/>
                        </div>
                    ) : (
                        <div>
                            <Label htmlFor="file">Archivo (Max 5MB)</Label>
                            <Input id="file" type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} required />
                        </div>
                    )}

                    <div>
                         <Label htmlFor="group">Asignar a un Grupo (Opcional)</Label>
                         <Select onValueChange={setGroupId} value={groupId}>
                             <SelectTrigger>
                                 <SelectValue placeholder="General (visible para todos)" />
                             </SelectTrigger>
                             <SelectContent>
                                 <SelectItem value="">General (todos los grupos)</SelectItem>
                                 {teacherGroups.map(group => (
                                     <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
                                 ))}
                             </SelectContent>
                         </Select>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                        <Button type="submit" disabled={isAdding}>{isAdding ? 'Añadiendo...' : 'Añadir Recurso'}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddResourceDialog;
