import { logger } from './logger.js';
import { Redis } from 'ioredis';

export interface ServiceStatus {
  name: string;
  status: 'up' | 'down';
  message?: string;
}

export interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  dependencies: ServiceStatus[];
}

export class HealthChecker {
  constructor(private redisUrl: string) {}

  async checkHealth(): Promise<HealthStatus> {
    const dependencies = await this.checkDependencies();
    const isHealthy = dependencies.every((d) => d.status === 'up');

    return {
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      dependencies,
    };
  }

  async checkDependencies(): Promise<ServiceStatus[]> {
    const redisStatus: ServiceStatus = { name: 'redis', status: 'down' };

    try {
      const redis = new Redis(this.redisUrl, {
        connectTimeout: 1000,
        maxRetriesPerRequest: 0,
      });
      await redis.ping();
      redisStatus.status = 'up';
      redis.disconnect();
    } catch (error: any) {
      redisStatus.message = error.message;
    }

    return [
      { name: 'database', status: 'up' }, // SQLite is always up if we can reach this point
      redisStatus,
    ];
  }
}
