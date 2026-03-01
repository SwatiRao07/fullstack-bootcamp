type User = {
  name: string;
};

type PricingPolicy = (base: number) => number;

type Account = {
  user: User;
  pricing: PricingPolicy;
};

const premium = (discount: number): PricingPolicy =>
  (base) => base * (1 - discount);

const standard: PricingPolicy = (base) => base;

const aarav: Account = {
  user: { name: "Aarav" },
  pricing: premium(0.2),
};

const bhavana: Account = {
  user: { name: "Bhavana" },
  pricing: standard,
};

console.log("Aarav:", aarav.pricing(100)); 
console.log("Bhavana:", bhavana.pricing(100));     

aarav.pricing = standard;
console.log("Aarav after swap:", aarav.pricing(100)); 