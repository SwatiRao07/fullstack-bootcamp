function toArray(x: string): string[];
function toArray(x: number): number[];
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

// function add1(a:string, b:string): string;
// function add1(a:number, b:number): number;
// function add1(a:any, b:any){
//     return a+b;
// }


// console.log(add1(5,9))