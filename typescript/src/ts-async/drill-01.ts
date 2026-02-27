function getMessage(): Promise<string> {
  console.log("Function started");

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Hello after 2 seconds!");
    }, 2000);
  });
}

console.log("Before calling function");

const result = getMessage();

console.log("After calling function");

result.then(message => {
  console.log("Promise resolved with:", message);
});

function add1(a: number, b: number): Promise<number> {
  return Promise.resolve(a + b);
}

add1(2, 3).then(console.log);