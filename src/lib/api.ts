const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:2000';

export const apiUrl = (endpoint: string): string => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

export const apiCall = async (endpoint: string, options?: RequestInit) => {
  const url = apiUrl(endpoint);
  const response = await fetch(url, options);
  return response;
};

// Helper functions for common API operations
export const api = {
  // Auth endpoints
  auth: {
    login: (email: string, password: string) =>
      apiCall('auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      }),

    signup: (fullName: string, email: string, password: string, confirmPassword: string) =>
      apiCall('auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password, confirmPassword })
      }),

    logout: (token: string) =>
      apiCall('auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
  },

  // User endpoints
  users: {
    update: (userId: number, data: any, token: string) =>
      apiCall(`api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      }),

    updatePassword: (userId: number, passwordData: any, token: string) =>
      apiCall(`api/users/${userId}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(passwordData)
      })
  },

  // Biodata endpoints
  biodata: {
    get: () => apiCall('api/biodatas'),

    update: (id: number, data: unknown, token: string) =>
      apiCall(`api/biodatas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      })
  }
};