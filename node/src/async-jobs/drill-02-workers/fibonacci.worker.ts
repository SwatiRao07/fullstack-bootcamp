import { parentPort, workerData } from 'node:worker_threads';

const fibonacci = (n: number): number => {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
};

const runTask = () => {
  try {
    const { n } = workerData;
    const startTime = Date.now();
    const result = fibonacci(n);
    const duration = Date.now() - startTime;

    parentPort?.postMessage({ result, duration });
  } catch (error) {
    parentPort?.postMessage({ error: (error as Error).message });
  }
};

runTask();
