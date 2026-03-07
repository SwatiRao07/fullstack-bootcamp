import { logger } from './logger.js';

export interface MetricsSnapshot {
  requests: {
    total: number;
    byMethod: Record<string, number>;
  };
  errors: number;
  avgDuration: number;
}

export class MetricsCollector {
  private totalRequests = 0;
  private totalErrors = 0;
  private totalDuration = 0;
  private methodCounts: Record<string, number> = {};

  recordRequest(method: string, route: string, duration: number): void {
    this.totalRequests++;
    this.totalDuration += duration;
    this.methodCounts[method] = (this.methodCounts[method] || 0) + 1;
  }

  recordError(error: Error): void {
    this.totalErrors++;
    logger.debug({ error: error.message }, 'Error recorded in metrics');
  }

  getMetrics(): MetricsSnapshot {
    return {
      requests: {
        total: this.totalRequests,
        byMethod: this.methodCounts,
      },
      errors: this.totalErrors,
      avgDuration: this.totalRequests === 0 ? 0 : this.totalDuration / this.totalRequests,
    };
  }
}
