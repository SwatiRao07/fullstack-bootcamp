import { http, HttpResponse, delay } from 'msw';

const callCounts: Record<string, number> = {};

function countOf(key: string): number {
  callCounts[key] = (callCounts[key] ?? 0) + 1;
  return callCounts[key];
}

export function resetCounts(): void {
  Object.keys(callCounts).forEach((k) => delete callCounts[k]);
}

export const BASE = 'https://api.example.com';

export const handlers = [
  http.get(`${BASE}/data`, () => {
    return HttpResponse.json({ id: 1, name: 'Integration data' });
  }),

  http.get(`${BASE}/protected`, () => {
    return new HttpResponse(null, { status: 401, statusText: 'Unauthorized' });
  }),

  http.get(`${BASE}/flaky`, () => {
    const n = countOf('flaky');
    if (n < 3) {
      return new HttpResponse(null, {
        status: 503,
        statusText: 'Service Unavailable',
      });
    }
    return HttpResponse.json({ message: 'Eventually succeeded' });
  }),

  http.get(`${BASE}/slow`, async () => {
    await delay(7_000);
    return HttpResponse.json({ message: 'Too slow' });
  }),

  http.get(`${BASE}/rate-limited`, () => {
    return new HttpResponse(null, {
      status: 429,
      headers: { 'Retry-After': '2' },
    });
  }),

  http.get(`${BASE}/bad-json`, () => {
    return new HttpResponse('not valid json', {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }),

  http.post(`${BASE}/create`, ({ request }) => {
    const key = request.headers.get('idempotency-key');
    return HttpResponse.json({ idempotencyKey: key, created: true });
  }),
];
