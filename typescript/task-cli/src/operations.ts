import { Task, Priority, TaskStatus } from './types';
import { randomUUID } from 'crypto';

export function createTask(title: string, priority: Priority = 'medium'): Task {
  if (!title || title.trim().length === 0) {
    throw new Error('Title cannot be empty');
  }
  return {
    id: randomUUID(),
    title,
    completed: false,
    priority,
    createdAt: new Date(),
  };
}

export function markCompleted(task: Task): Task {
  return { ...task, completed: true };
}

export function filterByStatus(tasks: Task[], status: boolean): Task[] {
  return tasks.filter(task => task.completed === status);
}

const priorityMap: Record<Priority, number> = {
  high: 3,
  medium: 2,
  low: 1
};

export function sortByPriority(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => priorityMap[b.priority] - priorityMap[a.priority]);
}

export function validateTask(task: Partial<Task>): boolean {
  return !!(task.title && task.title.trim().length > 0);
}
