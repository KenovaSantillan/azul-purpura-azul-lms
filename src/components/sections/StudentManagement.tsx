
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileUp, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell, Tooltip } from "recharts";
import { ChartContainer, ChartConfig } from "@/components/ui/chart";
import { useLMS } from '@/contexts/LMSContext';
import { User } from '@/types/lms';
import { AlertTutorDialog } from './AlertTutorDialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

const chartConfig = {
  ponderacion: {
    label: 'Ponderación',
  },
} satisfies ChartConfig;

const StudentManagement = () => {
  const { groups, users } = useLMS();
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);

  // NOTA: Para este ejemplo, usamos el primer grupo. En una aplicación real, se necesitaría un selector de grupo.
  const currentGroup = groups.length > 0 ? groups[0] : null;
  const students = currentGroup?.students || [];
  const tutor = currentGroup ? users.find(u => u.id === currentGroup.tutorId) : null;
  
  const handleAlertClick = (student: User) => {
    if (!tutor) {
      toast.error("El grupo no tiene un tutor asignado para enviarle alertas.");
      return;
    }
    setSelectedStudent(student);
    setIsAlertDialogOpen(true);
  };

  const studentDataForChart = students.map(student => ({
    ...student,
    // TODO: La ponderación debe venir de los datos del alumno, por ahora es aleatoria
    ponderacion: Math.floor(Math.random() * (100 - 50 + 1) + 50) 
  }));

  if (!currentGroup) {
    return (
        <div className="p-6">
            <Alert>
                <AlertDescription>No hay grupos disponibles. Por favor, crea un grupo para gestionar estudiantes.</AlertDescription>
            </Alert>
        </div>
    );
  }

  return (
    <div className="p-6 animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Estudiantes</h1>
          <p className="text-muted-foreground">Administra la información y el progreso de los estudiantes del grupo: <span className="font-semibold">{currentGroup.name}</span></p>
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
                  <TableHead>N° Control (ID)</TableHead>
                  <TableHead>Nombre Completo</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.id}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.role}</TableCell>
                    <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleAlertClick(student)}>
                            <Mail className="h-4 w-4" />
                            <span className="sr-only">Enviar Alerta</span>
                        </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ponderación de Alumnos</CardTitle>
          <CardDescription>Gráfica de barras de la ponderación de los alumnos.</CardDescription>
        </CardHeader>
        <CardContent className="pb-4">
          <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
            <BarChart data={studentDataForChart} accessibilityLayer>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.split(' ')[0].slice(0, 7)}
              />
              <YAxis domain={[0, 100]} unit="%" />
              <Tooltip
                cursor={{ fill: 'hsl(var(--muted))', radius: 4 }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="flex flex-col gap-1">
                          <span className="font-bold">{data.name}</span>
                          <span className="text-sm text-muted-foreground">
                            Ponderación: <span className="font-mono font-medium text-foreground">{data.ponderacion}%</span>
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="ponderacion" radius={4}>
                {studentDataForChart.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${index + 1}))`} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      
      {selectedStudent && currentGroup && tutor && (
        <AlertTutorDialog
            open={isAlertDialogOpen}
            onOpenChange={setIsAlertDialogOpen}
            student={selectedStudent}
            group={currentGroup}
            tutor={tutor}
        />
      )}
    </div>
  );
};

export default StudentManagement;
