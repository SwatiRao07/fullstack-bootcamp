function identity<T>(arg: T): T {
  return arg;
}

const num = identity(100); 
const str = identity("Morning");
const user4 = identity({ name: "Johncena", age: 16 });

console.log(num);  
console.log(str);    
console.log(user4);   
user4.name; 

const explicit = identity<string>("TypeScript");
console.log(explicit);

const safeValue = identity("hello");
safeValue.toUpperCase();     
