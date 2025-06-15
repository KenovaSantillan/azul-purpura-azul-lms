
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLMS } from '@/contexts/LMSContext';
import { useUser } from '@/contexts/UserContext';
import { User, UserRole } from '@/types/lms';
import { toast } from 'sonner';
import { FileUp, Loader2 } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

// Configura el worker para procesar el PDF. Usamos un CDN para simplicidad.
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface AddStudentsFormProps {
  groupId: string;
  onFinished: () => void;
}

export default function AddStudentsForm({ groupId, onFinished }: AddStudentsFormProps) {
  const { addUsersToGroup } = useLMS();
  const { createUser } = useUser();
  const [studentList, setStudentList] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddStudents = async () => {
    if (!studentList.trim()) {
      toast.info('La lista de estudiantes está vacía. Finalizando sin agregar alumnos.');
      onFinished();
      return;
    }

    setIsCreating(true);
    try {
      const lines = studentList.trim().split('\n');
      const studentsToCreate = lines.map(line => {
        const parts = line.split(',').map(p => p.trim());
        if (parts.length < 3) {
          throw new Error(`Línea inválida, se esperan 3 partes (N° Control, Apellidos, Nombres): "${line}"`);
        }
        const [id, lastNames, firstNames] = parts;
        return {
          first_name: firstNames,
          last_name: lastNames,
          email: `${id}@estudiante.kenova.edu`,
          role: 'student' as UserRole,
        };
      });

      const results = await Promise.allSettled(
        studentsToCreate.map(student => createUser(student))
      );
      
      const createdUsers: User[] = [];
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          createdUsers.push(result.value);
        } else {
          toast.error(`Error al crear ${studentsToCreate[index].email}: ${result.reason.message}`);
          console.error(`Error creando estudiante ${studentsToCreate[index].email}:`, result.reason);
        }
      });

      if (createdUsers.length > 0) {
        addUsersToGroup(groupId, createdUsers.map(u => u.id));
        toast.success(`${createdUsers.length} de ${studentsToCreate.length} estudiantes procesados exitosamente.`);
      }
      
      onFinished();
    } catch (error: any) {
      toast.error(`Error al procesar la lista: ${error.message}`);
    } finally {
        setIsCreating(false);
    }
  };

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
        toast.error('Por favor, selecciona un archivo PDF válido.');
        return;
    }

    setIsParsing(true);
    toast.info('Procesando el archivo PDF...');

    try {
        const fileReader = new FileReader();
        fileReader.onload = async function() {
            try {
                const typedarray = new Uint8Array(this.result as ArrayBuffer);
                const pdf = await pdfjsLib.getDocument(typedarray).promise;
                let fullText = '';
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    // Tip: la extracción de texto de un PDF no es perfecta, el formato puede variar.
                    const pageText = textContent.items.map((item: any) => item.str).join(' ');
                    fullText += pageText.replace(/\s+/g, ' ').trim() + '\n';
                }
                
                const cleanedText = fullText
                    .split('\n')
                    .map(line => line.trim())
                    .filter(line => line.length > 0)
                    .join('\n');

                setStudentList(cleanedText);
                toast.success('PDF procesado. Revisa la lista y haz clic en "Agregar" para finalizar.');
            } catch (error: any) {
                 toast.error(`Error al leer el PDF: ${error.message}`);
                 console.error("Error parsing PDF:", error);
            } finally {
                setIsParsing(false);
            }
        };
        fileReader.readAsArrayBuffer(file);
    } catch (error: any) {
        toast.error(`Error al cargar el archivo: ${error.message}`);
        setIsParsing(false);
    } finally {
        // Reset file input para permitir subir el mismo archivo de nuevo
        if(event.target) {
            event.target.value = '';
        }
    }
  };


  return (
    <div className="space-y-4 py-4">
      <div>
        <p className="text-sm text-muted-foreground mb-2">
          Puedes agregar estudiantes pegando una lista en el formato: <br />
          <code className="bg-muted px-1 py-0.5 rounded">N° Control, Apellidos, Nombres</code> (un estudiante por línea), o subiendo un PDF con la lista.
        </p>
        <Label htmlFor="student-list">Pegar lista de estudiantes o subir PDF</Label>
        <Textarea
          id="student-list"
          value={studentList}
          onChange={(e) => setStudentList(e.target.value)}
          placeholder="12345,Perez Garcia,Juan&#10;67890,Lopez Martinez,Maria"
          rows={10}
          disabled={isCreating || isParsing}
        />
      </div>
       <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="application/pdf"
        disabled={isCreating || isParsing}
      />
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={handleFileUploadClick} disabled={isCreating || isParsing}>
          {isParsing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileUp className="mr-2 h-4 w-4" />}
          {isParsing ? 'Procesando PDF...' : 'Subir lista (PDF)'}
        </Button>
        <Button onClick={handleAddStudents} disabled={isCreating || isParsing} className="bg-lms-purple-500 hover:bg-lms-purple-600">
          {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isCreating ? 'Agregando Estudiantes...' : 'Agregar Estudiantes y Finalizar'}
        </Button>
      </div>
    </div>
  );
}
