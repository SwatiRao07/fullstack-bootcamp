import fs from "fs";
import path from "path";
import { pool, query } from "../config/database";

async function ensureMigrationTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id SERIAL PRIMARY KEY,
      filename TEXT UNIQUE NOT NULL,
      applied_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
}

async function getAppliedMigrations(): Promise<string[]> {
  const result = await query("SELECT filename FROM schema_migrations");
  return result.rows.map((r) => r.filename);
}

async function runMigration(filename: string, content: string) {
  const client = await pool.connect();
  try {
    console.log(`Applying migration: ${filename}...`);
    await client.query("BEGIN");

    await client.query(content);

    await client.query("INSERT INTO schema_migrations (filename) VALUES ($1)", [
      filename,
    ]);

    await client.query("COMMIT");
    console.log(`Successfully applied: ${filename}`);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(`Failed to apply migration ${filename}:`, err);
    throw err;
  } finally {
    client.release();
  }
}

async function startMigrations() {
  try {
    await ensureMigrationTable();
    const applied = await getAppliedMigrations();

    const migrationsPath = path.join(__dirname, "migrations");
    const migrationFiles = fs
      .readdirSync(migrationsPath)
      .filter((f) => f.endsWith(".sql"))
      .sort();

    const pending = migrationFiles.filter((f) => !applied.includes(f));

    if (pending.length === 0) {
      console.log("No new migrations to apply.");
      return;
    }

    for (const filename of pending) {
      const content = fs.readFileSync(
        path.join(migrationsPath, filename),
        "utf8",
      );
      await runMigration(filename, content);
    }

    console.log("All migrations completed successfully.");
  } catch (err) {
    console.error("Migration runner failed:", err);
    process.exit(-1);
  } finally {
    if (require.main === module) {
      await pool.end();
    }
  }
}

if (require.main === module) {
  startMigrations();
}

export { startMigrations };
