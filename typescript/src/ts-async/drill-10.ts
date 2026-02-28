import { z } from 'zod';

const UserSchema = z.object({
  id: z.number(),
  name: z.string()
});

type User = z.infer<typeof UserSchema>;

async function getTypedData<T>(url: string, schema: z.ZodSchema<T>): Promise<T> {
  const json = { id: 1, name: "Basic User" }; 
  return schema.parse(json);
}

async function runDrill10() {
  const user = await getTypedData("/api/user", UserSchema);
  console.log("Fetched typed user:", user.name);
}

runDrill10();
