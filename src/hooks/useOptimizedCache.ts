
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useOptimizedCache = () => {
  const queryClient = useQueryClient();
  const location = useLocation();

  const prefetchData = useCallback(async (queryKey: string[], queryFn: () => Promise<any>) => {
    await queryClient.prefetchQuery({
      queryKey,
      queryFn,
      staleTime: 5 * 60 * 1000, // 5 minutes
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

  // Auto-prefetch related data based on current route
  useEffect(() => {
    const prefetchRelatedData = async () => {
      const path = location.pathname;
      
      // Prefetch user data on any authenticated route
      if (path !== '/auth') {
        prefetchData(['currentUserProfile'], async () => {
          // This will be handled by the existing query
          return null;
        });
      }

      // Route-specific prefetching
      if (path === '/' || path.includes('dashboard')) {
        // Prefetch groups and tasks for dashboard
        prefetchData(['groups'], async () => null);
        prefetchData(['tasks'], async () => null);
        prefetchData(['announcements'], async () => null);
      }

      if (path.includes('groups')) {
        prefetchData(['users'], async () => null);
      }
    };

    const timeoutId = setTimeout(prefetchRelatedData, 100);
    return () => clearTimeout(timeoutId);
  }, [location.pathname, prefetchData]);

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
