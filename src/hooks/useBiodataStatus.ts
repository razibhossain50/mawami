import { useState, useEffect } from 'react';
import { BiodataApprovalStatus, BiodataVisibilityStatus } from '@/types/biodata';
import { logger } from '@/lib/logger';
import { handleApiError } from '@/lib/error-handler';

interface BiodataStatusInfo {
  id?: number;
  biodataApprovalStatus: BiodataApprovalStatus;
  biodataVisibilityStatus: BiodataVisibilityStatus;
  canUserToggle: boolean;
  effectiveStatus: string;
}

interface UseBiodataStatusReturn {
  statusInfo: BiodataStatusInfo | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useBiodataStatus = (): UseBiodataStatusReturn => {
  const [statusInfo, setStatusInfo] = useState<BiodataStatusInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBiodataStatus = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('regular_user_access_token');
      if (!token) {
        setError('Authentication required');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/biodatas/current`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          // No biodata found
          setStatusInfo(null);
          return;
        }
        throw new Error('Failed to fetch biodata status');
      }

      // Check if response has content before parsing JSON
      const text = await response.text();
      let biodata = null;
      
      if (text) {
        try {
          biodata = JSON.parse(text);
        } catch (parseError) {
          const appError = handleApiError(parseError, 'Component');
            logger.error('Error parsing biodata response', appError, 'UseBiodataStatus');
          setStatusInfo(null);
          return;
        }
      }
      
      if (biodata) {
        // Calculate effective status and toggle capability using new two-column system
        const effectiveStatus = calculateEffectiveStatus(biodata);
        const canUserToggle = calculateCanUserToggle(biodata);

        setStatusInfo({
          id: biodata.id,
          biodataApprovalStatus: biodata.biodataApprovalStatus || BiodataApprovalStatus.PENDING,
          biodataVisibilityStatus: biodata.biodataVisibilityStatus || BiodataVisibilityStatus.ACTIVE,
          canUserToggle,
          effectiveStatus
        });
      } else {
        setStatusInfo(null);
      }
    } catch (err) {
      const appError = handleApiError(err, 'Component');
            logger.error('Error fetching biodata status', appError, 'UseBiodataStatus');
      setError(err instanceof Error ? err.message : 'Failed to fetch biodata status');
    } finally {
      setLoading(false);
    }
  };

  const calculateEffectiveStatus = (biodata: any): string => {
    // This mirrors the backend logic for the new two-column system
    // If not approved by admin, show admin approval status
    if (biodata.biodataApprovalStatus !== BiodataApprovalStatus.APPROVED) {
      return biodata.biodataApprovalStatus;
    }

    // If approved by admin, show user's visibility choice
    return biodata.biodataVisibilityStatus;
  };

  const calculateCanUserToggle = (biodata: any): boolean => {
    // User can only toggle if admin has approved the biodata
    return biodata.biodataApprovalStatus === BiodataApprovalStatus.APPROVED;
  };

  useEffect(() => {
    fetchBiodataStatus();
  }, []);

  return {
    statusInfo,
    loading,
    error,
    refetch: fetchBiodataStatus
  };
};