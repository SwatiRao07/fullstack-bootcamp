function toArray(x: string | number): string[] | number[] {
  if (typeof x === "string") {
    return x.split("");
  } else {
    return [x];
  }
}

const result1 = toArray("hello"); 
const result2 = toArray(42);      

console.log(result1)
console.log(result2)