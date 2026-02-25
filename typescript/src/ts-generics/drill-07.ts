type IsString<T> = T extends string ? "YES" : "NO";

type A = IsString<string>;   
type B = IsString<number>;   

type NameOrId<T> = T extends number ? { id: number } : { name: string };

type C = NameOrId<number>;  
type D = NameOrId<string>;  

type Result = IsString<string | number>;

type IsArray<T> = T extends any[] ? "ARRAY" : "NOT ARRAY";

type P = IsArray<string[]>;  
type Q = IsArray<number[]>;   
type R = IsArray<boolean[]>; 

