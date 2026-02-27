import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// Define table schema
const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
});

// Create in-memory DB
const sqlite = new Database(":memory:");
const db = drizzle(sqlite, { schema: { users } });

// Create table (using SQL once)
sqlite.exec(`
  CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL
  );
`);

// Insert rows
db.insert(users).values([
  { name: "Priya Sharma", email: "priya@example.com" },
  { name: "Ravi Kumar", email: "ravi@example.com" },
]).run();

console.log("Inserted users");

// Query rows
const allUsers = db.select().from(users).all();
console.log(allUsers);

sqlite.close();