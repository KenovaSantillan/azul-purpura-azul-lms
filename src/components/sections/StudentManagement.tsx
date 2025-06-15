
import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const students = [
  { id: 1, controlNumber: '21345', lastName: 'González Pérez', firstName: 'Juan Carlos', group: '5°A Programación', activities: 'Act. 1 (10%), Act. 2 (15%)' },
  { id: 2, controlNumber: '21390', lastName: 'Hernández García', firstName: 'Mariana', group: '5°A Programación', activities: 'Act. 1 (10%), Act. 2 (15%)' },
  { id: 3, controlNumber: '21401', lastName: 'Martínez López', firstName: 'Sofía', group: '5°A Programación', activities: 'Act. 1 (10%), Act. 2 (15%)' },
  { id: 4, controlNumber: '21415', lastName: 'Ramírez Sánchez', firstName: 'Diego', group: '5°A Programación', activities: 'Act. 1 (10%), Act. 2 (15%)' },
];

const StudentManagement = () => (
  <div className="p-6 animate-fade-in space-y-6">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold">Gestión de Estudiantes</h1>
        <p className="text-muted-foreground">Administra la información y el progreso de los estudiantes.</p>
      </div>
      <Button>
        <FileUp className="mr-2 h-4 w-4" />
        Agregar Alumnos (PDF)
      </Button>
    </div>
    
    <Card>
      <CardHeader>
        <CardTitle>Lista de Alumnos</CardTitle>
        <CardDescription>Estudiantes activos en la plataforma.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N° Control</TableHead>
                <TableHead>Apellidos</TableHead>
                <TableHead>Nombres</TableHead>
                <TableHead>Grupo</TableHead>
                <TableHead className="text-right">Actividades (Ponderación)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.controlNumber}</TableCell>
                  <TableCell>{student.lastName}</TableCell>
                  <TableCell>{student.firstName}</TableCell>
                  <TableCell>{student.group}</TableCell>
                  <TableCell className="text-right">{student.activities}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default StudentManagement;
