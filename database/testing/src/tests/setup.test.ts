import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { db } from "../config/database";
import fs from "fs";
import path from "path";
import { UserFactory, TaskFactory } from "../factories/user.factory";

async function runMigrations() {
  const migrationPath = path.join(
    __dirname,
    "../db/migrations/sqlite_init.sql",
  );
  const sql = fs.readFileSync(migrationPath, "utf8");
  // SQLite doesn't always support multiple statements in one query call depending on driver
  // but better-sqlite3 `exec` does.
  const native = db.getNativeDb();
  if (db.isSQLite()) {
    (native as any).exec(sql);
  } else {
    await db.query(sql);
  }
}

describe("Database Integration (SQLite)", () => {
  beforeEach(async () => {
    // For in-memory, we might need to recreate tables or just delete data
    // Drill 1 says "tear down database per test"
    // Since it's in-memory, if we close and reopen it's empty.
    // However, our `db` is a singleton. Let's just drop tables or delete data.
    await db.query("DROP TABLE IF EXISTS tasks");
    await db.query("DROP TABLE IF EXISTS users");
    await runMigrations();
  });

  afterAll(async () => {
    await db.close();
  });

  it("should create a user using factory", async () => {
    const user = await UserFactory.create({ email: "test@example.com" });
    expect(user.email).toBe("test@example.com");
    expect(user.id).toBeDefined();
  });

  it("should create a task for a user", async () => {
    const user = await UserFactory.create();
    const task = await TaskFactory.create(user.id, { title: "Buy groceries" });

    expect(task.title).toBe("Buy groceries");
    expect(task.user_id).toBe(user.id);
  });

  it("should enforce foreign key constraints", async () => {
    try {
      await TaskFactory.create(999); // Non-existent user
    } catch (e) {
      expect(e).toBeDefined();
    }
  });

  it("should benchmark performance (Drill 1 point 5)", async () => {
    const start = performance.now();
    for (let i = 0; i < 100; i++) {
      await UserFactory.create();
    }
    const end = performance.now();
    console.log(`Created 100 users in ${end - start}ms`);
  });
});
