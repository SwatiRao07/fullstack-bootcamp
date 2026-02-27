function fetchData(signal: AbortSignal): Promise<string> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      resolve("Data received");
    }, 5000);

    signal.addEventListener("abort", () => {
      clearTimeout(timeoutId);
      reject(new Error("Request was aborted"));
    });
  });
}

async function run6() {
  const controller = new AbortController();
  const signal = controller.signal;

  const promise = fetchData(signal);

  setTimeout(() => {
    console.log("Aborting request");
    controller.abort();
  }, 2000);

  try {
    const result = await promise;
    console.log(result);
  } catch (error) {
    console.log("Error:", error.message);
  }
}

run6();