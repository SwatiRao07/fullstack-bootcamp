function wait(ms: number): Promise<string> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(`Finished in ${ms}ms`);
    }, ms);
  });
}

async function sequential() {
  console.time("Sequential");

  const a = await wait(1000);
  const b = await wait(2000);

  console.log(a);
  console.log(b);

  console.timeEnd("Sequential");
}

sequential();


async function parallel() {
  console.time("Parallel");

  const [a, b] = await Promise.all([
    wait(1000),
    wait(1000),
  ]);

  console.log(a);
  console.log(b);

  console.timeEnd("Parallel");
}

parallel();
