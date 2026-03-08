import fs from "fs";
import path from "path";
import { pool } from "../src/config/database";

async function runMigration() {
  const migrationPath = path.join(
    __dirname,
    "../src/db/migrations/01_init.sql",
  );
  const sql = fs.readFileSync(migrationPath, "utf8");

  try {
    console.log("Running initial migration...");
    await pool.query(sql);
    console.log("Migration completed successfully.");
  } catch (err) {
    console.error("Error running migration:", err);
  } finally {
    await pool.end();
  }
}

runMigration();
