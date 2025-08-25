// Environment configuration with validation
import { z } from 'zod';
import { logger } from '@/lib/logger';
import { handleApiError } from '@/lib/error-handler';

const envSchema = z.object({
  // Required environment variables
  NEXT_PUBLIC_API_BASE_URL: z.string().url('Invalid API base URL'),
  
  // Optional environment variables with defaults
  NEXT_PUBLIC_APP_NAME: z.string().default('Finder'),
  NEXT_PUBLIC_APP_VERSION: z.string().default('2.0.2'),
  NEXT_PUBLIC_ENVIRONMENT: z.enum(['development', 'staging', 'production']).default('development'),
  
  // Feature flags
  NEXT_PUBLIC_ENABLE_GOOGLE_AUTH: z.string().transform(val => val === 'true').default('true'),
  NEXT_PUBLIC_ENABLE_ANALYTICS: z.string().transform(val => val === 'true').default('false'),
  NEXT_PUBLIC_ENABLE_ERROR_REPORTING: z.string().transform(val => val === 'true').default('false'),
  
  // API Configuration
  NEXT_PUBLIC_API_TIMEOUT: z.string().transform(val => parseInt(val, 10)).default('10000'),
  NEXT_PUBLIC_MAX_FILE_SIZE: z.string().transform(val => parseInt(val, 10)).default('5242880'), // 5MB
  
  // Pagination defaults
  NEXT_PUBLIC_DEFAULT_PAGE_SIZE: z.string().transform(val => parseInt(val, 10)).default('12'),
  NEXT_PUBLIC_MAX_PAGE_SIZE: z.string().transform(val => parseInt(val, 10)).default('50'),
});

type Env = z.infer<typeof envSchema>;

class EnvironmentConfig {
  private static instance: EnvironmentConfig;
  private config: Env;

  private constructor() {
    try {
      this.config = envSchema.parse({
        NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
        NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
        NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION,
        NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT,
        NEXT_PUBLIC_ENABLE_GOOGLE_AUTH: process.env.NEXT_PUBLIC_ENABLE_GOOGLE_AUTH,
        NEXT_PUBLIC_ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS,
        NEXT_PUBLIC_ENABLE_ERROR_REPORTING: process.env.NEXT_PUBLIC_ENABLE_ERROR_REPORTING,
        NEXT_PUBLIC_API_TIMEOUT: process.env.NEXT_PUBLIC_API_TIMEOUT,
        NEXT_PUBLIC_MAX_FILE_SIZE: process.env.NEXT_PUBLIC_MAX_FILE_SIZE,
        NEXT_PUBLIC_DEFAULT_PAGE_SIZE: process.env.NEXT_PUBLIC_DEFAULT_PAGE_SIZE,
        NEXT_PUBLIC_MAX_PAGE_SIZE: process.env.NEXT_PUBLIC_MAX_PAGE_SIZE,
      });
    } catch (error) {
      const appError = handleApiError(error, 'Component');
            logger.error('Environment validation failed', appError, 'Env');
      throw new Error('Invalid environment configuration');
    }
  }

  public static getInstance(): EnvironmentConfig {
    if (!EnvironmentConfig.instance) {
      EnvironmentConfig.instance = new EnvironmentConfig();
    }
    return EnvironmentConfig.instance;
  }

  public get<K extends keyof Env>(key: K): Env[K] {
    return this.config[key];
  }

  public getAll(): Env {
    return { ...this.config };
  }

  public isDevelopment(): boolean {
    return this.config.NEXT_PUBLIC_ENVIRONMENT === 'development';
  }

  public isProduction(): boolean {
    return this.config.NEXT_PUBLIC_ENVIRONMENT === 'production';
  }

  public isStaging(): boolean {
    return this.config.NEXT_PUBLIC_ENVIRONMENT === 'staging';
  }
}

// Export singleton instance
export const env = EnvironmentConfig.getInstance();

// Export individual config values for convenience
export const {
  NEXT_PUBLIC_API_BASE_URL: API_BASE_URL,
  NEXT_PUBLIC_APP_NAME: APP_NAME,
  NEXT_PUBLIC_APP_VERSION: APP_VERSION,
  NEXT_PUBLIC_ENVIRONMENT: ENVIRONMENT,
  NEXT_PUBLIC_ENABLE_GOOGLE_AUTH: ENABLE_GOOGLE_AUTH,
  NEXT_PUBLIC_ENABLE_ANALYTICS: ENABLE_ANALYTICS,
  NEXT_PUBLIC_ENABLE_ERROR_REPORTING: ENABLE_ERROR_REPORTING,
  NEXT_PUBLIC_API_TIMEOUT: API_TIMEOUT,
  NEXT_PUBLIC_MAX_FILE_SIZE: MAX_FILE_SIZE,
  NEXT_PUBLIC_DEFAULT_PAGE_SIZE: DEFAULT_PAGE_SIZE,
  NEXT_PUBLIC_MAX_PAGE_SIZE: MAX_PAGE_SIZE,
} = env.getAll();

// Utility functions
export const getApiUrl = (endpoint: string): string => {
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};

export const formatFileSize = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

export const isFileSizeValid = (fileSize: number): boolean => {
  return fileSize <= MAX_FILE_SIZE;
};