
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { User, Group } from '@/types/lms';
import { toast } from 'sonner';
import { useSpeechToText } from '@/hooks/use-speech-to-text';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AlertParentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: User;
  group: Group;
}

export const AlertParentDialog = ({ open, onOpenChange, student, group }: AlertParentDialogProps) => {
  const [parentEmail, setParentEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const { isListening, startListening, stopListening, hasRecognitionSupport } = useSpeechToText({
    onResult: (transcript) => {
      setMessage(prev => prev ? `${prev} ${transcript}` : transcript);
    },
  });

  useEffect(() => {
    if (!open) {
      setParentEmail('');
      setMessage('');
      setIsSending(false);
      if (isListening) {
        stopListening();
      }
    }
  }, [open, isListening, stopListening]);

  const handleSendEmail = async () => {
    if (!parentEmail || !message) {
      toast.error('Por favor, complete el correo del padre/tutor y el mensaje.');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(parentEmail)) {
        toast.error('Por favor, ingrese un correo electrónico válido.');
        return;
    }

    setIsSending(true);
    try {
        const { error } = await supabase.functions.invoke('send-parent-alert', {
            body: {
                studentName: student.name,
                groupName: group.name,
                parentEmail,
                message,
            },
        });

        if (error) throw error;

        toast.success('Correo enviado exitosamente al padre/tutor.');
        onOpenChange(false);
    } catch (error: any) {
        console.error('Failed to send parent alert:', error);
        toast.error('Error al enviar el correo. Por favor, intente de nuevo.');
    } finally {
        setIsSending(false);
    }
  };

  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Enviar Comunicado a Padres/Tutores</DialogTitle>
          <DialogDescription>
            Redacte un mensaje para los padres o tutores de {student.name}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="parent-email" className="text-right">
              Email Padre/Tutor
            </Label>
            <Input
              id="parent-email"
              type="email"
              value={parentEmail}
              onChange={(e) => setParentEmail(e.target.value)}
              className="col-span-3"
              placeholder="correo@ejemplo.com"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="message">Mensaje</Label>
            <div className="relative">
                <Textarea
                    id="message"
                    placeholder="Escriba su mensaje aquí o use el dictado por voz."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={6}
                />
                {hasRecognitionSupport && (
                    <Button
                        size="icon"
                        variant={isListening ? 'destructive' : 'secondary'}
                        className="absolute bottom-2 right-2 h-7 w-7"
                        onClick={handleToggleListening}
                        title={isListening ? 'Detener dictado' : 'Iniciar dictado'}
                    >
                        {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                        <span className="sr-only">{isListening ? 'Detener dictado' : 'Iniciar dictado'}</span>
                    </Button>
                )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancelar
            </Button>
          </DialogClose>
          <Button onClick={handleSendEmail} disabled={isSending || !parentEmail || !message}>
            {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enviar Mensaje
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
