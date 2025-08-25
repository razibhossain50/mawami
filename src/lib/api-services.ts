// Comprehensive API services for all backend endpoints
import { userApi, publicApi, adminApi, apiClient } from './api-client';
import { 
  User, 
  BiodataProfile, 
  BiodataSearchFilters, 
  BiodataSearchResponse,
  FavoritesResponse,
  FileUploadResponse,
  AdminStats,
  UserStats,
  LoginResponse
} from '@/types/api';

const buildQueryString = (params: Record<string, any>) => {
  const query = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, String(value));
    }
  });
  const qs = query.toString();
  return qs ? `?${qs}` : '';
};

// Authentication Services
export const authService = {
  // User registration
  signup: (data: { fullName: string; email: string; password: string; confirmPassword: string }) =>
    publicApi.post<LoginResponse>('/auth/signup', data),

  // User login
  login: (data: { email: string; password: string }) =>
    publicApi.post<LoginResponse>('/auth/login', data),

  // Admin login
  adminLogin: (data: { email: string; password: string }) =>
    publicApi.post<LoginResponse>('/auth/admin/login', data),

  // User logout
  logout: () => userApi.post('/auth/logout', {}),

  // Google OAuth
  googleAuth: () => publicApi.get('/auth/google'),
  googleCallback: (code: string) => publicApi.get(`/auth/google/callback?code=${code}`),
};

// User Management Services
export const userService = {
  // Get all users (admin/superadmin only)
  getAllUsers: () => adminApi.get<User[]>('/users'),

  // Create new user
  createUser: (data: Partial<User>) => publicApi.post<User>('/users', data),

  // Test authentication endpoint
  testAuth: () => userApi.get('/users/test-auth'),

  // Get user by ID
  getUserById: (id: number) => userApi.get<User>(`/users/${id}`),

  // Update user
  updateUser: (id: number, data: Partial<User>) => userApi.put<User>(`/users/${id}`, data),

  // Update user password
  updatePassword: (id: number, data: { currentPassword: string; newPassword: string }) =>
    userApi.put(`/users/${id}/password`, data),

  // Delete user (superadmin only)
  deleteUser: (id: number) => adminApi.delete(`/users/${id}`),
};

// Biodata Services
export const biodataService = {
  // Create biodata
  createBiodata: (data: Partial<BiodataProfile>) => userApi.post<BiodataProfile>('/biodatas', data),

  // Get all biodatas
  getAllBiodatas: () => publicApi.get<BiodataProfile[]>('/biodatas'),

  // Search biodatas
  searchBiodatas: (filters: BiodataSearchFilters) => 
    publicApi.get<BiodataSearchResponse>(`/biodatas/search${buildQueryString(filters as unknown as Record<string, any>)}`),

  // Get current user's biodata
  getCurrentBiodata: () => userApi.get<BiodataProfile>('/biodatas/current'),

  // Get all biodatas for admin
  getAdminBiodatas: () => adminApi.get<BiodataProfile[]>('/biodatas/admin/all'),

  // Get biodata by owner
  getBiodataByOwner: (id: number) => userApi.get<BiodataProfile>(`/biodatas/owner/${id}`),

  // Update approval status
  updateApprovalStatus: (id: number, status: string) =>
    adminApi.put(`/biodatas/${id}/approval-status`, { status }),

  // Toggle visibility
  toggleVisibility: () => userApi.put('/biodatas/current/toggle-visibility', {}),

  // Get biodata by ID
  getBiodataById: (id: number) => publicApi.get<BiodataProfile>(`/biodatas/${id}`),

  // Update current user's biodata
  updateCurrentBiodata: (data: Partial<BiodataProfile>) =>
    userApi.put<BiodataProfile>('/biodatas/current', data),

  // Partially update biodata
  patchBiodata: (id: number, data: Partial<BiodataProfile>) =>
    apiClient.patch<BiodataProfile>(`/api/biodatas/${id}`, data, { requireAuth: true }),

  // Delete biodata
  deleteBiodata: (id: number) => userApi.delete(`/biodatas/${id}`),

  // Update biodata step
  updateBiodataStep: (id: number, step: number, data: any) =>
    userApi.put(`/biodatas/${id}/step/${step}`, data),

  // Record biodata view
  recordView: (id: number) => userApi.post(`/biodatas/${id}/view`, {}),

  // Get biodata view count
  getViewCount: (id: number) => publicApi.get<{ count: number }>(`/biodatas/${id}/view-count`),

  // Get current user's view stats
  getViewStats: () => userApi.get<UserStats>('/biodatas/current/view-stats'),
};

// Favorites Services
export const favoritesService = {
  // Add to favorites
  addToFavorites: (biodataId: number) => userApi.post(`/favorites/${biodataId}`, {}),

  // Remove from favorites
  removeFromFavorites: (biodataId: number) => userApi.delete(`/favorites/${biodataId}`),

  // Get user's favorites
  getFavorites: () => userApi.get<FavoritesResponse>('/favorites'),

  // Check if biodata is favorited
  checkFavorite: (biodataId: number) => userApi.get<{ isFavorite: boolean }>(`/favorites/check/${biodataId}`),

  // Get favorite count
  getFavoriteCount: () => userApi.get<{ count: number }>('/favorites/count'),
};

// Upload Services
export const uploadService = {
  // Upload profile picture
  uploadProfilePicture: (file: File) => {
    return apiClient.uploadFile<FileUploadResponse>('/api/upload/profile-picture', file, 'file', { requireAuth: true });
  },
};

// Statistics Services
export const statsService = {
  // Get admin stats
  getAdminStats: () => adminApi.get<AdminStats>('/stats/admin'),

  // Get user stats
  getUserStats: (userId: number) => adminApi.get<UserStats>(`/stats/user/${userId}`),
};

// Root endpoint
export const rootService = {
  getRoot: () => publicApi.get('/'),
};
