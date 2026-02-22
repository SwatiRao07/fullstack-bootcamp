function processId(id: string | number | boolean): string {
  if (typeof id === "string") {
    return `String ID: ${id.toUpperCase()}`;
  } else if (typeof id === "number") {
    return `Numeric ID: ${id.toFixed(2)}`;
  } else {
    return `Boolean ID: ${id ? "TRUE" : "FALSE"}`;
  }
}

console.log(processId("demo"));
console.log(processId(42));
console.log(processId(true));
