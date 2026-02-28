function timeout<T>(p: Promise<T>, ms: number): Promise<T> {
  const timeoutPromise = new Promise<T>((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Operation timed out after ${ms}ms`));
    }, ms);
  });

  return Promise.race([p, timeoutPromise]);
}

async function slowOperation() {
  return new Promise((resolve) => {
    setTimeout(() => resolve("Success!"), 2000);
  });
}

async function runDrill4() {
  console.log("Starting slow operation with 1s timeout...");
  try {
    await timeout(slowOperation(), 1000);
  } catch (err: any) {
    console.log("Caught expected error:", err.message);
  }

  console.log("\nStarting slow operation with 3s timeout...");
  try {
    const result = await timeout(slowOperation(), 3000);
    console.log("Result:", result);
  } catch (err: any) {
    console.log("Unexpected error:", err.message);
  }
}

runDrill4();
