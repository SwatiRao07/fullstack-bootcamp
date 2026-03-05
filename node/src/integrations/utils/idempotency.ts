// ─── Drill Set 6: Idempotency Key for POST Requests ──────────────────────────
import { v4 as uuidv4 } from "uuid";

/**
 * Adds a stable `Idempotency-Key` header to POST requests so they can be
 * safely retried without risk of duplication (e.g., Stripe payments).
 *
 * Pass the same key on retries to guarantee idempotent behaviour.
 */
export function withIdempotency(
  options: RequestInit = {},
  key?: string,
): RequestInit {
  const headers = new Headers(options.headers as HeadersInit);
  headers.set("Idempotency-Key", key ?? uuidv4());
  return { ...options, headers };
}
