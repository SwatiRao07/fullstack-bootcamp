// ─── Drill Set 2: Retries & Exponential Backoff ───────────────────────────────
import { fetchJson, FetchOptions } from "./baseClient";
import { logger } from "../utils/logger";
import { ApiError } from "../utils/errors";

export interface RetryOptions {
  /** Maximum number of retry attempts (default: 3) */
  maxRetries?: number;
  /** Base delay in ms for exponential backoff (default: 500) */
  baseDelayMs?: number;
  /** Maximum cap on any single delay (default: 10 000) */
  maxDelayMs?: number;
}

const RETRYABLE_STATUSES = new Set([502, 503, 504, 429]);

/**
 * fetchWithRetry<T>(url, options?)
 *
 * Wraps fetchJson with:
 *  • Retries on 502 / 503 / 504 / 429.
 *  • Skips retries on all other 4xx errors.
 *  • Exponential back-off with ±100 ms jitter.
 *  • Honours the Retry-After header when the server sends one.
 *  • Logs each retry attempt with count and delay.
 */
export async function fetchWithRetry<T = unknown>(
  url: string,
  fetchOptions: FetchOptions = {},
  retryOptions: RetryOptions = {},
): Promise<T> {
  const {
    maxRetries = 3,
    baseDelayMs = 500,
    maxDelayMs = 10_000,
  } = retryOptions;

  let attempt = 0;

  while (true) {
    try {
      return await fetchJson<T>(url, fetchOptions);
    } catch (err: unknown) {
      if (
        !(err instanceof ApiError) ||
        !RETRYABLE_STATUSES.has(err.statusCode ?? 0)
      ) {
        throw err; // Not retryable
      }

      if (attempt >= maxRetries) {
        throw err; // Exhausted retries
      }

      // Determine delay — respect Retry-After if present
      let delay: number;
      const retryAfterSec = err.context?.retryAfter;
      if (retryAfterSec && !isNaN(Number(retryAfterSec))) {
        delay = Number(retryAfterSec) * 1_000;
        logger.info(
          { url, retryAfter: retryAfterSec },
          "Using Retry-After header",
        );
      } else {
        const exponential = baseDelayMs * Math.pow(2, attempt);
        const jitter = Math.random() * 100;
        delay = Math.min(exponential + jitter, maxDelayMs);
      }

      attempt++;
      logger.warn(
        { url, attempt, delay: Math.round(delay), status: err.statusCode },
        "Retrying request",
      );

      await sleep(delay);
    }
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
