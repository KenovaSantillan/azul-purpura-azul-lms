
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Mic, MicOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Group, User } from '@/types/lms';
import { useSpeechToText } from '@/hooks/use-speech-to-text';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AlertTutorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: User;
  group: Group;
  tutor: User;
}

const alertCriteria = [
  { id: 'indisciplina', label: 'Indisciplina' },
  { id: 'falta_de_respeto', label: 'Falta de Respeto' },
  { id: 'habitos_nocivos', label: 'Hábitos Nocivos' },
  { id: 'ausentismo', label: 'Ausentismo' },
  { id: 'danos_mobiliario', label: 'Daños al Mobiliario' },
  { id: 'otro', label: 'Otro' },
] as const;

const FormSchema = z.object({
  criteria: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'Debes seleccionar al menos un criterio.',
  }),
  description: z.string().min(10, {
    message: 'La descripción debe tener al menos 10 caracteres.',
  }),
});

export function AlertTutorDialog({ open, onOpenChange, student, group, tutor }: AlertTutorDialogProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      criteria: [],
      description: '',
    },
  });

  const { isListening, startListening, stopListening, hasRecognitionSupport } = useSpeechToText({
    onResult: (result) => {
        const currentDescription = form.getValues('description');
        form.setValue('description', (currentDescription ? currentDescription + ' ' : '') + result);
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset();
      if(isListening) stopListening();
    }
  }, [open, form, isListening, stopListening]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const promise = supabase.functions.invoke('send-tutor-alert', {
      body: {
        studentName: student.name,
        groupName: group.name,
        tutorEmail: tutor.email,
        tutorName: tutor.name,
        criteria: data.criteria.map(id => alertCriteria.find(c => c.id === id)?.label),
        description: data.description,
      },
    });

    toast.promise(promise, {
        loading: 'Enviando alerta...',
        success: () => {
            onOpenChange(false);
            return 'Alerta enviada correctamente al tutor.';
        },
        error: 'Error al enviar la alerta. Inténtalo de nuevo.',
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enviar Alerta a Tutor</DialogTitle>
          <DialogDescription>
            Reporte de conducta para el alumno <span className="font-semibold">{student.name}</span> del grupo <span className="font-semibold">{group.name}</span>.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="criteria"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Criterios</FormLabel>
                  </div>
                  {alertCriteria.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="criteria"
                      render={({ field }) => (
                        <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...(field.value || []), item.id])
                                  : field.onChange(
                                      (field.value || []).filter(
                                        (value) => value !== item.id
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">{item.label}</FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción del Reporte</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Textarea placeholder="Describe detalladamente la situación..." {...field} rows={5} />
                      {hasRecognitionSupport && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute bottom-2 right-2"
                          onClick={isListening ? stopListening : startListening}
                        >
                          {isListening ? <MicOff className="text-red-500" /> : <Mic />}
                        </Button>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button type="submit">Enviar Alerta</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
