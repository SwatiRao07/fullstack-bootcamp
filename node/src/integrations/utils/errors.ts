// ─── Drill Set 1 & 4: Consistent Error Objects ───────────────────────────────

export class IntegrationError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly url?: string,
    public readonly context?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "IntegrationError";
    // Maintain proper prototype chain
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/** Thrown when the API returns a non-2xx status */
export class ApiError extends IntegrationError {
  constructor(
    message: string,
    statusCode: number,
    url: string,
    context?: Record<string, unknown>,
  ) {
    super(message, statusCode, url, context);
    this.name = "ApiError";
  }
}

/** Thrown when the response body cannot be parsed as JSON */
export class ParseError extends IntegrationError {
  constructor(message: string, url: string, context?: Record<string, unknown>) {
    super(message, undefined, url, context);
    this.name = "ParseError";
  }
}

/** Thrown when the request exceeds the configured timeout */
export class TimeoutError extends IntegrationError {
  constructor(timeoutMs: number, url: string) {
    super(`Request timed out after ${timeoutMs}ms`, undefined, url);
    this.name = "TimeoutError";
  }
}

/** Thrown when the circuit breaker is in OPEN state */
export class CircuitOpenError extends IntegrationError {
  constructor() {
    super("Circuit breaker is OPEN — request blocked");
    this.name = "CircuitOpenError";
  }
}
