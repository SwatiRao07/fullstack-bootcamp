export {};

type User = {
  id?: string;
  name: string;
};

type RequiredUser = Required<User>;
type ReadonlyUser = Readonly<User>;

type Result = Exclude<"a" | "b" | "c", "a">;

type ExtractTest = Extract<"a" | "b" | "c", "a" | "b">;
