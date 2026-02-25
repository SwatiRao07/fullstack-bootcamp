interface User8{
  id: string;
  name: string;
  age: number;
}

function updateUser(user: Partial<User8>) {}

updateUser({ name: "Sonu", age:56 });
updateUser({ age: 20 });

type PublicUser = Pick<User8, "id" | "name">;
const user10: PublicUser = {
  id: "1",
  name: "Justin",
};

console.log(user10)

type SafeUser = Omit<User8, "age">;

const user11: SafeUser = {
  id: "2",
  name: "Selena",
};

console.log(user11)



