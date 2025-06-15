
import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell, Tooltip } from "recharts";
import { ChartContainer, ChartConfig } from "@/components/ui/chart";

const students = [
  { id: 1, controlNumber: '21345', lastName: 'González Pérez', firstName: 'Juan Carlos', group: '5°A Programación', activities: 'Act. 1 (10%), Act. 2 (15%)', ponderacion: 85 },
  { id: 2, controlNumber: '21390', lastName: 'Hernández García', firstName: 'Mariana', group: '5°A Programación', activities: 'Act. 1 (10%), Act. 2 (15%)', ponderacion: 92 },
  { id: 3, controlNumber: '21401', lastName: 'Martínez López', firstName: 'Sofía', group: '5°A Programación', activities: 'Act. 1 (10%), Act. 2 (15%)', ponderacion: 78 },
  { id: 4, controlNumber: '21415', lastName: 'Ramírez Sánchez', firstName: 'Diego', group: '5°A Programación', activities: 'Act. 1 (10%), Act. 2 (15%)', ponderacion: 88 },
  { id: 5, controlNumber: '21420', lastName: 'López Hernández', firstName: 'Valeria', group: '5°A Programación', activities: 'Act. 1 (10%), Act. 2 (15%)', ponderacion: 95 },
];

const chartConfig = {
  ponderacion: {
    label: 'Ponderación',
  },
} satisfies ChartConfig;

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

    <Card>
      <CardHeader>
        <CardTitle>Ponderación de Alumnos</CardTitle>
        <CardDescription>Gráfica de barras de la ponderación de los alumnos.</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <BarChart data={students} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="firstName"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3) + '.'}
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
                        <span className="font-bold">
                          {data.firstName} {data.lastName}
                        </span>
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
              {students.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${index + 1}))`} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  </div>
);

export default StudentManagement;
