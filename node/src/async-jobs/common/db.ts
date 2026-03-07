import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const Database = require('better-sqlite3');
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, '../../../async-jobs.db');

let db: any;

export function initDb() {
  db = new Database(dbPath);

  db.exec(`
    CREATE TABLE IF NOT EXISTS weather_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      city TEXT NOT NULL,
      temperature REAL,
      condition TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      duration_ms INTEGER,
      UNIQUE(city, timestamp)
    )
  `);
  return db;
}

export { db };
