export {};

type PromiseType<T> = T extends Promise<infer U> ? U : T;


type T1 = PromiseType<Promise<string>>; 
type T2 = PromiseType<Promise<number>>; 
type T3 = PromiseType<boolean>;         

type Nullable<T> = T | null;
type NonNullableType<T> = T extends null | undefined ? never : T;

type T4 = NonNullableType<string | null | undefined>; 