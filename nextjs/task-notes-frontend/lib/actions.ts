'use server';

import { ApiTask } from './api';
import { apiClient } from './api-client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createTaskAction(formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const priority = formData.get('priority') as ApiTask['priority'];

  if (!title || title.trim().length < 3) {
    throw new Error('Title must be at least 3 characters');
  }

  try {
    await apiClient.createTask({
      title: title.trim(),
      description: description?.trim(),
      priority,
      completed: false,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create task';
    console.error('Failed to create task:', error);
    throw new Error(message);
  }

  revalidatePath('/tasks');
  redirect('/tasks');
}

export async function updateTaskAction(id: string, formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const priority = formData.get('priority') as ApiTask['priority'];
  const completed = formData.get('completed') === 'on';

  if (!title || title.trim().length < 3) {
    throw new Error('Title must be at least 3 characters');
  }

  try {
    await apiClient.updateTask(
      id,
      {
        title: title.trim(),
        description: description?.trim(),
        priority,
        completed,
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update task';
    console.error('Failed to update task:', error);
    throw new Error(message);
  }

  revalidatePath('/tasks');
  revalidatePath(`/tasks/${id}`);
  redirect(`/tasks/${id}`);
}


export async function toggleTaskCompletionAction(id: string, completed: boolean) {
  try {
    await apiClient.updateTask(id, { completed });
    revalidatePath('/tasks');
    revalidatePath(`/tasks/${id}`);
  } catch (error) {
    console.error('Failed to toggle task:', error);
    throw new Error('Failed to toggle task');
  }
}


export async function deleteTaskAction(id: string) {
  try {
    await apiClient.deleteTask(id);
    revalidatePath('/tasks');
  } catch (error) {
    console.error('Failed to delete task:', error);
    throw new Error('Failed to delete task');
  }
}
