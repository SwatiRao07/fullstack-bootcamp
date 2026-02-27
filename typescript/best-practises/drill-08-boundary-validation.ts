import { z } from "zod";

// ── Schema ────────────────────────────────────

const UserSchema = z.object({
  name:  z.string().min(1, "name is required"),
  email: z.string().email("invalid email"),
  role:  z.enum(["admin", "member", "guest"]),
});

type UserInput = z.infer<typeof UserSchema>;

// ── Stable error codes ────────────────────────

const ERROR_CODES: Record<string, string> = {
  name:  "USER_NAME_INVALID",
  email: "USER_EMAIL_INVALID",
  role:  "USER_ROLE_INVALID",
};

function parseUser(raw: unknown) {
  const result = UserSchema.safeParse(raw);
  if (result.success) return { ok: true as const, data: result.data };

  const errors = result.error.issues.map((issue) => ({
    code:    ERROR_CODES[String(issue.path[0])] ?? "USER_INVALID",
    field:   String(issue.path[0] ?? "(root)"),
    message: issue.message,
  }));

  return { ok: false as const, errors };
}

// ── Driver ────────────────────────────────────

const valid   = { name: "Aarav", email: "aarav@example.com", role: "admin" };
const invalid = { name: "",      email: "not-an-email",       role: "superuser" };

const r1 = parseUser(valid);
console.log("valid  →", r1.ok ? r1.data : r1.errors);

const r2 = parseUser(invalid);
console.log("invalid →");
if (!r2.ok) r2.errors.forEach((e) => console.log(" ", e.code, e.field, e.message));
