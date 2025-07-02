
import React, { useState, useEffect } from 'react';
import { useActivities } from '@/contexts/ActivityContext';
import { useLMS } from '@/contexts/LMSContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { Activity } from '@/types/activity';

interface EditActivityDialogProps {
  activity: Activity | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const EditActivityDialog = ({ activity, isOpen, onOpenChange }: EditActivityDialogProps) => {
  const { updateActivity } = useActivities();
  const { groups } = useLMS();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    development: '',
    deliverable: '',
    score: undefined as number | undefined,
    due_date: '',
    allow_late_submissions: true,
    extra_materials: [] as string[],
    links: [] as string[],
    group_id: '',
    unit: 1, // Valor por defecto: Unidad 1
  });

  const [newMaterial, setNewMaterial] = useState('');
  const [newLink, setNewLink] = useState('');

  useEffect(() => {
    if (activity) {
      setFormData({
        name: activity.name,
        development: activity.development || '',
        deliverable: activity.deliverable || '',
        score: activity.score || undefined,
        due_date: activity.due_date ? new Date(activity.due_date).toISOString().slice(0, 16) : '',
        allow_late_submissions: activity.allow_late_submissions,
        extra_materials: [...activity.extra_materials],
        links: [...activity.links],
        group_id: activity.group_id,
        unit: activity.unit || 1, // Usar la unidad de la actividad o por defecto 1
      });
    }
  }, [activity]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activity || !formData.name.trim()) return;

    setIsSubmitting(true);
    try {
      const updates = {
        name: formData.name.trim(),
        development: formData.development?.trim() || null,
        deliverable: formData.deliverable?.trim() || null,
        score: formData.score || null,
        due_date: formData.due_date || null,
        allow_late_submissions: formData.allow_late_submissions,
        extra_materials: formData.extra_materials,
        links: formData.links,
        group_id: formData.group_id,
        unit: formData.unit, // Incluir la unidad en la actualización
      };

      await updateActivity(activity.id, updates);
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating activity:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addMaterial = () => {
    if (newMaterial.trim()) {
      setFormData(prev => ({
        ...prev,
        extra_materials: [...prev.extra_materials, newMaterial.trim()]
      }));
      setNewMaterial('');
    }
  };

  const removeMaterial = (index: number) => {
    setFormData(prev => ({
      ...prev,
      extra_materials: prev.extra_materials.filter((_, i) => i !== index)
    }));
  };

  const addLink = () => {
    if (newLink.trim()) {
      setFormData(prev => ({
        ...prev,
        links: [...prev.links, newLink.trim()]
      }));
      setNewLink('');
    }
  };

  const removeLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index)
    }));
  };

  if (!activity) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Actividad #{activity.activity_number}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="group">Grupo *</Label>
              <Select
                value={formData.group_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, group_id: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar grupo" />
                </SelectTrigger>
                <SelectContent>
                  {groups.filter(g => g.status !== 'archived').map(group => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nombre de la Actividad *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="development">Desarrollo</Label>
            <Textarea
              id="development"
              value={formData.development}
              onChange={(e) => setFormData(prev => ({ ...prev, development: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deliverable">Entregable</Label>
            <Textarea
              id="deliverable"
              value={formData.deliverable}
              onChange={(e) => setFormData(prev => ({ ...prev, deliverable: e.target.value }))}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="score">Puntaje</Label>
              <Input
                id="score"
                type="number"
                min="0"
                step="0.1"
                value={formData.score || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  score: e.target.value ? parseFloat(e.target.value) : undefined 
                }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unidad *</Label>
              <Select
                value={formData.unit.toString()}
                onValueChange={(value) => setFormData(prev => ({ ...prev, unit: parseInt(value) }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar unidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Unidad 1</SelectItem>
                  <SelectItem value="2">Unidad 2</SelectItem>
                  <SelectItem value="3">Unidad 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="due_date">Fecha de Entrega</Label>
              <Input
                id="due_date"
                type="datetime-local"
                value={formData.due_date}
                onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="allow_late_submissions"
              checked={formData.allow_late_submissions}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, allow_late_submissions: checked }))}
            />
            <Label htmlFor="allow_late_submissions">Permitir entregas tardías</Label>
          </div>

          <div className="space-y-3">
            <Label>Materiales Extra</Label>
            <div className="flex gap-2">
              <Input
                value={newMaterial}
                onChange={(e) => setNewMaterial(e.target.value)}
                placeholder="Agregar material..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMaterial())}
              />
              <Button type="button" onClick={addMaterial} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.extra_materials.map((material, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {material}
                  <button
                    type="button"
                    onClick={() => removeMaterial(index)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Enlaces</Label>
            <div className="flex gap-2">
              <Input
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                placeholder="https://ejemplo.com"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLink())}
              />
              <Button type="button" onClick={addLink} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.links.map((link, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {link.length > 30 ? `${link.substring(0, 30)}...` : link}
                  <button
                    type="button"
                    onClick={() => removeLink(index)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || !formData.name.trim()}>
              {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
