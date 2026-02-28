export {};

type HasId = { id: string };
type HasTimestamps = { createdAt: Date; updatedAt: Date };

type Entity = HasId & HasTimestamps;

const entity: Entity = {
  id: "123",
  createdAt: new Date(),
  updatedAt: new Date()
};