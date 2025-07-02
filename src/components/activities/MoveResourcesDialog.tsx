import React, { useState } from 'react';
import { useActivities } from '@/contexts/ActivityContext';
import { useLMS } from '@/contexts/LMSContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Activity } from '@/types/activity';
import { ArrowRight, File, Link } from 'lucide-react';

interface MoveResourcesDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const MoveResourcesDialog = ({ isOpen, onOpenChange }: MoveResourcesDialogProps) => {
  const { activities, updateActivity } = useActivities();
  const { groups } = useLMS();
  const [sourceActivityId, setSourceActivityId] = useState<string>('');
  const [targetActivityId, setTargetActivityId] = useState<string>('');
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedLinks, setSelectedLinks] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sourceActivity = activities.find(a => a.id === sourceActivityId);
  const targetActivity = activities.find(a => a.id === targetActivityId);

  const handleMaterialToggle = (material: string) => {
    setSelectedMaterials(prev => 
      prev.includes(material) 
        ? prev.filter(m => m !== material)
        : [...prev, material]
    );
  };

  const handleLinkToggle = (link: string) => {
    setSelectedLinks(prev => 
      prev.includes(link) 
        ? prev.filter(l => l !== link)
        : [...prev, link]
    );
  };

  const handleMove = async () => {
    if (!sourceActivity || !targetActivity || (!selectedMaterials.length && !selectedLinks.length)) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Update source activity - remove selected items
      const updatedSourceMaterials = sourceActivity.extra_materials.filter(
        material => !selectedMaterials.includes(material)
      );
      const updatedSourceLinks = sourceActivity.links.filter(
        link => !selectedLinks.includes(link)
      );

      // Update target activity - add selected items
      const updatedTargetMaterials = [...targetActivity.extra_materials, ...selectedMaterials];
      const updatedTargetLinks = [...targetActivity.links, ...selectedLinks];

      // Update both activities
      await Promise.all([
        updateActivity(sourceActivity.id, {
          extra_materials: updatedSourceMaterials,
          links: updatedSourceLinks
        }),
        updateActivity(targetActivity.id, {
          extra_materials: updatedTargetMaterials,
          links: updatedTargetLinks
        })
      ]);

      // Reset form
      setSourceActivityId('');
      setTargetActivityId('');
      setSelectedMaterials([]);
      setSelectedLinks([]);
      onOpenChange(false);
    } catch (error) {
      console.error('Error moving resources:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canMove = sourceActivity && targetActivity && 
    sourceActivityId !== targetActivityId && 
    (selectedMaterials.length > 0 || selectedLinks.length > 0);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Mover Archivos Entre Actividades</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Actividad de Origen</Label>
              <Select value={sourceActivityId} onValueChange={setSourceActivityId}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar actividad origen" />
                </SelectTrigger>
                <SelectContent>
                  {activities.map(activity => {
                    const group = groups.find(g => g.id === activity.group_id);
                    return (
                      <SelectItem key={activity.id} value={activity.id}>
                        #{activity.activity_number} - {activity.name} ({group?.name})
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Actividad de Destino</Label>
              <Select value={targetActivityId} onValueChange={setTargetActivityId}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar actividad destino" />
                </SelectTrigger>
                <SelectContent>
                  {activities
                    .filter(activity => activity.id !== sourceActivityId)
                    .map(activity => {
                      const group = groups.find(g => g.id === activity.group_id);
                      return (
                        <SelectItem key={activity.id} value={activity.id}>
                          #{activity.activity_number} - {activity.name} ({group?.name})
                        </SelectItem>
                      );
                    })}
                </SelectContent>
              </Select>
            </div>
          </div>

          {sourceActivity && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Actividad #{sourceActivity.activity_number} - {sourceActivity.name}</span>
                <ArrowRight className="h-4 w-4" />
                <span>{targetActivity ? `Actividad #${targetActivity.activity_number} - ${targetActivity.name}` : 'Selecciona destino'}</span>
              </div>

              {sourceActivity.extra_materials.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <File className="h-4 w-4" />
                    <Label className="text-sm font-medium">Materiales Extra</Label>
                  </div>
                  <div className="space-y-2 pl-6">
                    {sourceActivity.extra_materials.map((material, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Checkbox
                          id={`material-${index}`}
                          checked={selectedMaterials.includes(material)}
                          onCheckedChange={() => handleMaterialToggle(material)}
                        />
                        <Badge variant="secondary" className="text-xs">
                          {material}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {sourceActivity.links.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Link className="h-4 w-4" />
                    <Label className="text-sm font-medium">Enlaces</Label>
                  </div>
                  <div className="space-y-2 pl-6">
                    {sourceActivity.links.map((link, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Checkbox
                          id={`link-${index}`}
                          checked={selectedLinks.includes(link)}
                          onCheckedChange={() => handleLinkToggle(link)}
                        />
                        <Badge variant="secondary" className="text-xs">
                          {link.length > 50 ? `${link.substring(0, 50)}...` : link}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {sourceActivity.extra_materials.length === 0 && sourceActivity.links.length === 0 && (
                <p className="text-sm text-muted-foreground italic">
                  Esta actividad no tiene materiales extra ni enlaces para mover.
                </p>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleMove} 
              disabled={!canMove || isSubmitting}
            >
              {isSubmitting ? 'Moviendo...' : 'Mover Recursos'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};