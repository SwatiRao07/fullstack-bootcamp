import { parentPort, workerData } from "node:worker_threads";

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

try {
  const { n } = workerData;
  const startTime = Date.now();
  const result = fibonacci(n);
  const duration = Date.now() - startTime;
  parentPort?.postMessage({ result, duration });
} catch (error) {
  parentPort?.postMessage({ error: error.message });
}
