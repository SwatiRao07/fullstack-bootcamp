import { seedMinimal, seedRealistic, seedPerformance } from "../db/seeds";
import { db } from "../config/database";

async function run() {
  const type = process.argv[2] || "minimal";

  try {
    switch (type) {
      case "minimal":
        await seedMinimal();
        break;
      case "realistic":
        await seedRealistic();
        break;
      case "performance":
        await seedPerformance();
        break;
      default:
        console.error(`Unknown seed type: ${type}`);
        process.exit(1);
    }
    console.log("Seeding finished successfully.");
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  } finally {
    await db.close();
  }
}

run();
