import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { Pool } from 'pg';
import { UserRepositoryPostgres } from './userRepository';
import fs from 'fs';
import path from 'path';

describe('Repo + DB Integration (Postgres)', () => {
  let container: StartedPostgreSqlContainer;
  let pool: Pool;
  let repo: UserRepositoryPostgres;

  beforeAll(async () => {

    container = await new PostgreSqlContainer('postgres:16-alpine').start();

    pool = new Pool({
      connectionString: container.getConnectionUri(),
    });

    // 2. Run your migrations against the container
    const migrationPath = path.resolve(__dirname, './migrations/01_create_users.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    await pool.query(sql);

    repo = new UserRepositoryPostgres(pool);
  }, 60000);

  afterAll(async () => {
    if (pool) await pool.end();
    if (container) await container.stop();
  });

  beforeEach(async () => {
    await repo.truncate();
  });

  it('should create and retrieve a user by email', async () => {
    const email = 'test@example.com';
    const name = 'Test User';

    const created = await repo.createUser(email, name);
    expect(created.id).toBeDefined();
    expect(created.email).toBe(email);

    const retrieved = await repo.getUserByEmail(email);
    expect(retrieved).toBeDefined();
    expect(retrieved?.id).toBe(created.id);
    expect(retrieved?.name).toBe(name);
  });

  it('should throw unique-violation error on duplicate email', async () => {
    const email = 'duplicate@example.com';
    await repo.createUser(email, 'First');

    await expect(repo.createUser(email, 'Second')).rejects.toThrow();
  });
});
