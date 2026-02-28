function withTimeoutSignal(ms: number) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort(new Error(`Timed out after ${ms}ms`));
  }, ms);

  controller.signal.addEventListener('abort', () => clearTimeout(timeoutId));

  return { 
    controller, 
    signal: controller.signal,
    cleanup: () => clearTimeout(timeoutId)
  };
}

async function mockFetch(url: string, { signal }: { signal?: AbortSignal } = {}) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      resolve(`Response from ${url}`);
    }, 2000);

    if (signal) {
      if (signal.aborted) {
        clearTimeout(timeoutId);
        reject(signal.reason);
      }
      signal.addEventListener('abort', () => {
        clearTimeout(timeoutId);
        reject(signal.reason);
      });
    }
  });
}

async function retryUntilAborted<T>(op: (signal: AbortSignal) => Promise<T>, signal: AbortSignal): Promise<T> {
    while (true) {
        try {
            return await op(signal);
        } catch (err: any) {
            if (signal.aborted) {
                console.log("Abort detected in retry loop. Stopping.");
                throw err;
            }
            console.log("Retrying...");
            await new Promise(r => setTimeout(r, 100));
        }
    }
}

async function runDrill6() {
  console.log("--- Testing Timeout Abort ---");
  const { signal, cleanup } = withTimeoutSignal(1000);
  try {
    await mockFetch("https://api.example.com/fast", { signal });
    cleanup();
  } catch (err: any) {
    console.log("Fetch aborted:", err.message);
  }

  console.log("\n--- Testing Combined Retry and Abort ---");
  const controller = new AbortController();
  
  setTimeout(() => controller.abort(new Error("Manual Cancel")), 500);

  try {
    await retryUntilAborted(async (sig) => {
        return mockFetch("https://api.example.com/unstable", { signal: sig });
    }, controller.signal);
  } catch (err: any) {
    console.log("Final error caught:", err.message);
  }
}

runDrill6();
