import { Task, Priority } from './types';
import { TaskCollection, TaskStats, calculateStats, createTaskCollection } from './collection';
import { createTask } from './operations';

export type TaskEvent = 'added' | 'updated' | 'deleted';
export type TaskEventListener = (event: TaskEvent, task: Task) => void;

export class TaskManager {
  private tasks: Map<string, Task>;
  private listeners: Set<TaskEventListener> = new Set();

  constructor(initialTasks: Task[] = []) {
    this.tasks = new Map(
      initialTasks.map(t => [
        t.id, 
        { ...t, createdAt: new Date(t.createdAt) }
      ])
    );
  }

  add(taskData: Omit<Task, 'id' | 'createdAt' | 'completed'>): Task {
    const newTask = createTask(taskData.title, taskData.priority);
    this.tasks.set(newTask.id, newTask);
    this.notify('added', newTask);
    return newTask;
  }

  update(id: string, updates: Partial<Task>): Task {
    const task = this.tasks.get(id);
    if (!task) {
      throw new Error(`Task with id ${id} not found`);
    }
    const updatedTask = { ...task, ...updates };
    this.tasks.set(id, updatedTask);
    this.notify('updated', updatedTask);
    return updatedTask;
  }

  delete(id: string): boolean {
    const task = this.tasks.get(id);
    if (task) {
      const deleted = this.tasks.delete(id);
      this.notify('deleted', task);
      return deleted;
    }
    return false;
  }

  getStats(): TaskStats {
    return calculateStats(Array.from(this.tasks.values()));
  }

  export(): TaskCollection {
    return createTaskCollection(Array.from(this.tasks.values()));
  }

  subscribe(listener: TaskEventListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(event: TaskEvent, task: Task): void {
    this.listeners.forEach(listener => listener(event, task));
  }
}
