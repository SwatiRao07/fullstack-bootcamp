import { Task, Priority } from './types';

export type TaskQuery = {
  completed?: boolean;
  priority?: Priority | Priority[];
  titleContains?: string;
  createdAfter?: Date;
  createdBefore?: Date;
};

export type SortKey = keyof Pick<Task, 'title' | 'priority' | 'createdAt'>;
export type SortDirection = 'asc' | 'desc';

export interface QueryResult<T> {
  data: T[];
  total: number;
  page?: number;
  hasMore?: boolean;
}

export function queryTasks(
  tasks: Task[],
  query: TaskQuery = {},
  sort: { key: SortKey; direction: SortDirection } = { key: 'createdAt', direction: 'desc' }
): QueryResult<Task> {
  let filtered = tasks.filter(task => {
    if (query.completed !== undefined && task.completed !== query.completed) {
      return false;
    }
    if (query.priority !== undefined) {
      const priorities = Array.isArray(query.priority) ? query.priority : [query.priority];
      if (!priorities.includes(task.priority)) {
        return false;
      }
    }
    if (query.titleContains && !task.title.toLowerCase().includes(query.titleContains.toLowerCase())) {
      return false;
    }
    if (query.createdAfter && task.createdAt < query.createdAfter) {
      return false;
    }
    if (query.createdBefore && task.createdAt > query.createdBefore) {
      return false;
    }
    return true;
  });

  const priorityScore: Record<Priority, number> = { high: 3, medium: 2, low: 1 };
  
  filtered.sort((a, b) => {
    let aVal = a[sort.key];
    let bVal = b[sort.key];

    if (sort.key === 'priority') {
      aVal = priorityScore[a.priority] as any;
      bVal = priorityScore[b.priority] as any;
    } else if (sort.key === 'createdAt') {
      aVal = a.createdAt.getTime() as any;
      bVal = b.createdAt.getTime() as any;
    }

    if (aVal < bVal) return sort.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sort.direction === 'asc' ? 1 : -1;
    return 0;
  });

  return {
    data: filtered,
    total: filtered.length,
  };
}
