import { db } from "../config/database";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

async function reset() {
  console.log("Resetting database...");

  try {
    if (db.isSQLite()) {
      await db.query("DROP TABLE IF EXISTS tasks");
      await db.query("DROP TABLE IF EXISTS users");

      const migrationPath = path.join(
        __dirname,
        "../db/migrations/sqlite_init.sql",
      );
      const sql = fs.readFileSync(migrationPath, "utf8");
      const native = db.getNativeDb();
      (native as any).exec(sql);
    } else {
      // For Postgres, we might want to drop and recreate the schema or just truncate
      await db.query("DROP TABLE IF EXISTS tasks CASCADE");
      await db.query("DROP TABLE IF EXISTS users CASCADE");

      // Run PG migration - we'll assume the setup/scripts/create_tables.ts or similar
      // But for this exercise, let's just run the one from integrations
      const migrationPath = path.join(
        __dirname,
        "../../../../integrations/src/db/migrations/001_initial_schema.sql",
      );
      const sql = fs.readFileSync(migrationPath, "utf8");
      await db.query(sql);
    }

    console.log("Database successfully reset and tables recreated.");
  } catch (err) {
    console.error("Reset failed:", err);
    process.exit(1);
  } finally {
    await db.close();
  }
}

reset();
