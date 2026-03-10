import { faker } from "@faker-js/faker";
import { db } from "../config/database";

export const UserFactory = {
  async create(overrides: { email?: string } = {}) {
    const email = overrides.email || faker.internet.email();
    const res = await db.query(
      "INSERT INTO users (email) VALUES ($1) RETURNING *",
      [email],
    );
    if (db.isSQLite()) {
      const last = await db.query(
        "SELECT * FROM users WHERE id = last_insert_rowid()",
      );
      return last.rows[0];
    }
    return res.rows[0];
  },
};

export const TaskFactory = {
  async create(
    userId: number,
    overrides: { title?: string; completed?: boolean } = {},
  ) {
    const title = overrides.title || faker.lorem.sentence();
    const completed = overrides.completed ?? false;

    const res = await db.query(
      "INSERT INTO tasks (title, completed, user_id) VALUES ($1, $2, $3) RETURNING *",
      [title, completed ? 1 : 0, userId],
    );

    if (db.isSQLite()) {
      const last = await db.query(
        "SELECT * FROM tasks WHERE id = last_insert_rowid()",
      );
      return last.rows[0];
    }
    return res.rows[0];
  },
};
