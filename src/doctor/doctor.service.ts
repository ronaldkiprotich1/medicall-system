import { db, doctors } from '../Drizzle/db';
import { eq } from 'drizzle-orm';

export class DoctorService {
  static getAll() {
    return db.select().from(doctors);
  }

  static getById(id: number) {
    return db.query.doctors.findFirst({ where: eq(doctors.doctorId, id) });
  }

  static create(data: typeof doctors.$inferInsert) {
    return db.insert(doctors).values(data).returning();
  }

  static update(id: number, data: Partial<typeof doctors.$inferInsert>) {
    return db.update(doctors).set(data).where(eq(doctors.doctorId, id)).returning();
  }

  static delete(id: number) {
    return db.delete(doctors).where(eq(doctors.doctorId, id));
  }
}
