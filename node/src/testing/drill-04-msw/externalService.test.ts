import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse, delay } from 'msw';
import { fetchExternalData } from './externalService';

let retryCount = 0;

const server = setupServer(
  http.get('https://api.example.com/external-profile/:id', ({ params }) => {
    const { id } = params;

    if (id === '1') return HttpResponse.json({ id: 1, bio: 'Mocked' });
    if (id === '401') return new HttpResponse(null, { status: 401 });

    if (id === 'retry') {
      retryCount++;
      if (retryCount < 3) return new HttpResponse(null, { status: 500 });
      return HttpResponse.json({ success: true });
    }

    return new HttpResponse(null, { status: 404 });
  })
);

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  retryCount = 0;
});
afterAll(() => server.close());

describe('External Services with MSW', () => {
  it('should map 401 to 502', async () => {
    await expect(fetchExternalData('401')).rejects.toThrow(/External Auth Failed/);
    try {
      await fetchExternalData('401');
    } catch (e: any) {
      expect(e.status).toBe(502);
    }
  });

  it('should retry on 500 with exponential backoff', async () => {
    const data = await fetchExternalData('retry');
    expect(retryCount).toBe(3);
    expect(data.success).toBe(true);
  });
});
