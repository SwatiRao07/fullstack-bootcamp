type Person30 = {
  name: string;
  age: number;
};

function greet(person: Person30) {
  console.log(`Hello, ${person.name}, age ${person.age}`);
}

const user1 = {
  name: "ramya",
  age: 23,
  role: "Developer",  
  department: "HR"
};

greet(user1);