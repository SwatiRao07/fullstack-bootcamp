import { pool } from "../../setup/src/config/database";

export const tagService = {
  async getAllTags() {
    const { rows } = await pool.query("SELECT * FROM tags");
    return rows;
  },

  async addTag(name: string) {
    const { rows } = await pool.query(
      "INSERT INTO tags (name) VALUES ($1) RETURNING *",
      [name],
    );
    return rows[0];
  },

  async assignTagsToTask(taskId: number, tagIds: number[]) {
    const queries = tagIds.map((tagId) =>
      pool.query(
        "INSERT INTO task_tags (task_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
        [taskId, tagId],
      ),
    );
    await Promise.all(queries);
    return { success: true };
  },

  async getTasksWithTags() {
    const { rows } = await pool.query(`
      SELECT t.id, t.title, STRING_AGG(g.name, ', ') as tag_names
      FROM tasks t
      LEFT JOIN task_tags tt ON t.id = tt.task_id
      LEFT JOIN tags g ON tt.tag_id = g.id
      GROUP BY t.id, t.title;
    `);
    return rows;
  },
};
