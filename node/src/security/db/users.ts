import { db } from './connection';

export interface User {
  id: number;
  email: string;
  password_hash: string;
  role: string;
}

export async function createUser(email: string, passwordHash: string, role: string = 'user') {
  const stmt = db.prepare('INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)');
  const info = stmt.run(email, passwordHash, role);
  return { id: info.lastInsertRowid, email, role };
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  return stmt.get(email) as User | undefined;
}

export function closeDb() {
  if (db) db.close();
}

process.on('exit', () => closeDb());
process.on('SIGINT', () => {
  closeDb();
  process.exit(0);
});
