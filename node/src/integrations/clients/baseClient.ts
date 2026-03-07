import { logger } from '../utils/logger';
import { ApiError, ParseError, TimeoutError } from '../utils/errors';

export interface FetchOptions extends RequestInit {
  timeoutMs?: number;
}

export async function fetchJson<T = unknown>(url: string, options: FetchOptions = {}): Promise<T> {
  const { timeoutMs = 5_000, ...init } = options;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const start = Date.now();
  let status: number | undefined;

  try {
    const response = await fetch(url, { ...init, signal: controller.signal });
    clearTimeout(timer);

    status = response.status;
    const duration = Date.now() - start;

    logger.info({ url, status, duration }, 'HTTP request completed');

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new ApiError(`Non-2xx response: ${status} ${response.statusText}`, status, url, {
        body,
        retryAfter: response.headers.get('retry-after') ?? undefined,
      });
    }

    const text = await response.text();

    try {
      return JSON.parse(text) as T;
    } catch {
      throw new ParseError('Failed to parse response as JSON', url, {
        body: text.slice(0, 200),
      });
    }
  } catch (err: unknown) {
    clearTimeout(timer);

    if (err instanceof Error && err.name === 'AbortError') {
      throw new TimeoutError(timeoutMs, url);
    }

    if (err instanceof ApiError || err instanceof ParseError || err instanceof TimeoutError) {
      throw err;
    }

    throw new ApiError(
      (err instanceof Error ? err.message : String(err)) || 'Network error',
      0,
      url,
      { cause: String(err) }
    );
  }
}
