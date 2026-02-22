const square = (n: number): number => n * n;

const numberss = [1, 2, 3, 4];

const doubled = numberss.map((n) => n * 2);
console.log("Doubled:", doubled);

const evens = numberss.filter((n) => n % 2 === 0);
console.log("Evens:", evens);

const sum = numberss.reduce((acc, curr) => acc + curr, 0);
console.log("Sum:", sum);