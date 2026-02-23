const productPrices: Record<string, number> = {
  apple: 100,
  banana: 50,
  mango: 120
};

console.log(productPrices);
console.log(productPrices.apple); 

productPrices.banana = 55;
console.log(productPrices.banana);

type Person25 = {
  name: string;
  age: number;
};

const peopleMap: Map<string, Person25> = new Map();

peopleMap.set("jack", { name: "JACK", age: 23 });
peopleMap.set("jill", { name: "JILL", age: 28 });

console.log(peopleMap.get("jack")); 
console.log(peopleMap.has("jill")); 

