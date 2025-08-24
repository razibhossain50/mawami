import { useState, useEffect, useCallback } from 'react';
import { useRegularAuth } from '@/context/RegularAuthContext';

interface FavoriteItem {
  id: number;
  biodata: {
    id: number;
    fullName: string;
    profilePicture?: string;
    age: number;
    biodataType: string;
    profession: string;
    presentDivision?: string;
    presentZilla?: string;
    maritalStatus: string;
    height: string;
    complexion?: string;
  };
  createdAt: string;
}

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

      const token = getAuthToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/favorites`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch favorites');
      }

      const data = await response.json();
      setFavorites(data.data || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setError(error instanceof Error ? error.message : 'Failed to load favorites');
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

      const token = getAuthToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/favorites/${biodataId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 409) {
          throw new Error('Already in favorites');
        }
        throw new Error(errorData.message || 'Failed to add to favorites');
      }

      // Successfully added to favorites
      return true;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      setError(error instanceof Error ? error.message : 'Failed to add to favorites');
      return false;
    }
  };

  // Remove biodata from favorites
  const removeFromFavorites = async (biodataId: number): Promise<boolean> => {
    if (!isAuthenticated || !user) return false;

    try {
      setError(null);

      const token = getAuthToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/favorites/${biodataId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to remove from favorites');
      }

      // Update local state immediately
      setFavorites(prev => prev.filter(fav => fav.biodata.id !== biodataId));
      return true;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      setError(error instanceof Error ? error.message : 'Failed to remove from favorites');
      return false;
    }
  };

  // Check if biodata is in favorites
  const isFavorite = async (biodataId: number): Promise<boolean> => {
    if (!isAuthenticated || !user) return false;

    try {
      const token = getAuthToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/favorites/check/${biodataId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      return data.isFavorite || false;
    } catch (error) {
      console.error('Error checking favorite status:', error);
      return false;
    }
  };

  // Get favorites count
  const getFavoriteCount = async (): Promise<number> => {
    if (!isAuthenticated || !user) return 0;

    try {
      const token = getAuthToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/favorites/count`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return 0;
      }

      const data = await response.json();
      return data.count || 0;
    } catch (error) {
      console.error('Error getting favorite count:', error);
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