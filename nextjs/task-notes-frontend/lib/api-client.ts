import { cookies } from 'next/headers';
import { ApiTask } from './api'; // Re-use the interface from api.ts

import { config } from './config';

async function authenticatedRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  const response = await fetch(`${config.apiUrl}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (response.status === 401) {
    // Cannot delete cookies directly here without redirect, but proxy should handle this.
    // Throwing error for now as requested by instructions
    throw new Error('Authentication required');
  }

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  if (response.status === 204) {
    return null as T;
  }
  return response.json();
}

export const apiClient = {
  getTasks: () => authenticatedRequest<ApiTask[]>('/tasks'),
  getTask: (id: string) => authenticatedRequest<ApiTask>(`/tasks/${id}`),
  createTask: (task: Omit<ApiTask, 'id' | 'createdAt' | 'updatedAt'>) =>
    authenticatedRequest<ApiTask>('/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    }),
  updateTask: (id: string, updates: Partial<ApiTask>) =>
    authenticatedRequest<ApiTask>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
  deleteTask: (id: string) =>
    authenticatedRequest<void>(`/tasks/${id}`, {
      method: 'DELETE',
    }),
};
