import { Task, Priority } from './types';

export interface TaskCollection {
  tasks: Task[];
  metadata: {
    total: number;
    completed: number;
    lastModified: Date;
  };
}

export interface TaskStats {
  byPriority: Record<Priority, number>;
  byStatus: {
    completed: number;
    pending: number;
  };
  averageAge: number; // in milliseconds or days, let's go with days.
}

export function createTaskCollection(tasks: Task[]): TaskCollection {
  return {
    tasks,
    metadata: {
      total: tasks.length,
      completed: tasks.filter(t => t.completed).length,
      lastModified: new Date(),
    },
  };
}

export function calculateStats(tasks: Task[]): TaskStats {
  const byPriority: Record<Priority, number> = {
    low: 0,
    medium: 0,
    high: 0,
  };

  const byStatus: { completed: number; pending: number } = {
    completed: 0,
    pending: 0,
  };

  let totalAge = 0;
  const now = new Date().getTime();

  tasks.forEach(task => {
    byPriority[task.priority]++;
    if (task.completed) {
      byStatus.completed++;
    } else {
      byStatus.pending++;
    }
    totalAge += (now - task.createdAt.getTime());
  });

  return {
    byPriority,
    byStatus,
    averageAge: tasks.length > 0 ? (totalAge / (1000 * 60 * 60 * 24 * tasks.length)) : 0,
  };
}
