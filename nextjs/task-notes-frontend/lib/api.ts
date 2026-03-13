/**
 * Drill 1: API Client Setup
 * Reusable, typed API client for the Task Notes API.
 * Supports both client-side (reads from cookie) and server-side fetching.
 */
import { env } from './env';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ApiTask {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt?: string;
}

export interface ApiError extends Error {
  status?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// ─── Token Helpers ────────────────────────────────────────────────────────────

/** Read token from cookies — works in both browser and server (Node.js) */
function getTokenFromCookie(cookieHeader?: string): string | null {
  const source =
    cookieHeader ??
    (typeof document !== 'undefined' ? document.cookie : '');
  const match = source.match(/(?:^|;\s*)auth_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

// ─── Core Fetch ───────────────────────────────────────────────────────────────

/**
 * Core fetch wrapper. Used by both client & server:
 * - In browser: reads cookie from document.cookie
 * - In Server Component: pass { cookieHeader } to forward request cookies
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit & { cookieHeader?: string } = {}
): Promise<T> {
  const { cookieHeader, ...fetchOptions } = options;
  const token = getTokenFromCookie(cookieHeader);
  const url = `${env.API_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...fetchOptions.headers,
      },
      // Disable Next.js caching for authenticated requests so data is always fresh
      cache: token ? 'no-store' : 'default',
    });

    if (response.status === 401) {
      // Clear bad token from cookie on client side
      if (typeof document !== 'undefined') {
        document.cookie = 'auth_token=; path=/; max-age=0';
        if (!window.location.pathname.startsWith('/login')) {
          window.location.href = '/login';
        }
      }
      throw Object.assign(new Error('Unauthorized'), { status: 401 });
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData.error || errorData.message || `API Error: ${response.statusText}`;
      const err = new Error(message) as ApiError & { details?: any };
      err.status = response.status;
      err.details = errorData.details;
      throw err;
    }

    if (response.status === 204) return null as T;
    return response.json();
  } catch (error) {
    if (env.IS_DEV) console.error(`[api] ${fetchOptions.method ?? 'GET'} ${url} failed:`, error);
    throw error;
  }
}

// ─── Typed API Object ─────────────────────────────────────────────────────────

/**
 * Drill 1: Typed API client. Use in Client Components normally.
 * For Server Components, pass the cookieHeader from headers().
 *
 * @example Server Component
 *   import { cookies } from 'next/headers';
 *   const cookieHeader = (await cookies()).toString();
 *   const tasks = await api.getTasks({ cookieHeader });
 */
export const api = {
  /** Get all tasks (paginated) */
  getTasks: (options: { cookieHeader?: string } = {}) =>
    apiRequest<PaginatedResponse<ApiTask>>('/tasks', options),

  /** Get a single task by ID */
  getTask: (id: string, options: { cookieHeader?: string } = {}) =>
    apiRequest<ApiTask>(`/tasks/${id}`, options),

  /** Create a new task */
  createTask: (
    task: Pick<ApiTask, 'title' | 'priority'> & { description?: string },
    options: { cookieHeader?: string } = {}
  ) =>
    apiRequest<ApiTask>('/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
      ...options,
    }),

  /** Update an existing task */
  updateTask: (
    id: string,
    updates: Partial<Omit<ApiTask, 'id' | 'createdAt'>>,
    options: { cookieHeader?: string } = {}
  ) =>
    apiRequest<ApiTask>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
      ...options,
    }),

  /** Delete a task */
  deleteTask: (id: string, options: { cookieHeader?: string } = {}) =>
    apiRequest<void>(`/tasks/${id}`, {
      method: 'DELETE',
      ...options,
    }),
};

// ─── Legacy client-side helper (kept for backwards compatibility) ──────────────
export { apiRequest as apiFetch };
