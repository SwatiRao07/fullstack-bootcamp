function format(input: string | number | boolean): string {
  if (typeof input === "string") {
    return input.toUpperCase();
  } 
  if (typeof input === "number") {
    return input.toFixed(2);
  }
  return input ? "TRUE" : "FALSE";
}

console.log(format("hello"))
console.log(typeof format(12))
console.log(format(false))



 
