type PromiseType<T> = T extends Promise<infer U> ? U : T;
type x = PromiseType<Promise<string>>; // string
type y = PromiseType<Promise<number>>; // number
type z = PromiseType<boolean>;         // boolean

type Nullable<T> = T | null;
type Name = Nullable<string>; 
// string | null
type NotNullable<T> = T extends null | undefined ? never : T;
type Clean = NotNullable<string | null | undefined>;