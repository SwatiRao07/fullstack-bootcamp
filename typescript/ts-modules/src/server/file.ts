import fs from "node:fs";

export function readPackage(): string {
  return fs.readFileSync("./package.json", "utf-8");
}