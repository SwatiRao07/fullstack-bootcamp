class Counter {
  private count: number;

  constructor(initialValue: number = 0) {
    this.count = initialValue;
  }

  inc(): this {
    this.count++;
    return this; 
  }

  dec(): this {
    this.count--;
    return this; 
  }

  value(): number {
    return this.count;
  }
}

const counter = new Counter(5);
counter.inc().inc().dec();
console.log(counter.value()); 