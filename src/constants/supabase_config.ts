// Import with error handling in case @env fails to load

let SUPABASE_URL_ENV = '';

let SUPABASE_ANON_KEY_ENV = '';

try {
  // Try Vite environment variables first (works in browser/Vite)
  if (import.meta.env.VITE_PUBLIC_SUPABASE_URL) {
    SUPABASE_URL_ENV = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
  }
  if (import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY) {
    SUPABASE_ANON_KEY_ENV = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;
  }
  
  // If not found in Vite env, try @env package (for React Native compatibility)
  // Note: require() doesn't work in ES modules, so we check if values are still empty
  if (!SUPABASE_URL_ENV || !SUPABASE_ANON_KEY_ENV) {
    // In Vite/ES modules, we can't use require(), so we rely on import.meta.env
    // If you need @env support, configure it through Vite's env system
    // or use a different approach for React Native
  }
} catch (error) {
  console.warn('Failed to load environment variables, using defaults:', error);
}

// Fallback values (you can set these as defaults)
if (!SUPABASE_URL_ENV) {
  SUPABASE_URL_ENV = 'https://guquwpfadpujzzclrdkc.supabase.co';
}

if (!SUPABASE_ANON_KEY_ENV) {
  SUPABASE_ANON_KEY_ENV = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1cXV3cGZhZHB1anp6Y2xyZGtjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1MDc1NDMsImV4cCI6MjA3OTA4MzU0M30.RtvtBG08ixEETuncPq6ADHk_UgY9b9rNZMBD2cFIq4o';
}

export const SUPABASE_CONFIG = {
  /**
   * Supabase project URL. Example:
   * https://your-project.supabase.co
   */
  url: SUPABASE_URL_ENV,

  /**
   * Supabase anon/public key (safe for client-side use).
   * NEVER embed the service_role key in the client!
   */
  anonKey: SUPABASE_ANON_KEY_ENV,
};
