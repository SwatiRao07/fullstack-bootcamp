function isEven(n: number): boolean {
  return n % 2 === 0;
}

console.log(isEven(99))

const value1 = 10;

if (isEven(value1)) {
  console.log("Even number");
} else {
  console.log("Odd number");
}