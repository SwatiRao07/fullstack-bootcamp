import { v4 as uuidv4 } from "uuid";
import {
  Task,
  CreateTaskSchema,
  UpdateTaskSchema,
  TaskFilter,
} from "../models/task.js";

class TaskService {
  private tasks: Map<string, Task> = new Map();

  async create(taskData: any): Promise<Task> {
    const id = uuidv4();
    const now = new Date().toISOString();

    const task: Task = {
      ...taskData,
      id,
      createdAt: now,
      updatedAt: now,
      status: taskData.status || "todo",
      priority: taskData.priority || "medium",
    };

    this.tasks.set(id, task);
    return task;
  }

  async getAll(filter: TaskFilter): Promise<{ data: Task[]; total: number }> {
    let filteredTasks = Array.from(this.tasks.values());

    // Filtering
    if (filter.status) {
      filteredTasks = filteredTasks.filter((t) => t.status === filter.status);
    }
    if (filter.priority) {
      filteredTasks = filteredTasks.filter(
        (t) => t.priority === filter.priority,
      );
    }
    if (filter.search) {
      const search = filter.search.toLowerCase();
      filteredTasks = filteredTasks.filter(
        (t) =>
          t.title.toLowerCase().includes(search) ||
          (t.description && t.description.toLowerCase().includes(search)),
      );
    }

    // Sorting
    filteredTasks.sort((a, b) => {
      const fieldA = (a as any)[filter.sortBy];
      const fieldB = (b as any)[filter.sortBy];

      if (fieldA < fieldB) return filter.sortOrder === "asc" ? -1 : 1;
      if (fieldA > fieldB) return filter.sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    const total = filteredTasks.length;

    // Pagination
    const pagedTasks = filteredTasks.slice(
      filter.offset,
      filter.offset + filter.limit,
    );

    return { data: pagedTasks, total };
  }

  async getById(id: string): Promise<Task | null> {
    return this.tasks.get(id) || null;
  }

  async update(id: string, updateData: any): Promise<Task | null> {
    const existing = this.tasks.get(id);
    if (!existing) return null;

    const updatedTask: Task = {
      ...existing,
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async delete(id: string): Promise<boolean> {
    return this.tasks.delete(id);
  }
}

export const taskService = new TaskService();
