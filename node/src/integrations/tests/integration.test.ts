import { describe, it, expect, beforeAll, afterEach, afterAll } from "vitest";
import { setupServer } from "msw/node";
import { handlers, BASE, resetCounts } from "./mocks/handlers";
import { fetchJson } from "../clients/baseClient";
import { fetchWithRetry } from "../clients/retryClient";
import { withAuth } from "../auth/helpers";
import { withIdempotency } from "../utils/idempotency";
import { ApiError, ParseError, TimeoutError } from "../utils/errors";
import { CircuitBreaker } from "../resilience/circuitBreaker";

const mswServer = setupServer(...handlers);

beforeAll(() => mswServer.listen({ onUnhandledRequest: "error" }));
afterEach(() => {
  mswServer.resetHandlers();
  resetCounts();
});
afterAll(() => mswServer.close());

describe("Test case : Happy path", () => {
  it("parses a valid JSON response correctly", async () => {
    const data = await fetchJson<{ id: number; name: string }>(`${BASE}/data`);
    expect(data.id).toBe(1);
    expect(data.name).toBe("Integration data");
  });
});

describe("Test case : 401 Unauthorized", () => {
  it("throws ApiError with statusCode 401", async () => {
    const options = withAuth({}, "bad-token");
    await expect(fetchJson(`${BASE}/protected`, options)).rejects.toThrow(
      ApiError,
    );

    try {
      await fetchJson(`${BASE}/protected`, options);
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError);
      expect((err as ApiError).statusCode).toBe(401);
    }
  });
});

describe("Test case : 503 retries & backoff", () => {
  it("succeeds after 3 attempts (2 failures + 1 success)", async () => {
    const data = await fetchWithRetry<{ message: string }>(
      `${BASE}/flaky`,
      {},
      { maxRetries: 3, baseDelayMs: 10 }, // short delay for tests
    );
    expect(data.message).toBe("Eventually succeeded");
  });
});

describe("Test case : Client-side timeout", () => {
  it("throws TimeoutError when server is too slow", async () => {
    await expect(fetchJson(`${BASE}/slow`, { timeoutMs: 500 })).rejects.toThrow(
      TimeoutError,
    );
  }, 3_000);
});

describe("Test case : Invalid JSON response", () => {
  it("throws ParseError on unparseable body", async () => {
    await expect(fetchJson(`${BASE}/bad-json`)).rejects.toThrow(ParseError);
  });
});

describe("Test case : 429 Rate Limit (Retry-After)", () => {
  it("throws ApiError with statusCode 429 after exhausting retries", async () => {
    await expect(
      fetchWithRetry(
        `${BASE}/rate-limited`,
        {},
        { maxRetries: 1, baseDelayMs: 10 },
      ),
    ).rejects.toMatchObject({ statusCode: 429 });
  });
});

describe("Test case : POST with idempotency key", () => {
  it("sends and echoes the idempotency key", async () => {
    const options = withIdempotency({ method: "POST", body: "{}" });
    const key = (options.headers as Headers).get("idempotency-key");
    expect(key).toBeTruthy();

    const data = await fetchJson<{ idempotencyKey: string; created: boolean }>(
      `${BASE}/create`,
      options,
    );
    expect(data.idempotencyKey).toBe(key);
    expect(data.created).toBe(true);
  });
});

describe("Test Case: Circuit Breaker", () => {
  it("opens after 3 consecutive failures", async () => {
    const cb = new CircuitBreaker(3, 10_000);
    const fail = () => Promise.reject(new Error("boom"));

    for (let i = 0; i < 3; i++) {
      await cb.execute(fail).catch(() => {});
    }

    expect(cb.getState()).toBe("OPEN");
    await expect(cb.execute(() => Promise.resolve("ok"))).rejects.toThrowError(
      "Circuit breaker is OPEN",
    );
  });
});
