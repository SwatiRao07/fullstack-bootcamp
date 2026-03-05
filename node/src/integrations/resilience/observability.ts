import { v4 as uuidv4 } from "uuid";
import { logger } from "../utils/logger";

export function withRequestId(
  options: RequestInit = {},
  id?: string,
): RequestInit {
  const headers = new Headers(options.headers as HeadersInit);
  const requestId = id ?? uuidv4();
  headers.set("x-request-id", requestId);
  return { ...options, headers };
}

export function getRequestId(options: RequestInit): string | null {
  return (options.headers as Headers)?.get?.("x-request-id") ?? null;
}

type Bucket = "2xx" | "4xx" | "5xx" | "unknown";

function bucket(status: number): Bucket {
  if (status >= 200 && status < 300) return "2xx";
  if (status >= 400 && status < 500) return "4xx";
  if (status >= 500 && status < 600) return "5xx";
  return "unknown";
}

export class MetricsTracker {
  private histogram: Record<Bucket, number> = {
    "2xx": 0,
    "4xx": 0,
    "5xx": 0,
    unknown: 0,
  };

  recordStatus(status: number): void {
    this.histogram[bucket(status)]++;
  }

  recordLatency(url: string, durationMs: number, requestId?: string): void {
    const meta = { url, durationMs, requestId };
    if (durationMs > 500) {
      logger.warn(meta, "High latency detected (>500ms)");
    } else {
      logger.debug(meta, "Latency recorded");
    }
  }

  getHistogram(): Readonly<Record<Bucket, number>> {
    return { ...this.histogram };
  }

  reset(): void {
    this.histogram = { "2xx": 0, "4xx": 0, "5xx": 0, unknown: 0 };
  }
}

export const globalMetrics = new MetricsTracker();
