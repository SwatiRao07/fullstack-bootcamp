function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function unstableApi(): Promise<string> {
  return new Promise((resolve, reject) => {
    const success = Math.random() > 0.7; // 30% success rate

    setTimeout(() => {
      if (success) {
        resolve("API Success");
      } else {
        reject("API Failed");
      }
    }, 500);
  });
}

async function retryWithBackoff(
  maxRetries: number,
  delay: number
): Promise<string> {
  try {
    console.log("Trying API");
    return await unstableApi();
  } catch (error) {
    if (maxRetries === 0) {
      throw error;
    }

    console.log(`Failed. Retrying in ${delay}ms.`);
    await sleep(delay);

    return retryWithBackoff(maxRetries - 1, delay * 2);
  }
}

async function run5() {
  try {
    const result = await retryWithBackoff(3, 500);
    console.log("Final Result:", result);
  } catch (error) {
    console.log("Completely failed after retries.");
  }
}

run5();