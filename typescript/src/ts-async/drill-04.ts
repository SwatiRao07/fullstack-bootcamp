function timeout(ms: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error("Operation timed out"));
    }, ms);
  });
}

async function fetchWithTimeout() {
  const fakeApi = new Promise<string>((resolve) => {
    setTimeout(() => {
      resolve("User data");
    }, 3000);
  });

  return Promise.race([
    fakeApi,
    timeout(1000)
  ]);
}

async function run6() {
  try {
    const result = await fetchWithTimeout();
    console.log("Success:", result);
  } catch (err) {
    console.log("Error:", err);
  }
}

run6();