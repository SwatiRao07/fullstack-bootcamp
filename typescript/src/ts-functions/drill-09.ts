type Calculator = (a: number, b: number) => number;
type Validator = (input: string) => boolean;

const adds: Calculator = (a, b) => a + b;
const multiply: Calculator = (a, b) => a * b;

function executeCalculation(
  calc: Calculator,
  x: number,
  y: number
): number {
  return calc(x, y);
}

console.log(executeCalculation(adds, 5, 3))
console.log(executeCalculation(multiply, 5, 3))
