async function runWithLimit<T>(limit: number, tasks: (() => Promise<T>)[]): Promise<T[]> {
  const results: T[] = [];
  const queue = [...tasks];
  
  const worker = async () => {
    while (queue.length > 0) {
      const task = queue.shift()!;
      const result = await task();
      results.push(result);
    }
  };

  const workers = Array.from({ length: limit }, () => worker());
  
  await Promise.all(workers);
  return results;
}

async function runDrill7() {
  const tasks = [1, 2, 3, 4, 5].map(id => async () => {
    console.log(`Task ${id} starting`);
    await new Promise(r => setTimeout(r, 500));
    console.log(`Task ${id} finished`);
    return id;
  });

  console.log("Running tasks with limit 2 (You should see them finish in pairs)...");
  await runWithLimit(2, tasks);
}

runDrill7();
