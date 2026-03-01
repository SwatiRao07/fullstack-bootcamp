import * as fs from "node:fs";
import * as path from "node:path";
import { parse as parseCsv } from "csv-parse/sync";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import pino from "pino";

const logger = pino({ level: "info" });

const users = sqliteTable("users", {
  id:    integer("id").primaryKey({ autoIncrement: true }),
  name:  text("name").notNull(),
  email: text("email").notNull(),
});

const sqlite = new Database(":memory:");
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id    INTEGER PRIMARY KEY AUTOINCREMENT,
    name  TEXT NOT NULL,
    email TEXT NOT NULL
  );
`);
const db = drizzle(sqlite, { schema: { users } });

const csvPath = path.resolve(import.meta.dirname, "users.csv");
const rows = parseCsv(fs.readFileSync(csvPath, "utf-8"), {
  columns: true,
  skip_empty_lines: true,
  trim: true,
}) as Array<{ name: string; email: string }>;

logger.info(`Parsed ${rows.length} rows from CSV`);

for (const row of rows) {
  db.insert(users).values({ name: row.name, email: row.email }).run();
  logger.info({ name: row.name, email: row.email }, "Inserted user");
}

const all = db.select().from(users).all();
logger.info(`Done — ${all.length} users in DB`);

sqlite.close();
