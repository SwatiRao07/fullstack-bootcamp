import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from './pingApp';

describe('Integration Testing Basics', () => {
  it('should respond with { ok: true } on /ping', async () => {
    const response = await request(app).get('/ping');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true });
  });

  it('should intentionally fail', async () => {
    const response = await request(app).get('/ping');
    expect(response.status).toBe(404);
  });
});
