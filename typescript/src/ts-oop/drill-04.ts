class Dog {
  static created = 0;

  constructor(public name: string) {
    Dog.created++; 
  }

  bark() {
    console.log("My name is " + this.name);
  }

  static fromJSON(json: string): Dog {
    const data = JSON.parse(json);
    return new Dog(data.name);
  }
}

const d1 = new Dog("Tommy");
d1.bark();

const saved = '{"name":"Rocky"}';
const d2 = Dog.fromJSON(saved);
d2.bark();

console.log(Dog.created); 



function makeDog(name: string) {
  return {
    name,
    bark() {
      console.log("My name is " + name);
    }
  };
}

const d3 = makeDog("Charlie");
d3.bark();