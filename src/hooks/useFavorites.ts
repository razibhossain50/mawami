import { useState, useEffect, useCallback } from 'react';
import { useRegularAuth } from '@/context/RegularAuthContext';
import { logger } from '@/lib/logger';
import { handleApiError } from '@/lib/error-handler';
import { favoritesService } from '@/lib/api-services';
import { FavoritesResponse, FavoriteItem } from '@/types/api';

export const useFavorites = () => {
  const { user, isAuthenticated } = useRegularAuth();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('regular_user_access_token');
  };

  // Fetch user's favorites
  const fetchFavorites = useCallback(async () => {
    if (!isAuthenticated || !user) return;

    try {
      setLoading(true);
      setError(null);
      
      logger.debug('Fetching user favorites', { userId: user.id }, 'useFavorites');

      const data = await favoritesService.getFavorites();
      setFavorites(data.data || []);
      
      logger.info('Favorites fetched successfully', { count: data.data?.length || 0 }, 'useFavorites');
    } catch (error) {
      const appError = handleApiError(error, 'useFavorites');
      logger.error('Error fetching favorites', appError, 'useFavorites');
      setError(appError.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  // Add biodata to favorites
  const addToFavorites = async (biodataId: number): Promise<boolean> => {
    if (!isAuthenticated || !user) {
      // Return false to let the calling component handle the redirect
      return false;
    }

    try {
      setError(null);
      logger.info('Adding biodata to favorites', { biodataId, userId: user.id }, 'useFavorites');

      await favoritesService.addToFavorites(biodataId);
      
      logger.info('Biodata added to favorites successfully', { biodataId }, 'useFavorites');
      return true;
    } catch (error) {
      const appError = handleApiError(error, 'useFavorites');
      logger.error('Error adding to favorites', appError, 'useFavorites');
      
      if (appError.statusCode === 409) {
        setError('Already in favorites');
      } else {
        setError(appError.message);
      }
      return false;
    }
  };

  // Remove biodata from favorites
  const removeFromFavorites = async (biodataId: number): Promise<boolean> => {
    if (!isAuthenticated || !user) return false;

    try {
      setError(null);
      logger.info('Removing biodata from favorites', { biodataId, userId: user.id }, 'useFavorites');

      await favoritesService.removeFromFavorites(biodataId);

      // Update local state immediately
      setFavorites(prev => prev.filter(fav => fav.biodata.id !== biodataId));
      
      logger.info('Biodata removed from favorites successfully', { biodataId }, 'useFavorites');
      return true;
    } catch (error) {
      const appError = handleApiError(error, 'useFavorites');
      logger.error('Error removing from favorites', appError, 'useFavorites');
      setError(appError.message);
      return false;
    }
  };

  // Check if biodata is in favorites
  const isFavorite = async (biodataId: number): Promise<boolean> => {
    if (!isAuthenticated || !user) return false;

    try {
      const data = await favoritesService.checkFavorite(biodataId);
      return data.isFavorite || false;
    } catch (error) {
      const appError = handleApiError(error, 'useFavorites');
      logger.error('Error checking favorite status', appError, 'useFavorites');
      return false;
    }
  };

  // Get favorites count
  const getFavoriteCount = async (): Promise<number> => {
    if (!isAuthenticated || !user) return 0;

    try {
      const data = await favoritesService.getFavoriteCount();
      return data.count || 0;
    } catch (error) {
      const appError = handleApiError(error, 'useFavorites');
      logger.error('Error getting favorite count', appError, 'useFavorites');
      return 0;
    }
  };

  // Load favorites when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchFavorites();
    }
  }, [fetchFavorites, isAuthenticated, user]);

  return {
    favorites,
    loading,
    error,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    getFavoriteCount,
    fetchFavorites,
  };
};