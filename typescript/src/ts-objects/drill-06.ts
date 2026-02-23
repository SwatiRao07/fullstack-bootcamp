interface Person20 {
  readonly id: string;
  name: string;
  middleName?: string;
  age: number;
}

interface Employee extends Person20 {
  role: string;
  department?: string;
}

const emp1: Employee = {
  id: "zzzz",
  name: "Swati",
  age: 23,
  role: "Developer"
};

console.log(emp1);

const emp2: Employee = {
  id: "jjjjj",
  name: "Rao",
  age: 19,
  role: "Manager",
  department: "HR"
};

console.log(emp2);