import { fetchJson, FetchOptions } from "./baseClient";
import { logger } from "../utils/logger";
import { ApiError } from "../utils/errors";

export interface RetryOptions {
  maxRetries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
}

const RETRYABLE_STATUSES = new Set([502, 503, 504, 429]);

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
        throw err;
      }

      if (attempt >= maxRetries) {
        throw err;
      }

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
