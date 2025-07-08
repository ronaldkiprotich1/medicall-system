import { db, users } from '../Drizzle/db';
import { eq } from 'drizzle-orm';

export class UserService {
  static getAll() {
    return db.select().from(users);
  }

  static getById(id: number) {
    return db.query.users.findFirst({ where: eq(users.userId, id) });
  }

  static getByEmail(email: string) {
    return db.query.users.findFirst({ where: eq(users.email, email) });
  }

  static create(data: typeof users.$inferInsert) {
    return db.insert(users).values(data).returning();
  }

  static update(id: number, data: Partial<typeof users.$inferInsert>) {
    return db.update(users).set(data).where(eq(users.userId, id)).returning();
  }

  static delete(id: number) {
    return db.delete(users).where(eq(users.userId, id));
  }
}
