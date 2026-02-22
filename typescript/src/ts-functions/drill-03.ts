// function sumAll(...nums: number[]): number {
//   let total = 0;

//   for (const num of nums) {
//     total += num;
//   }

//   return total;
// }

     

function sumAll(...nums: (string | number)[]): number {
  let total = 0;

  for (const num of nums) {
    if (typeof num === "number") {
      total += num;
    } else {
      total += Number(num);
    }
  }

  return total;
}

console.log(sumAll("s", "k"));              
console.log(sumAll());   