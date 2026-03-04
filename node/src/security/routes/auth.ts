import { Router } from "express";
import { createUser, getUserByEmail } from "../db/users";
import { hashPassword, comparePassword } from "../utils/hash";
import { signToken } from "../utils/jwt";

const router = Router();

router.post("/register", async (req: any, res: any) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const hashedPassword = await hashPassword(password);
    const user = await createUser(email, hashedPassword, role || "user");
    res
      .status(201)
      .json({ message: "User registered successfully", userId: user.id });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/login", async (req: any, res: any) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isValid = await comparePassword(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
