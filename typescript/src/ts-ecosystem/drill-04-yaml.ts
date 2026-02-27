import * as fs from "node:fs";
import { stringify, parse } from "yaml";

// Original object
const original = {
  app: { name: "demo", version: "1.0.0", debug: true },
  server: { host: "localhost", port: 8080 },
  features: ["auth", "logging"],
};

// Object → YAML
const yaml = stringify(original);
fs.writeFileSync("settings.yaml", yaml);

// YAML → Object
const fromYaml = parse(fs.readFileSync("settings.yaml", "utf-8"));

// Object → JSON
const json = JSON.stringify(fromYaml, null, 2);
fs.writeFileSync("settings.json", json);

// JSON → Object
const fromJson = JSON.parse(fs.readFileSync("settings.json", "utf-8"));

// Verify round-trip
const match =
  JSON.stringify(original) === JSON.stringify(fromJson);

console.log("Round-trip match:", match ? "YES" : "NO");