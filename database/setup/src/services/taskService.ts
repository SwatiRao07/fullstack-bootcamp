import { query } from "../config/database";
import { Task } from "../models/schema";

export const taskService = {
  async createTask(title: string, userId?: number): Promise<Task> {
    const result = await query(
      "INSERT INTO tasks (title, user_id) VALUES ($1, $2) RETURNING *",
      [title, userId || null],
    );
    return result.rows[0];
  },

  async getTasks(completed?: boolean): Promise<Task[]> {
    if (completed !== undefined) {
      const result = await query("SELECT * FROM tasks WHERE completed = $1", [
        completed,
      ]);
      return result.rows;
    }
    const result = await query("SELECT * FROM tasks");
    return result.rows;
  },

  async updateTaskStatus(id: number, completed: boolean): Promise<Task | null> {
    const result = await query(
      "UPDATE tasks SET completed = $1 WHERE id = $2 RETURNING *",
      [completed, id],
    );
    return result.rows[0] || null;
  },

  async deleteTask(id: number): Promise<boolean> {
    const result = await query("DELETE FROM tasks WHERE id = $1", [id]);
    return (result.rowCount ?? 0) > 0;
  },

  async getUserTasks(userId: number): Promise<Task[]> {
    const result = await query("SELECT * FROM tasks WHERE user_id = $1", [
      userId,
    ]);
    return result.rows;
  },

  async getTasksWithEmployees(): Promise<any[]> {
    // Drill 4: JOIN to get tasks with user email
    const sql = `
      SELECT t.id, t.title, t.completed, u.email 
      FROM tasks t 
      JOIN users u ON t.user_id = u.id
    `;
    const result = await query(sql);
    return result.rows;
  },
};
