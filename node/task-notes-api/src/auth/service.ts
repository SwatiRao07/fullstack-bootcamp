import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Redis } from 'ioredis';
import { UserDatabase } from '../database.js';
import type { User } from '../database.js';
import type { AppConfig } from '../config.js';

export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
}

export class AuthService {
  private redis: Redis;

  constructor(
    private userDb: UserDatabase,
    private config: AppConfig
  ) {
    this.redis = new Redis(this.config.redisUrl);
  }

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

  async logout(token: string): Promise<void> {
    const payload = this.verifyToken(token);
    const ttl = 3600; // 1 hour matching the JWT expiration
    await this.redis.set(`blacklist:${token}`, 'true', 'EX', ttl);
  }

  async isBlacklisted(token: string): Promise<boolean> {
    const result = await this.redis.get(`blacklist:${token}`);
    return result === 'true';
  }
}
