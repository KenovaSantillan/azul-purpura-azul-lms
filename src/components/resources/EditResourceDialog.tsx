import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLMSResources } from '@/contexts/ResourceContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Resource } from '@/types/lms';
import { toast } from 'sonner';

const formSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres."),
  description: z.string().optional(),
  type: z.enum(['file', 'link'], { required_error: "Debe seleccionar un tipo de recurso." }),
  content: z.string().optional(),
  file: z.any().optional(),
});

type EditResourceFormValues = z.infer<typeof formSchema>;

const EditResourceDialog = ({ children, resource }: { children: React.ReactNode, resource: Resource }) => {
    const [open, setOpen] = useState(false);
    const { updateResource, isUpdating } = useLMSResources();
    
    const form = useForm<EditResourceFormValues>({
        resolver: zodResolver(formSchema),
    });

    const resourceType = form.watch('type');

    useEffect(() => {
        if (open) {
            form.reset({
                title: resource.title,
                description: resource.description || '',
                type: resource.type,
                content: resource.type === 'link' ? resource.content : '',
                file: undefined,
            });
        }
    }, [resource, form, open]);

    const onSubmit = (values: EditResourceFormValues) => {
        const { file, ...resourceData } = values;

        if (resourceData.type === 'link' && (!resourceData.content || !/^(ftp|http|https):\/\/[^ "]+$/.test(resourceData.content))) {
            form.setError('content', { type: 'manual', message: 'Por favor, introduce una URL válida.' });
            return;
        }
        
        const resourceToUpdate = {
            title: resourceData.title,
            description: resourceData.description,
            type: resourceData.type,
            ...(resourceData.type === 'link' && { content: resourceData.content }),
        };

        updateResource({ 
            resourceId: resource.id, 
            resource: resourceToUpdate, 
            file: file?.[0]
        }, {
            onSuccess: () => {
                setOpen(false);
                toast.success("Recurso actualizado con éxito.");
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Editar Recurso</DialogTitle>
                    <DialogDescription>Actualiza los detalles del recurso. Haz clic en guardar cuando termines.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                         <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Título</FormLabel>
                                    <FormControl><Input placeholder="Ej: Guía de Estudio para Examen" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descripción</FormLabel>
                                    <FormControl><Textarea placeholder="Describe brevemente el recurso..." {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tipo de Recurso</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue placeholder="Selecciona un tipo" /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="file">Archivo</SelectItem>
                                            <SelectItem value="link">Enlace</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        {resourceType === 'link' && (
                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>URL del Enlace</FormLabel>
                                        <FormControl><Input placeholder="https://ejemplo.com" {...field} value={field.value || ''} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {resourceType === 'file' && (
                            <FormField
                                control={form.control}
                                name="file"
                                render={({ field: { onChange, value, ...rest } }) => (
                                    <FormItem>
                                        <FormLabel>Archivo (Opcional: seleccionar para reemplazar)</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="file" 
                                                {...rest}
                                                onChange={(e) => onChange(e.target.files)}
                                            />
                                        </FormControl>
                                        {resource.file_name && !value?.[0] && <p className="text-sm text-muted-foreground mt-2">Archivo actual: {resource.file_name}</p>}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
                            <Button type="submit" disabled={isUpdating}>
                                {isUpdating ? 'Guardando...' : 'Guardar Cambios'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default EditResourceDialog;
