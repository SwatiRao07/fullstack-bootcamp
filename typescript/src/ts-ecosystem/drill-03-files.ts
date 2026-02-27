import fse from "fs-extra";
import * as path from "node:path";

const FILE_PATH = path.resolve(import.meta.dirname, ".data", "users.json");

const data = [
  { id: 1, name: "Priya Sharma",    email: "priya@example.com"    },
  { id: 2, name: "Ravi Kumar",      email: "ravi@example.com"      },
];

// Write
await fse.outputJson(FILE_PATH, data, { spaces: 2 });
console.log("Written to", FILE_PATH);

// Read
const loaded = await fse.readJson(FILE_PATH);
console.log("Read back:", loaded);
