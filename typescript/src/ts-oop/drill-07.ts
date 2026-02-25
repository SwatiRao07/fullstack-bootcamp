class Store<T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  get(index: number): T | undefined {
    return this.items[index];
  }
}

const t = new Store<string>();
t.add("Hello");

console.log(t.get(0)); 
console.log(t.get(99)); 