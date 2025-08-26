import { useState, useEffect } from 'react';
import { ApiResponse, PaginatedResponse } from '@/types';
import apiClient from '@/utils/apiClient';

interface UseApiOptions {
  immediate?: boolean;
  token?: string;
}

interface UseApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  options: UseApiOptions = {}
) {
  const { immediate = true, token } = options;
  
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    isLoading: immediate,
    error: null
  });

  const execute = async (): Promise<T | null> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await apiCall();
      
      if (response.success && response.data) {
        setState({
          data: response.data,
          isLoading: false,
          error: null
        });
        return response.data;
      } else {
        throw new Error(response.error || 'API call failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setState({
        data: null,
        isLoading: false,
        error: errorMessage
      });
      return null;
    }
  };

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate]);

  return {
    ...state,
    execute,
    refetch: execute
  };
}

// Specialized hooks for common API patterns
export function useApiMutation<TData, TVariables = any>(
  apiCall: (variables: TVariables) => Promise<ApiResponse<TData>>
) {
  const [state, setState] = useState<UseApiState<TData>>({
    data: null,
    isLoading: false,
    error: null
  });

  const mutate = async (variables: TVariables): Promise<TData | null> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await apiCall(variables);
      
      if (response.success && response.data) {
        setState({
          data: response.data,
          isLoading: false,
          error: null
        });
        return response.data;
      } else {
        throw new Error(response.error || 'Mutation failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setState({
        data: null,
        isLoading: false,
        error: errorMessage
      });
      throw error;
    }
  };

  const reset = () => {
    setState({
      data: null,
      isLoading: false,
      error: null
    });
  };

  return {
    ...state,
    mutate,
    reset
  };
}

// Hook for paginated data
export function usePaginatedApi<T>(
  apiCall: (params?: { limit?: number; cursor?: string }) => Promise<ApiResponse<PaginatedResponse<T>>>,
  options: UseApiOptions & { limit?: number } = {}
) {
  const { immediate = true, limit = 20 } = options;
  
  const [state, setState] = useState<{
    data: T[];
    isLoading: boolean;
    isLoadingMore: boolean;
    error: string | null;
    hasMore: boolean;
    nextCursor: string | null;
  }>({
    data: [],
    isLoading: immediate,
    isLoadingMore: false,
    error: null,
    hasMore: true,
    nextCursor: null
  });

  const execute = async (reset = true): Promise<T[]> => {
    setState(prev => ({ 
      ...prev, 
      isLoading: reset, 
      isLoadingMore: !reset,
      error: null 
    }));
    
    try {
      const cursor = reset ? undefined : state.nextCursor || undefined;
      const response = await apiCall({ limit, cursor });
      
      if (response.success && response.data) {
        const newData = response.data.items;
        setState(prev => ({
          data: reset ? newData : [...prev.data, ...newData],
          isLoading: false,
          isLoadingMore: false,
          error: null,
          hasMore: !!response.data?.nextCursor,
          nextCursor: response.data?.nextCursor || null
        }));
        return newData;
      } else {
        throw new Error(response.error || 'API call failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setState(prev => ({
        ...prev,
        isLoading: false,
        isLoadingMore: false,
        error: errorMessage
      }));
      return [];
    }
  };

  const loadMore = () => {
    if (state.hasMore && !state.isLoadingMore) {
      execute(false);
    }
  };

  const refetch = () => execute(true);

  useEffect(() => {
    if (immediate) {
      execute(true);
    }
  }, [immediate]);

  return {
    ...state,
    execute,
    loadMore,
    refetch
  };
}

export default useApi;