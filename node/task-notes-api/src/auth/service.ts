import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserDatabase } from '../database.js';
import type { User } from '../database.js';
import type { AppConfig } from '../config.js';

export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
}

export class AuthService {
  constructor(
    private userDb: UserDatabase,
    private config: AppConfig
  ) {}

  async register(email: string, password: string): Promise<User> {
    const existing = this.userDb.getUserByEmail(email);
    if (existing) {
      throw new Error('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    return this.userDb.createUser(email, passwordHash);
  }

  async login(email: string, password: string): Promise<string> {
    const user = this.userDb.getUserByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    return jwt.sign(payload, this.config.jwtSecret, { expiresIn: '1h' });
  }

  verifyToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, this.config.jwtSecret) as JWTPayload;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
}
