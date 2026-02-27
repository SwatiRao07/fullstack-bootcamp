async function test() {
  return 5;
}

console.log(test());

function wait1(): Promise<string> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve("Done");
    }, 2000);
  });
}

async function run1() {
  console.log("Start");

  const result = await wait1();

  console.log("Result:", result);
  console.log("End");
}

run1();