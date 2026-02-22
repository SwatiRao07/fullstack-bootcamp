console.log("Hello, Typescript !")

function hello(name: string, age?: number){
    return `Hello, ${name}. You are ${age} years old.`
}

console.log(hello("Bruno", 56))

