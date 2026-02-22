const numbers: number[] = [1, 2, 3];
const names: Array<string> = ["deepika", "surya"];

// numbers.push("4"); 
// names.push(123); 

const mixed: (string | number)[] = [1, "two", 3, "four"];

mixed.forEach(item => {
  if (typeof item === "string") {
    console.log(item.toUpperCase());
  } else {
    console.log(item.toFixed(2));
  }
});

function getElement(arr: number[], index: number): number | undefined {
  if (index >= 0 && index < arr.length) {
    return arr[index];
  }
  return undefined;
}

console.log(getElement(numbers, 1)); 
console.log(getElement(numbers, 2));