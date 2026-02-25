type Keys<T> = keyof T;

interface User {
  id: string;
  age: number;
}

type UserKeys = Keys<User>; 

function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user2: User = {
  id: "abc123",
  age: 25,
};

const id2 = getProp(user2, "id");  
const age2 = getProp(user2, "age"); 

