/**
 * Drill 5: Environment Configuration
 * Centralized, validated environment variables for the app.
 * NEXT_PUBLIC_ prefix is required for variables accessible in the browser.
 */

export const env = {
  API_URL: process.env.NEXT_PUBLIC_API_URL,
  NODE_ENV: process.env.NODE_ENV!,
  IS_DEV: process.env.NODE_ENV === 'development',
  IS_PROD: process.env.NODE_ENV === 'production',
};

// Drill 5: Strict validation for required variables
if (!env.API_URL) {
  if (env.IS_PROD) {
    throw new Error('NEXT_PUBLIC_API_URL environment variable is required in production');
  } else {
    console.warn('[env] NEXT_PUBLIC_API_URL is missing. API calls will fail.');
  }
}
