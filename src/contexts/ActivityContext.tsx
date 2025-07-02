
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Activity, CreateActivityData } from '@/types/activity';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useUser } from '@/contexts/UserContext';

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
  const { currentUser } = useUser();

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
      
      // Convert database Json types to string[] for TypeScript compatibility
      const convertedData = (data || []).map(activity => ({
        ...activity,
        extra_materials: Array.isArray(activity.extra_materials) ? activity.extra_materials as string[] : [],
        links: Array.isArray(activity.links) ? activity.links as string[] : []
      }));
      
      setActivities(convertedData);
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast.error('Error al cargar las actividades');
    } finally {
      setLoadingActivities(false);
    }
  };

  const createActivity = async (activityData: CreateActivityData): Promise<Activity | null> => {
    try {
      if (!currentUser?.id) {
        toast.error('No se puede crear la actividad. Usuario no autenticado.');
        return null;
      }

      // Get next activity number
      const { data: nextNumberData, error: numberError } = await supabase
        .rpc('get_next_activity_number');

      if (numberError) throw numberError;

      const { data, error } = await supabase
        .from('activities')
        .insert({
          ...activityData,
          activity_number: nextNumberData,
          created_by: currentUser.id,
          extra_materials: activityData.extra_materials,
          links: activityData.links,
        })
        .select()
        .single();

      if (error) throw error;

      // Convert the response to match our Activity type
      const convertedActivity = {
        ...data,
        extra_materials: Array.isArray(data.extra_materials) ? data.extra_materials as string[] : [],
        links: Array.isArray(data.links) ? data.links as string[] : []
      };

      setActivities(prev => [...prev, convertedActivity]);
      toast.success(`Actividad "${data.name}" creada exitosamente`);
      return convertedActivity;
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

      // Convert the response to match our Activity type
      const convertedActivity = {
        ...data,
        extra_materials: Array.isArray(data.extra_materials) ? data.extra_materials as string[] : [],
        links: Array.isArray(data.links) ? data.links as string[] : []
      };

      setActivities(prev => prev.map(activity => 
        activity.id === id ? convertedActivity : activity
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
