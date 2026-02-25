function lengthOf<T extends { length: number }>(x: T): number {
  return x.length;
}

console.log(lengthOf("hello"));       
console.log(lengthOf([1, 2, 3]));    
console.log(lengthOf({ length: 99 }));

// console.log(lengthOf(123)); //


type HasId = { id: number };
type HasName = { name: string };

function printInfo<T extends HasId & HasName>(obj: T): void {
  console.log(`ID: ${obj.id}, Name: ${obj.name}`);
}

printInfo({ id: 1, name: "divya" });
