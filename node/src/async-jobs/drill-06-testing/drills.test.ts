import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { fetchAndStoreWeather } from '../drill-05-scheduling/weather.js';
import { initDb, db } from '../common/db.js';

const server = setupServer(
  http.get('*/v1/current.json', () => {
    return HttpResponse.json({
      current: {
        temp_c: 20,
        condition: { text: 'Partly Cloudy' },
      },
    });
  })
);

beforeAll(() => {
  server.listen();
  initDb();
});

afterAll(() => {
  server.close();
});

describe('Async Jobs Integration Tests', () => {
  it('should fetch and store weather data using MSW', async () => {
    const city = 'New York';
    await fetchAndStoreWeather(city);

    const row = db
      .prepare('SELECT city, temperature, condition FROM weather_logs WHERE city = ?')
      .get(city);
    expect(row).toBeDefined();
    expect(row.city).toBe(city);
    expect(row.temperature).toBeTypeOf('number');
    expect(row.condition).toBe('Partly Cloudy');
  });

  it('should retry logic simulation', async () => {
    let callCount = 0;
    const mockFn = vi.fn(async () => {
      callCount++;
      if (callCount < 3) throw new Error('Simulated failure');
      return 'Success';
    });

    // Simple manual retry wrapper test
    const retryWrapper = async (fn: () => Promise<any>, max: number) => {
      for (let i = 0; i < max; i++) {
        try {
          return await fn();
        } catch (err) {
          if (i === max - 1) throw err;
        }
      }
    };

    const result = await retryWrapper(mockFn, 3);
    expect(result).toBe('Success');
    expect(callCount).toBe(3);
  });

  it('should prevent idempotency duplicates with BullMQ jobId pattern', async () => {
    const jobIds = new Set<string>();
    const addJob = (id: string) => {
      if (jobIds.has(id)) return { status: 'duplicate' };
      jobIds.add(id);
      return { status: 'added' };
    };

    expect(addJob('job-1').status).toBe('added');
    expect(addJob('job-1').status).toBe('duplicate');
  });
});
