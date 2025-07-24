import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { db, users } from '../Drizzle/db';

export class AuthService {
  static async register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) {
    const { firstName, lastName, email, password } = userData;

    if (!firstName || !lastName || !email || !password) {
      throw { status: 400, message: 'All fields are required' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw { status: 400, message: 'Invalid email format' };
    }

    const existingUser = await db.query.users.findFirst({ where: eq(users.email, email) });
    if (existingUser) {
      throw { status: 400, message: 'Email already in use' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code

    const [user] = await db.insert(users).values({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      isVerified: false,
      verificationCode,
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

    const user = await db.query.users.findFirst({ where: eq(users.email, email) });
    if (!user) {
      throw { status: 401, message: 'Invalid email or password' };
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw { status: 401, message: 'Invalid email or password' };
    }

    if (!user.isVerified) {
      throw { status: 403, message: 'Please verify your email before logging in' };
    }

    const token = jwt.sign(
      { userId: user.userId, role: user.role },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '1d' }
    );

    return { token, user };
  }

  static async verifyUser(email: string) {
    const [updated] = await db.update(users).set({
      isVerified: true,
      verificationCode: null
    }).where(eq(users.email, email)).returning();

    if (!updated) {
      throw { status: 404, message: 'User not found' };
    }

    return updated;
  }

  static async getAllUsers() {
    return await db.select().from(users);
  }

  static async getUserById(id: string) {
    const user = await db.query.users.findFirst({
      where: eq(users.userId, Number(id)),
    });

    if (!user) {
      throw { status: 404, message: 'User not found' };
    }

    return user;
  }

  static async updateUserById(id: string, updateData: Partial<typeof users.$inferInsert>) {
    const [updatedUser] = await db.update(users)
      .set(updateData)
      .where(eq(users.userId, Number(id)))
      .returning();

    if (!updatedUser) {
      throw { status: 404, message: 'User not found' };
    }

    return updatedUser;
  }
}
