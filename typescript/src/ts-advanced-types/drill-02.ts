type Id = {
  id: string;
};

type Timestamps = {
  createdAt: Date;
  updatedAt: Date;
};

type Entity = Id & Timestamps;

const user20: Entity = {
  id: "123",
  createdAt: new Date(),
  updatedAt: new Date(),
};

console.log(user20)