class Person1 {
  private _age: number;

  constructor(age: number) {
    this._age = age;
  }

  get age(): number {
    return this._age;
  }

  set age(value: number) {
    if (value < 0) {
      throw new Error("Age cannot be negative");
    }
    this._age = value;
  }
}

const p = new Person1(25);

console.log(p.age);  

p.age = 20;          
console.log(p.age);
        