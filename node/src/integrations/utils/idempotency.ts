import { v4 as uuidv4 } from "uuid";

export function withIdempotency(
  options: RequestInit = {},
  key?: string,
): RequestInit {
  const headers = new Headers(options.headers as HeadersInit);
  headers.set("Idempotency-Key", key ?? uuidv4());
  return { ...options, headers };
}
