export {};

type User = { 
  id: string; 
  profile: { 
    name: string; 
    address: { city: string } 
  } 
};

type City = User["profile"]["address"]["city"];

type JsonValue = 
  | string 
  | number 
  | boolean 
  | null 
  | JsonValue[] 
  | { [k: string]: JsonValue };

const json: JsonValue = {
  name: "John",
  age: 30,
  isEmployee: true,
  roles: ["Admin", "User"],
  details: {
    address: "123 Main St",
    verified: null
  }
};
