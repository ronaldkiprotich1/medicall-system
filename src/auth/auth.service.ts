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
    const { firstName, lastName, email, password } = userData;

    // Basic validation
    if (!firstName || !lastName || !email || !password) {
      throw { status: 400, message: 'All fields are required' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw { status: 400, message: 'Invalid email format' };
    }

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      throw { status: 400, message: 'Email already in use' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [user] = await db.insert(users).values({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    }).returning();

    return user;
  }

  static async login(email: string, password: string) {
    if (!email || !password) {
      throw { status: 400, message: 'Email and password are required' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw { status: 400, message: 'Invalid email format' };
    }

    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      throw { status: 401, message: 'Invalid email or password' };
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw { status: 401, message: 'Invalid email or password' };
    }

    const token = jwt.sign(
      { userId: user.userId, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    );

    return { token, user };
  }
}
