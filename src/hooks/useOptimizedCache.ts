
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export const useOptimizedCache = () => {
  const queryClient = useQueryClient();
  const location = useLocation();

  const prefetchData = useCallback(async (queryKey: string[], queryFn: () => Promise<any>) => {
    // Check if data already exists in cache
    const existingData = queryClient.getQueryData(queryKey);
    if (existingData) return;

    await queryClient.prefetchQuery({
      queryKey,
      queryFn,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes garbage collection
    });
  }, [queryClient]);

  const invalidateQueries = useCallback((queryKey: string[]) => {
    queryClient.invalidateQueries({ queryKey });
  }, [queryClient]);

  const updateCache = useCallback((queryKey: string[], updateFn: (oldData: any) => any) => {
    queryClient.setQueryData(queryKey, updateFn);
  }, [queryClient]);

  const optimisticUpdate = useCallback((
    queryKey: string[],
    updateFn: (oldData: any) => any,
    rollbackFn?: (oldData: any) => any
  ) => {
    const previousData = queryClient.getQueryData(queryKey);
    
    queryClient.setQueryData(queryKey, updateFn);
    
    return {
      rollback: () => {
        if (rollbackFn) {
          queryClient.setQueryData(queryKey, rollbackFn);
        } else {
          queryClient.setQueryData(queryKey, previousData);
        }
      }
    };
  }, [queryClient]);

  // Memoize route-based prefetch logic
  const prefetchRoutes = useMemo(() => ({
    auth: [],
    dashboard: ['groups', 'tasks', 'announcements'],
    groups: ['users'],
    tasks: ['users', 'groups'],
    announcements: ['groups'],
  }), []);

  // Auto-prefetch related data based on current route
  useEffect(() => {
    const prefetchRelatedData = async () => {
      const path = location.pathname;
      
      // Extract route name
      const routeName = path.split('/')[1] || 'dashboard';
      const routesToPrefetch = prefetchRoutes[routeName as keyof typeof prefetchRoutes] || [];

      // Prefetch user data on any authenticated route
      if (path !== '/auth') {
        prefetchData(['currentUserProfile'], async () => null);
      }

      // Route-specific prefetching with debouncing
      routesToPrefetch.forEach(route => {
        prefetchData([route], async () => null);
      });
    };

    const timeoutId = setTimeout(prefetchRelatedData, 100);
    return () => clearTimeout(timeoutId);
  }, [location.pathname, prefetchData, prefetchRoutes]);

  const clearCache = useCallback(() => {
    queryClient.clear();
  }, [queryClient]);

  const getCacheSize = useCallback(() => {
    const cache = queryClient.getQueryCache();
    return cache.getAll().length;
  }, [queryClient]);

  return {
    prefetchData,
    invalidateQueries,
    updateCache,
    optimisticUpdate,
    clearCache,
    getCacheSize,
  };
};
