import { logger } from "../utils/logger";
import { CircuitOpenError } from "../utils/errors";

type State = "CLOSED" | "OPEN" | "HALF_OPEN";

export class CircuitBreaker {
  private state: State = "CLOSED";
  private consecutiveFailures: number = 0;
  private openedAt: number = 0;

  constructor(
    private readonly threshold: number = 3,
    private readonly resetTimeoutMs: number = 10_000,
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === "OPEN") {
      if (Date.now() - this.openedAt >= this.resetTimeoutMs) {
        this.state = "HALF_OPEN";
        logger.info("CircuitBreaker → HALF_OPEN (probing)");
      } else {
        throw new CircuitOpenError();
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (err) {
      this.onFailure();
      throw err;
    }
  }

  private onSuccess(): void {
    if (this.state !== "CLOSED") {
      logger.info("CircuitBreaker → CLOSED (recovered)");
    }
    this.consecutiveFailures = 0;
    this.state = "CLOSED";
  }

  private onFailure(): void {
    this.consecutiveFailures++;
    if (
      this.consecutiveFailures >= this.threshold ||
      this.state === "HALF_OPEN"
    ) {
      this.state = "OPEN";
      this.openedAt = Date.now();
      logger.error(
        { failures: this.consecutiveFailures, resetIn: this.resetTimeoutMs },
        "CircuitBreaker → OPEN",
      );
    }
  }

  getState(): State {
    return this.state;
  }

  reset(): void {
    this.state = "CLOSED";
    this.consecutiveFailures = 0;
    this.openedAt = 0;
  }
}

export const globalCircuitBreaker = new CircuitBreaker();
