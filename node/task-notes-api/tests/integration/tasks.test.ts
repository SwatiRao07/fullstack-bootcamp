import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import { TaskServer } from '../../src/server.js';
import { FileStorage } from '../../src/storage.js';
import { TaskEventEmitter } from '../../src/events.js';
import { UserDatabase } from '../../src/database.js';
import { AuthService } from '../../src/auth/service.js';
import { HealthChecker } from '../../src/monitoring.js';
import { MetricsCollector } from '../../src/metrics.js';
import { loadConfig } from '../../src/config.js';
import fs from 'fs/promises';
import path from 'path';

describe('Tasks API', () => {
  let server: TaskServer;
  let token: string;
  const config = loadConfig();
  const testDataPath = './data/test-notes.json';
  const testDbPath = './data/test-users.db';

  beforeEach(async () => {
    // Unique paths for each test run to avoid race conditions/locks
    const id = Math.random().toString(36).substring(7);
    const currentTestDataPath = `./data/test-notes-${id}.json`;
    const currentTestDbPath = `./data/test-users-${id}.db`;

    const storage = new FileStorage(currentTestDataPath);
    const emitter = new TaskEventEmitter();
    const userDb = new UserDatabase(currentTestDbPath);
    const authService = new AuthService(userDb, config);
    const healthChecker = new HealthChecker();
    const metrics = new MetricsCollector();

    server = new TaskServer(config, storage, emitter, authService, healthChecker, metrics);

    // Register and login to get token
    await authService.register('test@example.com', 'password123');
    token = await authService.login('test@example.com', 'password123');
  });

  afterAll(async () => {
    await server.stop();
    // Cleanup will be harder with random IDs unless we track them,
    // but for now let's just use one and try to close it if we can.
  });

  describe('GET /api/tasks', () => {
    it('returns empty list when no tasks exist', async () => {
      const response = await request(server.getApp())
        .get('/api/tasks')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
    });

    it('returns paginated tasks', async () => {
      // Create a task first
      await request(server.getApp())
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Test Task', priority: 'high' });

      const response = await request(server.getApp())
        .get('/api/tasks')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].title).toBe('Test Task');
    });
  });

  describe('POST /api/tasks', () => {
    it('creates task with valid data', async () => {
      const response = await request(server.getApp())
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Real Task', priority: 'medium' });

      expect(response.status).toBe(201);
      expect(response.body.title).toBe('Real Task');
      expect(response.body.id).toBeDefined();
    });

    it('rejects invalid data', async () => {
      const response = await request(server.getApp())
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: '' }); // Short title

      expect(response.status).toBe(400);
    });
  });
});
