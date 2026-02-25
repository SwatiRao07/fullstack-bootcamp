function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

const n = first([10, 20, 30]);
if (n !== undefined) {
  n.toFixed(); 
}
// n.toFixed();

const s = first(["a", "b", "c"]);
const mix = first([1, "two"]);

if (typeof mix === "string") {
  mix.toUpperCase(); 
}
if (typeof mix === "number") {
  mix.toFixed();
}


