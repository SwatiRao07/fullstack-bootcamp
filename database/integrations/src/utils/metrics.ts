
// Metrics collection for query performance and status tracking

export const metrics = {
  queries: 0,
  errors: 0,
  slowQueries: 0,

  recordQuery(duration: number) {
    this.queries++;
    if (duration > 100) this.slowQueries++;
  },
  recordError() {
    this.errors++;
  },
};
