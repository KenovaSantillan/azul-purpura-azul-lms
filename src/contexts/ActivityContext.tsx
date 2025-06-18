
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Activity, CreateActivityData } from '@/types/activity';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ActivityContextType {
  activities: Activity[];
  loadingActivities: boolean;
  createActivity: (activityData: CreateActivityData) => Promise<Activity | null>;
  updateActivity: (id: string, updates: Partial<Activity>) => Promise<void>;
  deleteActivity: (id: string) => Promise<void>;
  getActivitiesByGroup: (groupId: string) => Activity[];
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export function ActivityProvider({ children }: { children: React.ReactNode }) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('activity_number', { ascending: true });

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast.error('Error al cargar las actividades');
    } finally {
      setLoadingActivities(false);
    }
  };

  const createActivity = async (activityData: CreateActivityData): Promise<Activity | null> => {
    try {
      // Get next activity number
      const { data: nextNumberData, error: numberError } = await supabase
        .rpc('get_next_activity_number');

      if (numberError) throw numberError;

      const { data, error } = await supabase
        .from('activities')
        .insert({
          ...activityData,
          activity_number: nextNumberData,
        })
        .select()
        .single();

      if (error) throw error;

      setActivities(prev => [...prev, data]);
      toast.success(`Actividad "${data.name}" creada exitosamente`);
      return data;
    } catch (error) {
      console.error('Error creating activity:', error);
      toast.error('Error al crear la actividad');
      return null;
    }
  };

  const updateActivity = async (id: string, updates: Partial<Activity>) => {
    try {
      const { data, error } = await supabase
        .from('activities')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setActivities(prev => prev.map(activity => 
        activity.id === id ? data : activity
      ));
      toast.success('Actividad actualizada exitosamente');
    } catch (error) {
      console.error('Error updating activity:', error);
      toast.error('Error al actualizar la actividad');
    }
  };

  const deleteActivity = async (id: string) => {
    try {
      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setActivities(prev => prev.filter(activity => activity.id !== id));
      toast.success('Actividad eliminada exitosamente');
    } catch (error) {
      console.error('Error deleting activity:', error);
      toast.error('Error al eliminar la actividad');
    }
  };

  const getActivitiesByGroup = (groupId: string): Activity[] => {
    return activities.filter(activity => activity.group_id === groupId);
  };

  const value = {
    activities,
    loadingActivities,
    createActivity,
    updateActivity,
    deleteActivity,
    getActivitiesByGroup,
  };

  return (
    <ActivityContext.Provider value={value}>
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivities() {
  const context = useContext(ActivityContext);
  if (context === undefined) {
    throw new Error('useActivities must be used within an ActivityProvider');
  }
  return context;
}
