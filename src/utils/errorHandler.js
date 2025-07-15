import { executeQuery, handleSupabaseError } from './supabase';

// Centralized error handling utility for Supabase operations
export class SupabaseErrorHandler {
  constructor() {
    this.defaultOptions = {
      timeout: 30000,
      retries: 3,
      retryDelay: 1000,
      showNotification: true
    };
  }

  // Execute any Supabase operation with enhanced error handling
  async execute(operation, queryFn, options = {}) {
    const opts = { ...this.defaultOptions, ...options };
    
    try {
      const result = await executeQuery(queryFn, {
        timeout: opts.timeout,
        retries: opts.retries,
        retryDelay: opts.retryDelay,
        operation
      });

      return { success: true, data: result.data, error: null };
    } catch (error) {
      const handledError = handleSupabaseError(error, operation);
      
      // Log error for debugging
      console.error(`${operation} failed:`, {
        originalError: error,
        handledError,
        timestamp: new Date().toISOString()
      });

      // Show notification if enabled
      if (opts.showNotification && handledError?.retryable) {
        this.showErrorNotification(handledError.message);
      }

      return { 
        success: false, 
        data: null, 
        error: handledError?.message || 'Operation failed'
      };
    }
  }

  // Show error notification (can be customized based on UI library)
  showErrorNotification(message) {
    // For now, just log to console
    // In a real app, you might want to integrate with a toast library
    console.warn('Operation failed:', message);
    
    // You can integrate with your notification system here
    // Example: toast.error(message);
  }

  // Specialized handlers for different types of operations
  async executeAuthOperation(operation, queryFn, options = {}) {
    return this.execute(operation, queryFn, {
      ...options,
      timeout: 15000, // Shorter timeout for auth operations
      retries: 2
    });
  }

  async executeDbOperation(operation, queryFn, options = {}) {
    return this.execute(operation, queryFn, {
      ...options,
      timeout: 30000,
      retries: 3
    });
  }

  async executeFileOperation(operation, queryFn, options = {}) {
    return this.execute(operation, queryFn, {
      ...options,
      timeout: 60000, // Longer timeout for file operations
      retries: 2
    });
  }
}

// Create singleton instance
export const errorHandler = new SupabaseErrorHandler();

// Utility functions for common error scenarios
export const isTimeoutError = (error) => {
  return error?.message?.includes('timeout') || 
         error?.message?.includes('Connection terminated');
};

export const isNetworkError = (error) => {
  return error?.message?.includes('Failed to fetch') || 
         error?.message?.includes('NetworkError');
};

export const isAuthError = (error) => {
  return error?.message?.includes('AuthRetryableFetchError') ||
         error?.message?.includes('Invalid login credentials');
};

export const isProjectError = (error) => {
  return error?.message?.includes('project is paused') ||
         error?.message?.includes('Invalid API key');
};

// Helper to create standardized error responses
export const createErrorResponse = (message, type = 'generic', retryable = true) => {
  return {
    success: false,
    error: message,
    errorType: type,
    retryable,
    timestamp: new Date().toISOString()
  };
};

// Helper to create standardized success responses
export const createSuccessResponse = (data, message = null) => {
  return {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString()
  };
};

export default errorHandler;