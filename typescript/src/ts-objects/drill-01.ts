type Person = {
  name: string;
  age: number;
};

const person1: Person = {
  name: "Monu",
  age: 20,
};

console.log(person1);

type PersonWithId = {
  readonly id: string;
  name: string;
  age: number;
};

const person3: PersonWithId = {
  id: "5555",
  name: "Sonu",
  age: 65
};


person3.name="neha"

console.log(person3);
