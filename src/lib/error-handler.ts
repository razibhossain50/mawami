// Centralized error handling utilities
import { logger } from './logger';

export interface AppError {
  message: string;
  code?: string;
  statusCode?: number;
  context?: Record<string, any>;
}

export class ApiError extends Error implements AppError {
  code?: string;
  statusCode?: number;
  context?: Record<string, any>;

  constructor(message: string, statusCode = 500, code?: string, context?: Record<string, any>) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.context = context;
  }
}

export class ValidationError extends Error implements AppError {
  code = 'VALIDATION_ERROR';
  statusCode = 400;
  context?: Record<string, any>;

  constructor(message: string, context?: Record<string, any>) {
    super(message);
    this.name = 'ValidationError';
    this.context = context;
  }
}

export const handleApiError = (error: unknown, component?: string): AppError => {
  logger.error('API Error occurred', error, component);

  if (error instanceof ApiError || error instanceof ValidationError) {
    return error;
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'UNKNOWN_ERROR',
      statusCode: 500
    };
  }

  return {
    message: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
    statusCode: 500
  };
};

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
};

// User-friendly error messages
export const getUserFriendlyMessage = (error: AppError): string => {
  const errorMessages: Record<string, string> = {
    'NETWORK_ERROR': 'Please check your internet connection and try again.',
    'AUTH_ERROR': 'Please log in again to continue.',
    'VALIDATION_ERROR': 'Please check your input and try again.',
    'NOT_FOUND': 'The requested information could not be found.',
    'PERMISSION_DENIED': 'You do not have permission to perform this action.',
    'SERVER_ERROR': 'Something went wrong on our end. Please try again later.'
  };

  return errorMessages[error.code || ''] || error.message || 'An unexpected error occurred';
};