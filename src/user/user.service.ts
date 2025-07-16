import { db, users } from '../Drizzle/db';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class UserService {
  static async getAll() {
    return db.select().from(users);
  }

  static async getById(id: number) {
    return db.query.users.findFirst({ where: eq(users.userId, id) });
  }

  static async getByEmail(email: string) {
    return db.query.users.findFirst({ where: eq(users.email, email) });
  }

  static async create(data: typeof users.$inferInsert) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const [user] = await db.insert(users)
      .values({ ...data, password: hashedPassword })
      .returning();
    return user;
  }

  static async login(email: string, password: string) {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    const token = jwt.sign(
      { userId: user.userId, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    return { token };
  }

  static async update(id: number, data: Partial<typeof users.$inferInsert>) {
    const [user] = await db.update(users)
      .set(data)
      .where(eq(users.userId, id))
      .returning();
    return user;
  }

  static async delete(id: number) {
    return db.delete(users).where(eq(users.userId, id));
  }
}
