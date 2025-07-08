// src/services/auth.service.ts
import { db, users } from '../Drizzle/db';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class AuthService {
  static async register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, userData.email),
    });

    if (existingUser) throw new Error('Email already in use');

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const [user] = await db.insert(users).values({
      ...userData,
      password: hashedPassword,
    }).returning();

    return user;
  }

  static async login(email: string, password: string) {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) throw new Error('Invalid email or password');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Invalid email or password');

    const token = jwt.sign(
      { userId: user.userId, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    );

    return { token, user };
  }
}
