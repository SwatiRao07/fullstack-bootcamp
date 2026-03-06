import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import app from './userApp';
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { Pool } from 'pg';
import { UserRepositoryPostgres } from '../drill-02-repo-db/userRepository';
import fs from 'fs';
import path from 'path';

describe('Drill 3 — API + DB Integration (Postgres)', () => {
  let container: StartedPostgreSqlContainer;
  let pool: Pool;
  let repo: UserRepositoryPostgres;

  beforeAll(async () => {
    // Start Postgres container
    container = await new PostgreSqlContainer('postgres:16-alpine').start();

    pool = new Pool({
      connectionString: container.getConnectionUri(),
    });

    // Run migrations
    const migrationPath = path.resolve(
      __dirname,
      '../drill-02-repo-db/migrations/01_create_users.sql'
    );
    const sql = fs.readFileSync(migrationPath, 'utf8');
    await pool.query(sql);

    repo = new UserRepositoryPostgres(pool);

    // Inject repo into app locals
    app.locals.userRepo = repo;
  }, 60000);

  afterAll(async () => {
    if (pool) await pool.end();
    if (container) await container.stop();
  });

  beforeEach(async () => {
    await repo.truncate();
  });

  it('should create a user via POST /users', async () => {
    const payload = { email: 'api@example.com', name: 'API User' };
    const response = await request(app).post('/users').send(payload);

    expect(response.status).toBe(201);
    expect(response.body.email).toBe(payload.email);
    expect(response.body.id).toBeDefined();
  });

  it('should retrieve a seeded user by ID', async () => {
    // 1. Seed the DB with known users
    const user = await repo.createUser('seeded@example.com', 'Seeded');

    // 2. Call /users/:id GET and assert it returns seeded user
    const response = await request(app).get(`/users/${user.id}`);

    expect(response.status).toBe(200);
    expect(response.body.email).toBe(user.email);
  });

  it('should return 404 for missing ID', async () => {
    // 3. Call /users/:id GET with missing ID and assert 404
    const response = await request(app).get('/users/999');
    expect(response.status).toBe(404);
  });

  it('should return RFC 7807 error on missing input', async () => {
    const response = await request(app).post('/users').send({});
    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toContain('application/problem+json');
    expect(response.body.title).toBe('Invalid Input');
  });

  it('should test pagination query params', async () => {
    // 4. Seed multiple users
    for (let i = 1; i <= 5; i++) {
      await repo.createUser(`user${i}@example.com`, `User ${i}`);
    }

    // 5. Test pagination query params return the expected slice
    const response = await request(app).get('/users').query({ limit: 2, offset: 1 });

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    // User IDs are serial, so user1=1, user2=2... offset 1 should start at user2
    expect(response.body[0].email).toBe('user2@example.com');
  });
});
