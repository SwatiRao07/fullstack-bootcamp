export class IntegrationError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly url?: string,
    public readonly context?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "IntegrationError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

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

export class ParseError extends IntegrationError {
  constructor(message: string, url: string, context?: Record<string, unknown>) {
    super(message, undefined, url, context);
    this.name = "ParseError";
  }
}

export class TimeoutError extends IntegrationError {
  constructor(timeoutMs: number, url: string) {
    super(`Request timed out after ${timeoutMs}ms`, undefined, url);
    this.name = "TimeoutError";
  }
}

export class CircuitOpenError extends IntegrationError {
  constructor() {
    super("Circuit breaker is OPEN — request blocked");
    this.name = "CircuitOpenError";
  }
}
