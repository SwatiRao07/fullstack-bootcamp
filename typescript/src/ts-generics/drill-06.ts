type Student = {
  name: string;
  age: number;
};

type ToBoolean<T> = {
  [K in keyof T]: boolean;
};

type UserFlags = ToBoolean<Student>;

const flags: UserFlags = {
  name: true,
  age: false,
};





