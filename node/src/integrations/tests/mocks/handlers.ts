// ─── Drill Set 5 & 6: MSW Request Handlers ────────────────────────────────────
import { http, HttpResponse, delay } from "msw";

// Track call count per handler for retry assertions
const callCounts: Record<string, number> = {};

function countOf(key: string): number {
  callCounts[key] = (callCounts[key] ?? 0) + 1;
  return callCounts[key];
}

export function resetCounts(): void {
  Object.keys(callCounts).forEach((k) => delete callCounts[k]);
}

export const BASE = "https://api.example.com";

export const handlers = [
  // ── Drill 5: Happy path ──────────────────────────────────────────────────
  http.get(`${BASE}/data`, () => {
    return HttpResponse.json({ id: 1, name: "Integration data" });
  }),

  // ── Drill 5: 401 Unauthorized ────────────────────────────────────────────
  http.get(`${BASE}/protected`, () => {
    return new HttpResponse(null, { status: 401, statusText: "Unauthorized" });
  }),

  // ── Drill 5: 503 that succeeds on the 3rd attempt ────────────────────────
  http.get(`${BASE}/flaky`, () => {
    const n = countOf("flaky");
    if (n < 3) {
      return new HttpResponse(null, {
        status: 503,
        statusText: "Service Unavailable",
      });
    }
    return HttpResponse.json({ message: "Eventually succeeded" });
  }),

  // ── Drill 5: Delayed response → triggers client-side timeout ─────────────
  http.get(`${BASE}/slow`, async () => {
    await delay(7_000); // longer than our 5 s default timeout
    return HttpResponse.json({ message: "Too slow" });
  }),

  // ── Drill 6: 429 with Retry-After ────────────────────────────────────────
  http.get(`${BASE}/rate-limited`, () => {
    return new HttpResponse(null, {
      status: 429,
      headers: { "Retry-After": "2" },
    });
  }),

  // ── Drill 6: Invalid JSON body ────────────────────────────────────────────
  http.get(`${BASE}/bad-json`, () => {
    return new HttpResponse("not valid json", {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),

  // ── Drill 6: POST with idempotency key ───────────────────────────────────
  http.post(`${BASE}/create`, ({ request }) => {
    const key = request.headers.get("idempotency-key");
    return HttpResponse.json({ idempotencyKey: key, created: true });
  }),
];
