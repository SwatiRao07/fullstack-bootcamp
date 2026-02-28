const resolvedValue: Promise<number> = Promise.resolve(42);

async function add1(a: number, b: number): Promise<number> {
  return a + b;
}

function callbackStyle(val: number, cb: (err: Error | null, result?: number) => void) {
  if (val < 0) {
    cb(new Error("Negative value"));
  } else {
    cb(null, val * 2);
  }
}

function promiseStyle(val: number): Promise<number> {
  return new Promise((resolve, reject) => {
    callbackStyle(val, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result!);
      }
    });
  });
}

async function demo() {
  console.log("Add:", await add1(10, 20));
  console.log("Promise Style:", await promiseStyle(5));
  resolvedValue.then(v => console.log("Resolved Promise:", v));
}

demo();
