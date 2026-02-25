import { add, now, capitalize, generateId } from "@shared/index";
import { readPackage } from "./server/file.js";

console.log("--- TS Modules Drill ---");
console.log("Current Time (from @shared/time):", now());
console.log("Add Calculation (10 + 5):", add(10, 5));
console.log("Capitalize String:", capitalize("hello world"));
console.log("Generated UUID:", generateId());

try {
  const pkg = JSON.parse(readPackage());
  console.log("Server module read package name:", pkg.name);
} catch (err) {
  console.error("Error reading package.json:", err);
}