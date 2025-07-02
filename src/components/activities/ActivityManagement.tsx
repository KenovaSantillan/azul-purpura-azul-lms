
import React, { useState } from 'react';
import { useActivities } from '@/contexts/ActivityContext';
import { useLMS } from '@/contexts/LMSContext';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Calendar, FileText, ArrowLeftRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateActivityDialog } from './CreateActivityDialog';
import { EditActivityDialog } from './EditActivityDialog';
import { DeleteActivityDialog } from './DeleteActivityDialog';
import { MoveResourcesDialog } from './MoveResourcesDialog';
import { Activity } from '@/types/activity';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const ActivityManagement = () => {
  const { activities, loadingActivities } = useActivities();
  const { groups } = useLMS();
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [selectedUnit, setSelectedUnit] = useState<string>(''); // Filtro por unidad
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activityToEdit, setActivityToEdit] = useState<Activity | null>(null);
  const [activityToDelete, setActivityToDelete] = useState<Activity | null>(null);
  const [isMoveResourcesOpen, setIsMoveResourcesOpen] = useState(false);

  const filteredActivities = activities.filter(activity => {
    const matchesGroup = !selectedGroupId || activity.group_id === selectedGroupId;
    const matchesUnit = !selectedUnit || activity.unit.toString() === selectedUnit;
    return matchesGroup && matchesUnit;
  });

  const selectedGroup = groups.find(g => g.id === selectedGroupId);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: es });
    } catch {
      return 'Sin fecha';
    }
  };

  return (
    <div className="p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestión de Actividades</h1>
          <p className="text-muted-foreground">
            {selectedGroup 
              ? `Actividades del grupo: ${selectedGroup.name}`
              : 'Administra las actividades de todos los grupos'
            }
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsMoveResourcesOpen(true)}>
            <ArrowLeftRight className="mr-2 h-4 w-4" />
            Mover Archivos
          </Button>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Actividad
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <Label htmlFor="group-select">Filtrar por Grupo</Label>
          <Select value={selectedGroupId} onValueChange={setSelectedGroupId}>
            <SelectTrigger>
              <SelectValue placeholder="Todos los grupos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos los grupos</SelectItem>
              {groups.filter(g => g.status !== 'archived').map(group => (
                <SelectItem key={group.id} value={group.id}>
                  {group.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit-select">Filtrar por Unidad</Label>
          <Select value={selectedUnit} onValueChange={setSelectedUnit}>
            <SelectTrigger>
              <SelectValue placeholder="Todas las unidades" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas las unidades</SelectItem>
              <SelectItem value="1">Unidad 1</SelectItem>
              <SelectItem value="2">Unidad 2</SelectItem>
              <SelectItem value="3">Unidad 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loadingActivities ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Cargando actividades...</p>
        </div>
      ) : filteredActivities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((activity, index) => {
            const activityGroup = groups.find(g => g.id === activity.group_id);
            return (
              <Card key={activity.id} className="animate-scale-in" style={{animationDelay: `${index * 100}ms`}}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">
                          #{activity.activity_number} - {activity.name}
                        </CardTitle>
                        <Badge variant="outline" className="text-xs">
                          Unidad {activity.unit}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {activityGroup?.name || 'Grupo no encontrado'}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setActivityToEdit(activity)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setActivityToDelete(activity)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {activity.development && (
                    <div className="flex items-start gap-2">
                      <FileText className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <p className="text-sm">{activity.development}</p>
                    </div>
                  )}
                  
                  {activity.deliverable && (
                    <div>
                      <p className="text-sm font-medium">Entregable:</p>
                      <p className="text-sm text-muted-foreground">{activity.deliverable}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    {activity.score && (
                      <Badge variant="secondary">
                        {activity.score} pts
                      </Badge>
                    )}
                    
                    {activity.due_date && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDate(activity.due_date)}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge variant={activity.allow_late_submissions ? "default" : "destructive"}>
                      {activity.allow_late_submissions ? "Acepta tardías" : "No acepta tardías"}
                    </Badge>
                  </div>

                  {(activity.extra_materials.length > 0 || activity.links.length > 0) && (
                    <div className="pt-2 border-t">
                      {activity.extra_materials.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                          {activity.extra_materials.length} material(es) extra
                        </p>
                      )}
                      {activity.links.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                          {activity.links.length} enlace(s)
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          {selectedGroupId || selectedUnit
            ? `No hay actividades para los filtros seleccionados.`
            : 'No hay actividades disponibles. Crea tu primera actividad.'
          }
        </div>
      )}

      <CreateActivityDialog
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        preselectedGroupId={selectedGroupId}
      />

      <EditActivityDialog
        activity={activityToEdit}
        isOpen={!!activityToEdit}
        onOpenChange={(isOpen) => !isOpen && setActivityToEdit(null)}
      />

      <DeleteActivityDialog
        activity={activityToDelete}
        isOpen={!!activityToDelete}
        onOpenChange={(isOpen) => !isOpen && setActivityToDelete(null)}
      />

      <MoveResourcesDialog
        isOpen={isMoveResourcesOpen}
        onOpenChange={setIsMoveResourcesOpen}
      />
    </div>
  );
};

export default ActivityManagement;
