import express from 'express';
import { Worker } from 'node:worker_threads';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { logger } from '../../integrations/utils/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());

const fibonacci = (n: number): number => {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
};

app.get('/fib-main/:n', (req, res) => {
  const n = parseInt(req.params.n);
  const start = Date.now();
  const result = fibonacci(n);
  const duration = Date.now() - start;

  logger.info({ n, result, duration }, 'Fibonacci calculated in main thread.');
  res.json({ n, result, duration, thread: 'main' });
});

app.get('/fib-worker/:n', (req, res) => {
  const n = parseInt(req.params.n);

  const workerPath = path.join(__dirname, 'fibonacci.worker.js');

  const worker = new Worker(workerPath, {
    workerData: { n },
  });

  worker.on('message', (data) => {
    logger.info(
      { n, result: data.result, duration: data.duration },
      'Fibonacci calculated in worker thread.'
    );
    res.json({ n, ...data, thread: 'worker' });
  });

  worker.on('error', (err: any) => {
    logger.error({ n, error: err.message }, 'Worker thread error.');
    if (!res.headersSent) {
      res.status(500).json({ error: err.message });
    }
  });

  worker.on('exit', (code) => {
    if (code !== 0) {
      logger.error({ n, code }, 'Worker exited with non-zero code.');
      if (!res.headersSent) {
        res.status(500).json({ error: `Worker stopped with exit code ${code}` });
      }
    }
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  logger.info(`Server listening on http://localhost:${PORT}`);
});

export default app;
