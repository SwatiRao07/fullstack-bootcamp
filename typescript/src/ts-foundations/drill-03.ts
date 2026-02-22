let value: unknown = "hello";

let length = (value as string).length;
console.log(length); 

let forced = value as number;
// console.log(forced.toFixed(2));

function printLength(input: unknown) {
  const str = input as string;
  console.log(str.length);
}

printLength("typescript"); 
printLength(123);    