import { query } from "../config/database";
import { Task } from "../models/schema";
import { BaseRepository } from "./BaseRepository";

export class TaskRepository extends BaseRepository<Task> {
  protected tableName = "tasks";

  async findByUser(userId: number): Promise<Task[]> {
    const result = await query("SELECT * FROM tasks WHERE user_id = $1", [
      userId,
    ]);
    return result.rows;
  }

  async markComplete(id: number): Promise<Task | null> {
    const result = await query(
      "UPDATE tasks SET completed = TRUE WHERE id = $1 RETURNING *",
      [id],
    );
    return result.rows[0] || null;
  }

  async create(
    title: string,
    userId?: number,
    categoryId?: number,
  ): Promise<Task> {
    const result = await query(
      `INSERT INTO tasks (title, user_id, category_id) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [title, userId || null, categoryId || null],
    );
    return result.rows[0];
  }
}
