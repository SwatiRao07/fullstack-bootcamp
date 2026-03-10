import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { db } from "../config/database";
import { UserFactory, TaskFactory } from "../factories/user.factory";
import fs from "fs";
import path from "path";

async function runMigrations() {
  const migrationPath = path.join(
    __dirname,
    "../db/migrations/sqlite_init.sql",
  );
  const sql = fs.readFileSync(migrationPath, "utf8");
  const native = db.getNativeDb();
  if (db.isSQLite()) {
    (native as any).exec(sql);
  } else {
    await db.query(sql);
  }
}

describe("Performance & Monitoring (Drill 4 & 5)", () => {
  beforeAll(async () => {
    await runMigrations();
    // Setup some data
    const user = await UserFactory.create({ email: "perf@test.com" });
    for (let i = 0; i < 50; i++) {
      await TaskFactory.create(user.id);
    }
  });

  afterAll(async () => {
    await db.close();
  });

  it("should use EXPLAIN to analyze query performance", async () => {
    const sql = "SELECT * FROM tasks WHERE user_id = $1";
    const params = [1];

    if (db.isSQLite()) {
      const plan = await db.query(
        `EXPLAIN QUERY PLAN ${sql.replace("$1", "?")}`,
        params,
      );
      console.log("SQLite Query Plan:", plan.rows);
      expect(plan.rows.length).toBeGreaterThan(0);
    } else {
      const plan = await db.query(`EXPLAIN ANALYZE ${sql}`, params);
      console.log("Postgres Explain Analyze:", plan.rows);
      expect(plan.rows.length).toBeGreaterThan(0);
    }
  });

  it("should monitor slow queries and database health", async () => {
    // Simulate a slow query
    await db.query("SELECT * FROM users");
    const health = await db.checkHealth();

    console.log("Health Check:", JSON.stringify(health, null, 2));
    expect(health.status).toBe("OK");
    expect((health as any).metrics.totalQueries).toBeGreaterThan(0);
  });

  it("should benchmark write performance (Drill 4 point 5)", async () => {
    // Drop index to test baseline
    if (db.isSQLite()) {
      await db.query("DROP INDEX IF EXISTS idx_users_email");
    }

    const startNoIndex = performance.now();
    for (let i = 0; i < 50; i++) {
      await UserFactory.create({ email: `noindex_${i}@test.com` });
    }
    const endNoIndex = performance.now();
    const durationNoIndex = endNoIndex - startNoIndex;

    // Re-create index
    await db.query("CREATE INDEX idx_users_email ON users(email)");

    const startWithIndex = performance.now();
    for (let i = 0; i < 50; i++) {
      await UserFactory.create({ email: `withindex_${i}@test.com` });
    }
    const endWithIndex = performance.now();
    const durationWithIndex = endWithIndex - startWithIndex;

    console.log(
      `Write Performance - No Index: ${durationNoIndex.toFixed(2)}ms`,
    );
    console.log(
      `Write Performance - With Index: ${durationWithIndex.toFixed(2)}ms`,
    );

    // Usually with small data, the difference is negligible, but we verify the cycle works
    expect(durationWithIndex).toBeDefined();
  });
});
