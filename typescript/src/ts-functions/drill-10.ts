function processData1(data: unknown): string {
  if (typeof data === "string") {
    return data.toUpperCase();
  }

  if (typeof data === "number") {
    return data.toFixed(2);
  }

  if (typeof data === "boolean") {
    return data ? "TRUE" : "FALSE";
  }

  return "Unsupported data type";
}

console.log(processData1(5))
console.log(processData1(true))
console.log(processData1({}))
console.log(processData1("hello"))

function logData(data: unknown): void {
  console.log("Received:", data);
}

logData(25)

function throwError(message: string): never {
  throw new Error(message);
}

throwError("Something is wrong !")
