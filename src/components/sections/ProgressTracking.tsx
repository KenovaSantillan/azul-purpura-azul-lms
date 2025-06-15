
import { useState, useMemo } from 'react';
import { useLMS } from '@/contexts/LMSContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@/types/lms';
import { StudentProgress } from '@/types/lms';

interface ProgressDisplayProps {
  student: User;
  progress: StudentProgress | null;
}

const StudentProgressCard = ({ student, progress }: ProgressDisplayProps) => {
  const completionPercentage = progress && progress.totalTasks > 0
    ? Math.round((progress.completedTasks / progress.totalTasks) * 100)
    : 0;
  
  const averageGrade = progress?.grade ?? 0;

  return (
    <Card className="animate-scale-in">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar>
          <AvatarImage src={student.avatar} alt={student.name} />
          <AvatarFallback>{student.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-lg">{student.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Tareas Completadas</span>
            <strong>{progress?.completedTasks ?? 0}/{progress?.totalTasks ?? 0}</strong>
          </div>
          <Progress value={completionPercentage} />
          <div className="flex justify-between pt-1">
            <span>Promedio</span>
            <strong className="text-primary">{averageGrade}/100</strong>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


const ProgressTracking = () => {
  const { groups, getStudentProgress } = useLMS();
  const [selectedGroupId, setSelectedGroupId] = useState<string | undefined>(groups.length > 0 ? groups[0].id : undefined);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('all');

  const selectedGroup = useMemo(() => {
    if (!selectedGroupId) return null;
    return groups.find(g => g.id === selectedGroupId);
  }, [selectedGroupId, groups]);

  const studentsInGroup = useMemo(() => {
    return selectedGroup ? selectedGroup.students : [];
  }, [selectedGroup]);

  const handleGroupChange = (groupId: string) => {
    setSelectedGroupId(groupId);
    setSelectedStudentId('all'); // Reset student filter when group changes
  };

  const progressData = useMemo(() => {
    if (!selectedGroup) return [];

    const studentsToDisplay = selectedStudentId === 'all'
      ? studentsInGroup
      : studentsInGroup.filter(s => s.id === selectedStudentId);

    return studentsToDisplay.map(student => {
      const progress = getStudentProgress(student.id, selectedGroup.id);
      return {
        student,
        progress
      };
    });
  }, [selectedGroup, selectedStudentId, studentsInGroup, getStudentProgress]);

  return (
    <div className="p-6 animate-fade-in">
      <h1 className="text-3xl font-bold mb-4">Seguimiento de Progreso</h1>
      <p className="text-muted-foreground mb-6">Monitoreo del rendimiento académico por estudiante.</p>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 border rounded-lg bg-card">
        <div className="flex-1">
          <label htmlFor="group-select" className="text-sm font-medium mb-2 block">Grupo</label>
          <Select onValueChange={handleGroupChange} value={selectedGroupId}>
            <SelectTrigger id="group-select">
              <SelectValue placeholder="Seleccione un grupo" />
            </SelectTrigger>
            <SelectContent>
              {groups.map(group => (
                <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <label htmlFor="student-select" className="text-sm font-medium mb-2 block">Estudiante</label>
          <Select onValueChange={setSelectedStudentId} value={selectedStudentId} disabled={!selectedGroupId}>
            <SelectTrigger id="student-select">
              <SelectValue placeholder="Seleccione un estudiante" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estudiantes</SelectItem>
              {studentsInGroup.map(student => (
                <SelectItem key={student.id} value={student.id}>{student.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {selectedGroupId ? (
        progressData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {progressData.map(({ student, progress }) => (
              <StudentProgressCard key={student.id} student={student} progress={progress} />
            ))}
          </div>
        ) : (
          <Card className="mt-8">
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">No hay datos de progreso para mostrar en la selección actual.</p>
            </CardContent>
          </Card>
        )
      ) : (
        <Card className="mt-8">
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">Por favor, seleccione un grupo para ver el progreso.</p>
            </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProgressTracking;
