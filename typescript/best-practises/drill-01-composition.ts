// User is just data
type User = {
  name: string;
};

// Pricing is just a function
type PricingPolicy = (base: number) => number;

// Account composes both
type Account = {
  user: User;
  pricing: PricingPolicy;
};

const premium = (discount: number): PricingPolicy =>
  (base) => base * (1 - discount);

const standard: PricingPolicy = (base) => base;

// Usage
const aarav: Account = {
  user: { name: "Aarav" },
  pricing: premium(0.2),
};

const bhavana: Account = {
  user: { name: "Bhavana" },
  pricing: standard,
};

console.log("Aarav:", aarav.pricing(100)); // 80
console.log("Bhavana:", bhavana.pricing(100));     // 100

// Swap behavior at runtime
aarav.pricing = standard;
console.log("Aarav after swap:", aarav.pricing(100)); // 100