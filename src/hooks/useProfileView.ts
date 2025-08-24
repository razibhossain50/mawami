import { useCallback } from 'react';

export const useProfileView = () => {
  const trackProfileView = useCallback(async (biodataId: number) => {
    try {
      const token = localStorage.getItem('regular_user_access_token') || localStorage.getItem('admin_user_access_token');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/biodatas/${biodataId}/view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });

      if (!response.ok) {
        console.error('Failed to track profile view:', response.statusText);
        return { success: false, error: response.statusText };
      }

      const result = await response.json();
      return { success: true, data: result };
    } catch (error) {
      console.error('Error tracking profile view:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }, []);

  const getProfileViewStats = useCallback(async () => {
    try {
      const token = localStorage.getItem('regular_user_access_token') || localStorage.getItem('admin_user_access_token');
      
      if (!token) {
        return { success: false, error: 'No authentication token found' };
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/biodatas/current/view-stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        console.error('Failed to get profile view stats:', response.statusText);
        return { success: false, error: response.statusText };
      }

      const stats = await response.json();
      return { success: true, data: stats };
    } catch (error) {
      console.error('Error getting profile view stats:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }, []);

  return {
    trackProfileView,
    getProfileViewStats
  };
};