// Centralized API client with proper error handling and interceptors
import { ApiError, handleApiError } from './error-handler';
import { logger } from './logger';

interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  defaultHeaders?: Record<string, string>;
}

interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  requireAuth?: boolean;
  tokenType?: 'regular' | 'admin';
}

class ApiClient {
  private baseURL: string;
  private timeout: number;
  private defaultHeaders: Record<string, string>;

  constructor(config: ApiClientConfig) {
    this.baseURL = config.baseURL;
    this.timeout = config.timeout || 10000;
    this.defaultHeaders = config.defaultHeaders || {};
  }

  private getAuthToken(tokenType: 'regular' | 'admin' = 'regular'): string | null {
    const tokenKey = tokenType === 'admin' ? 'admin_user_access_token' : 'regular_user_access_token';
    return localStorage.getItem(tokenKey);
  }

  private async makeRequest<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const {
      method = 'GET',
      headers = {},
      body,
      timeout = this.timeout,
      requireAuth = false,
      tokenType = 'regular'
    } = config;

    const url = `${this.baseURL}${endpoint}`;
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...this.defaultHeaders,
      ...headers
    };

    // Add auth token if required
    if (requireAuth) {
      const token = this.getAuthToken(tokenType);
      if (!token) {
        throw new ApiError('Authentication required', 401, 'AUTH_ERROR');
      }
      requestHeaders.Authorization = `Bearer ${token}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      logger.debug(`API Request: ${method} ${url}`, { headers: requestHeaders, body }, 'ApiClient');

      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        let errorData: any = {};

        try {
          errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // Response is not JSON, use status text
        }

        throw new ApiError(
          errorMessage,
          response.status,
          this.getErrorCode(response.status),
          errorData
        );
      }

      const data = await response.json();
      logger.debug(`API Response: ${method} ${url}`, data, 'ApiClient');
      return data;

    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408, 'TIMEOUT_ERROR');
      }

      throw handleApiError(error, 'ApiClient');
    }
  }

  private getErrorCode(status: number): string {
    const errorCodes: Record<number, string> = {
      400: 'VALIDATION_ERROR',
      401: 'AUTH_ERROR',
      403: 'PERMISSION_DENIED',
      404: 'NOT_FOUND',
      408: 'TIMEOUT_ERROR',
      429: 'RATE_LIMIT_ERROR',
      500: 'SERVER_ERROR',
      502: 'BAD_GATEWAY',
      503: 'SERVICE_UNAVAILABLE'
    };
    return errorCodes[status] || 'UNKNOWN_ERROR';
  }

  // Public methods
  async get<T>(endpoint: string, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<T> {
    return this.makeRequest<T>(endpoint, { ...config, method: 'GET' });
  }

  async post<T>(endpoint: string, body?: any, config?: Omit<RequestConfig, 'method'>): Promise<T> {
    return this.makeRequest<T>(endpoint, { ...config, method: 'POST', body });
  }

  async put<T>(endpoint: string, body?: any, config?: Omit<RequestConfig, 'method'>): Promise<T> {
    return this.makeRequest<T>(endpoint, { ...config, method: 'PUT', body });
  }

  async delete<T>(endpoint: string, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<T> {
    return this.makeRequest<T>(endpoint, { ...config, method: 'DELETE' });
  }

  async patch<T>(endpoint: string, body?: any, config?: Omit<RequestConfig, 'method'>): Promise<T> {
    return this.makeRequest<T>(endpoint, { ...config, method: 'PATCH', body });
  }

  // File upload method
  async uploadFile<T>(endpoint: string, file: File, fieldName = 'file', config?: Omit<RequestConfig, 'method' | 'body'>): Promise<T> {
    const formData = new FormData();
    formData.append(fieldName, file);

    const requestHeaders = { ...config?.headers };
    delete requestHeaders['Content-Type']; // Let browser set it for FormData

    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken(config?.tokenType || 'regular');
    
    if (config?.requireAuth !== false && token) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: requestHeaders,
        body: formData
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // Response is not JSON
        }
        throw new ApiError(errorMessage, response.status);
      }

      return await response.json();
    } catch (error) {
      throw handleApiError(error, 'ApiClient');
    }
  }
}

// Create singleton instance
export const apiClient = new ApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:2000',
  timeout: 10000,
  defaultHeaders: {
    'Accept': 'application/json'
  }
});

// Convenience methods for different API types
export const userApi = {
  get: <T>(endpoint: string) => apiClient.get<T>(`/api${endpoint}`, { requireAuth: true }),
  post: <T>(endpoint: string, body?: any) => apiClient.post<T>(`/api${endpoint}`, body, { requireAuth: true }),
  put: <T>(endpoint: string, body?: any) => apiClient.put<T>(`/api${endpoint}`, body, { requireAuth: true }),
  delete: <T>(endpoint: string) => apiClient.delete<T>(`/api${endpoint}`, { requireAuth: true })
};

export const publicApi = {
  get: <T>(endpoint: string) => apiClient.get<T>(`/api${endpoint}`),
  post: <T>(endpoint: string, body?: any) => apiClient.post<T>(`/api${endpoint}`, body)
};

export const adminApi = {
  get: <T>(endpoint: string) => apiClient.get<T>(`/api${endpoint}`, { requireAuth: true, tokenType: 'admin' }),
  post: <T>(endpoint: string, body?: any) => apiClient.post<T>(`/api${endpoint}`, body, { requireAuth: true, tokenType: 'admin' }),
  put: <T>(endpoint: string, body?: any) => apiClient.put<T>(`/api${endpoint}`, body, { requireAuth: true, tokenType: 'admin' }),
  delete: <T>(endpoint: string) => apiClient.delete<T>(`/api${endpoint}`, { requireAuth: true, tokenType: 'admin' })
};