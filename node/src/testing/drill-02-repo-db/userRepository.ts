import { Pool } from 'pg';

export interface User {
  id: number;
  email: string;
  name: string;
}

export class UserRepositoryPostgres {
  constructor(private pool: Pool) {}

  async createUser(email: string, name: string): Promise<User> {
    const result = await this.pool.query(
      'INSERT INTO users (email, name) VALUES ($1, $2) RETURNING id, email, name',
      [email, name]
    );
    return result.rows[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await this.pool.query('SELECT id, email, name FROM users WHERE email = $1', [
      email,
    ]);
    return result.rows[0];
  }

  async getUserByEmailOrId(idOrEmail: number | string): Promise<User | undefined> {
    const query =
      typeof idOrEmail === 'number'
        ? 'SELECT id, email, name FROM users WHERE id = $1'
        : 'SELECT id, email, name FROM users WHERE email = $1';
    const result = await this.pool.query(query, [idOrEmail]);
    return result.rows[0];
  }

  async getUsers(limit: number, offset: number): Promise<User[]> {
    const result = await this.pool.query(
      'SELECT id, email, name FROM users ORDER BY id LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    return result.rows;
  }

  async truncate(): Promise<void> {
    await this.pool.query('TRUNCATE TABLE users RESTART IDENTITY CASCADE');
  }
}
