import Database from 'better-sqlite3';
import type { Database as LibDatabase } from 'better-sqlite3';

let db: LibDatabase;

export const getTestDb = () => {
  if (!db) {
    db = new Database(':memory:');
    // Basic migration for the drills
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }
  return db;
};

export const clearDb = () => {
  try {
    const dbInstance = getTestDb();
    dbInstance.prepare('DELETE FROM users').run();
  } catch (err: any) {
    if (err.message.includes('database connection is closed')) {
      // Reset singleton so next call reopens
      (db as any) = null;
    }
  }
};
