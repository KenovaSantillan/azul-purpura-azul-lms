
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

export const useOptimizedCache = () => {
  const queryClient = useQueryClient();

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

  return {
    prefetchData,
    invalidateQueries,
    updateCache,
    optimisticUpdate,
  };
};
