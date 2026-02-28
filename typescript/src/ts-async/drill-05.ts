const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function retry<T>(
  op: () => Promise<T>, 
  attempts: number = 2, 
  backoffMs: number = 250
): Promise<T> {
  let lastError: any;

  for (let i = 0; i <= attempts; i++) {
    try {
      return await op();
    } catch (err: any) {
      lastError = err;
      
      if (i === attempts || !err.retryable) {
        throw lastError;
      }

      console.log(`Attempt ${i + 1} failed. Retrying in ${backoffMs}ms...`);
      await sleep(backoffMs);
    }
  }

  throw lastError;
}

class TransientError extends Error {
  retryable = true;
  constructor(message: string) {
    super(message);
    this.name = "TransientError";
  }
}

class FatalError extends Error {
  retryable = false;
  constructor(message: string) {
    super(message);
    this.name = "FatalError";
  }
}

async function runDrill5() {
  let count = 0;
  
  console.log("--- Testing Retry with Transient Errors ---");
  try {
    const result = await retry(async () => {
      count++;
      if (count < 3) {
        throw new TransientError("Temp failure");
      }
      return "Final Success";
    }, 3);
    console.log("Result:", result);
  } catch (err: any) {
    console.log("Retry failed:", err.message);
  }

  console.log("\n--- Testing Retry with Fatal Error ---");
  try {
    await retry(async () => {
      throw new FatalError("Permanent failure");
    }, 3);
  } catch (err: any) {
    console.log("Caught fatal error immediately:", err.message);
  }
}

runDrill5();
