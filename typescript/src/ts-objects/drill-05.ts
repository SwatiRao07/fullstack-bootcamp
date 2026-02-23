type Person11 = {
  id: string;
  name: string;
  middleName?: string;
  age: number;
};

const partialPerson: Partial<Person11> = {
  name: "anshu"
};

console.log(partialPerson);

const pickedPerson: Pick<Person11, "name"> = {
  name: "rishabh"
};

console.log(pickedPerson);

const noAgePerson: Omit<Person11, "age"> = {
  id: "6666",
  name: "Vedant"
};

console.log(noAgePerson);

type UpdatePerson = Partial<Omit<Person11, "id">>; 
const update: UpdatePerson = {
  name: "manu",
  age: 10
};

console.log(update);