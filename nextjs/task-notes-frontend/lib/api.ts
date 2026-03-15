import { config } from './config';

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

function getTokenFromCookie(cookieHeader?: string): string | null {
  const source =
    cookieHeader ??
    (typeof document !== 'undefined' ? document.cookie : '');
  const match = source.match(/(?:^|;\s*)auth_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit & { cookieHeader?: string } = {}
): Promise<T> {
  const { cookieHeader, ...fetchOptions } = options;
  const token = getTokenFromCookie(cookieHeader);
  const url = `${config.apiUrl}${endpoint}`;

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
      let errorData: Record<string, unknown> = {};
      try {
        errorData = await response.json();
      } catch {
        // Fallback for non-JSON errors
      }
      const errorMsg = (typeof errorData?.error === 'string' ? errorData.error : '') || 
                       (typeof errorData?.message === 'string' ? errorData.message : '');
      const message = errorMsg || `API Error: ${response.statusText}`;
      const err = new Error(String(message)) as ApiError & { details?: unknown };
      err.status = response.status;
      err.details = errorData.details;
      throw err;
    }

    if (response.status === 204) return null as T;
    return response.json();
  } catch (error) {
    if (config.isDevelopment) console.error(`[api] ${fetchOptions.method ?? 'GET'} ${url} failed:`, error);
    throw error;
  }
}

export const api = {

  getTasks: (options: { cookieHeader?: string } = {}) =>
    apiRequest<PaginatedResponse<ApiTask>>('/tasks', options),

  getTask: (id: string, options: { cookieHeader?: string } = {}) =>
    apiRequest<ApiTask>(`/tasks/${id}`, options),

  createTask: (
    task: Pick<ApiTask, 'title' | 'priority'> & { description?: string },
    options: { cookieHeader?: string } = {}
  ) =>
    apiRequest<ApiTask>('/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
      ...options,
    }),

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

  deleteTask: (id: string, options: { cookieHeader?: string } = {}) =>
    apiRequest<void>(`/tasks/${id}`, {
      method: 'DELETE',
      ...options,
    }),
};

export { apiRequest as apiFetch };
