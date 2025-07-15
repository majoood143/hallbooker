import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Enhanced Supabase client configuration with timeout and connection management
const supabaseOptions = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: localStorage,
    storageKey: 'supabase.auth.token',
    flowType: 'pkce'
  },
  db: {
    schema: 'public'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  global: {
    headers: {
      'x-application-name': 'hallbooker-app',
      'x-client-info': 'hallbooker-web-client'
    }
  }
};

// Create Supabase client with enhanced configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, supabaseOptions);

// Connection health check utility
export const checkConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id')
      .limit(1);
    
    if (error && error.message.includes('relation "user_profiles" does not exist')) {
      return { connected: false, error: 'Database schema not found. Please run migrations.' };
    }
    
    return { connected: true, error: null };
  } catch (error) {
    return { 
      connected: false, 
      error: error.message || 'Connection failed' 
    };
  }
};

// Enhanced query executor with timeout and retry logic
export const executeQuery = async (queryFn, options = {}) => {
  const { 
    timeout = 30000, // 30 seconds default timeout
    retries = 3, 
    retryDelay = 1000,
    operation = 'database operation'
  } = options;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error(`${operation} timed out after ${timeout}ms`));
        }, timeout);
      });

      // Execute the query with timeout
      const queryPromise = queryFn();
      const result = await Promise.race([queryPromise, timeoutPromise]);

      return result;
    } catch (error) {
      const isLastAttempt = attempt === retries - 1;
      const shouldRetry = 
        error.message.includes('timeout') ||
        error.message.includes('Failed to fetch') ||
        error.message.includes('NetworkError') ||
        error.message.includes('Connection terminated');

      if (shouldRetry && !isLastAttempt) {
        console.warn(`${operation} failed (attempt ${attempt + 1}/${retries}), retrying in ${retryDelay}ms:`, error.message);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        continue;
      }

      // If it's the last attempt or shouldn't retry, throw the error
      throw error;
    }
  }
};

// Connection monitoring and automatic reconnection
let connectionStatus = { connected: true, lastCheck: Date.now() };
const CONNECTION_CHECK_INTERVAL = 60000; // Check every minute

const monitorConnection = () => {
  setInterval(async () => {
    const health = await checkConnection();
    connectionStatus = {
      connected: health.connected,
      lastCheck: Date.now(),
      error: health.error
    };

    if (!health.connected) {
      console.warn('Supabase connection lost:', health.error);
      
      // Emit custom event for connection loss
      window.dispatchEvent(new CustomEvent('supabase-connection-lost', {
        detail: { error: health.error }
      }));
    }
  }, CONNECTION_CHECK_INTERVAL);
};

// Start connection monitoring
if (typeof window !== 'undefined') {
  monitorConnection();
}

// Get current connection status
export const getConnectionStatus = () => connectionStatus;

// Utility to handle common Supabase errors with user-friendly messages
export const handleSupabaseError = (error, operation = 'operation') => {
  if (!error) return null;

  const errorMessage = error.message || error.toString();

  // Connection and timeout errors
  if (errorMessage.includes('timeout') || 
      errorMessage.includes('Connection terminated') ||
      errorMessage.includes('timed out')) {
    return {
      type: 'timeout',
      message: `${operation} timed out. Please check your internet connection and try again.`,
      retryable: true
    };
  }

  // Network errors
  if (errorMessage.includes('Failed to fetch') || 
      errorMessage.includes('NetworkError') ||
      errorMessage.includes('fetch')) {
    return {
      type: 'network',
      message: 'Network error. Please check your internet connection and try again.',
      retryable: true
    };
  }

  // Authentication errors
  if (errorMessage.includes('AuthRetryableFetchError') ||
      errorMessage.includes('Invalid login credentials') ||
      errorMessage.includes('User not found')) {
    return {
      type: 'auth',
      message: 'Authentication failed. Please check your credentials and try again.',
      retryable: false
    };
  }

  // Project inactive/paused errors
  if (errorMessage.includes('project is paused') ||
      errorMessage.includes('project not found') ||
      errorMessage.includes('Invalid API key')) {
    return {
      type: 'project',
      message: 'Service temporarily unavailable. Please try again later or contact support.',
      retryable: false
    };
  }

  // Database errors
  if (errorMessage.includes('duplicate key value') ||
      errorMessage.includes('violates foreign key constraint') ||
      errorMessage.includes('relation') && errorMessage.includes('does not exist')) {
    return {
      type: 'database',
      message: 'Database error occurred. Please try again or contact support.',
      retryable: false
    };
  }

  // Generic error
  return {
    type: 'generic',
    message: `${operation} failed. Please try again.`,
    retryable: true
  };
};

export default supabase;