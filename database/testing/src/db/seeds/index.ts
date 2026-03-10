import { UserFactory, TaskFactory } from "../../factories/user.factory";

export async function seedMinimal() {
  console.log("Seeding minimal data set...");
  const user = await UserFactory.create({ email: "admin@example.com" });
  await TaskFactory.create(user.id, { title: "Initial Setup" });
}

export async function seedRealistic() {
  console.log("Seeding realistic data set...");
  for (let i = 0; i < 5; i++) {
    const user = await UserFactory.create();
    for (let j = 0; j < 3; j++) {
      await TaskFactory.create(user.id);
    }
  }
}

export async function seedPerformance() {
  console.log("Seeding performance testing data set (1000 items)...");
  for (let i = 0; i < 100; i++) {
    const user = await UserFactory.create();
    // Batch inserting would be better, but for a drill factories are fine
    const tasks = Array.from({ length: 10 }).map(() =>
      TaskFactory.create(user.id),
    );
    await Promise.all(tasks);
  }
}
