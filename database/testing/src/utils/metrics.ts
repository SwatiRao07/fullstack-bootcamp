export class QueryMetrics {
  private queryCounts: number = 0;
  private totalDuration: number = 0;
  private slowQueries: { sql: string; duration: number; timestamp: Date }[] =
    [];

  recordQuery(sql: string, duration: number) {
    this.queryCounts++;
    this.totalDuration += duration;
    if (duration > 100) {
      this.slowQueries.push({
        sql,
        duration,
        timestamp: new Date(),
      });
    }
  }

  getStats() {
    return {
      totalQueries: this.queryCounts,
      avgDuration:
        this.queryCounts > 0
          ? (this.totalDuration / this.queryCounts).toFixed(2)
          : 0,
      slowQueryCount: this.slowQueries.length,
      slowQueries: this.slowQueries.slice(-5), // Last 5 slow ones
    };
  }

  reset() {
    this.queryCounts = 0;
    this.totalDuration = 0;
    this.slowQueries = [];
  }
}

export const metrics = new QueryMetrics();
