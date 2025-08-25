// Optimized React Query configuration
import { QueryClient, DefaultOptions } from '@tanstack/react-query';
import { logger } from './logger';
import { handleApiError } from './error-handler';

const queryConfig: DefaultOptions = {
  queries: {
    // Global defaults for all queries
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: (failureCount, error: any) => {
      // Don't retry on 4xx errors (client errors)
      if (error?.statusCode >= 400 && error?.statusCode < 500) {
        return false;
      }
      // Retry up to 3 times for other errors
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  },
  mutations: {
    retry: false, // Don't retry mutations by default
    onError: (error) => {
      logger.error('Mutation error', error, 'ReactQuery');
    },
  },
};

export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: queryConfig,
  });
};

// Query keys factory for consistent key management
export const queryKeys = {
  // User queries
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.users.lists(), { filters }] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.users.details(), id] as const,
    current: () => [...queryKeys.users.all, 'current'] as const,
  },
  
  // Biodata queries
  biodatas: {
    all: ['biodatas'] as const,
    lists: () => [...queryKeys.biodatas.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.biodatas.lists(), { filters }] as const,
    details: () => [...queryKeys.biodatas.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.biodatas.details(), id] as const,
    current: () => [...queryKeys.biodatas.all, 'current'] as const,
    search: (filters: Record<string, any>) => [...queryKeys.biodatas.all, 'search', { filters }] as const,
    admin: {
      all: () => [...queryKeys.biodatas.all, 'admin'] as const,
      list: (filters: Record<string, any>) => [...queryKeys.biodatas.admin.all(), 'list', { filters }] as const,
    },
  },
  
  // Favorites queries
  favorites: {
    all: ['favorites'] as const,
    lists: () => [...queryKeys.favorites.all, 'list'] as const,
    list: (userId: number) => [...queryKeys.favorites.lists(), userId] as const,
    status: (biodataId: number) => [...queryKeys.favorites.all, 'status', biodataId] as const,
  },
  
  // Statistics queries
  stats: {
    all: ['stats'] as const,
    admin: () => [...queryKeys.stats.all, 'admin'] as const,
    user: (userId: number) => [...queryKeys.stats.all, 'user', userId] as const,
    views: (biodataId: number) => [...queryKeys.stats.all, 'views', biodataId] as const,
  },
  
  // Location queries
  locations: {
    all: ['locations'] as const,
    countries: () => [...queryKeys.locations.all, 'countries'] as const,
    divisions: (country: string) => [...queryKeys.locations.all, 'divisions', country] as const,
    districts: (division: string) => [...queryKeys.locations.all, 'districts', division] as const,
    upazilas: (district: string) => [...queryKeys.locations.all, 'upazilas', district] as const,
  },
} as const;

// Utility functions for cache management
export const invalidateQueries = {
  users: (queryClient: QueryClient) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
  },
  
  biodatas: (queryClient: QueryClient) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.biodatas.all });
  },
  
  favorites: (queryClient: QueryClient, userId?: number) => {
    if (userId) {
      queryClient.invalidateQueries({ queryKey: queryKeys.favorites.list(userId) });
    } else {
      queryClient.invalidateQueries({ queryKey: queryKeys.favorites.all });
    }
  },
  
  stats: (queryClient: QueryClient) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.stats.all });
  },
};

// Prefetch utilities - TODO: Implement when API functions are available
export const prefetchQueries = {
  // Placeholder for future implementation
};