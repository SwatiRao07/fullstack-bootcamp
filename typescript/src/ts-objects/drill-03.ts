type Person6 = {
  name: string;
  middleName?: string; // optional property
  age: number;
};

const person7: Person6 = {
  name: "Charlie",
  age: 10
};

console.log(person7);

console.log(person7.middleName?.toUpperCase()); 





