import { db, doctors } from '../Drizzle/db';
import { eq } from 'drizzle-orm';

export class DoctorService {
  static async getAll() {
    try {
      const result = await db.query.doctors.findMany();
      console.log("DoctorService.getAll():", result); // Debug log
      return result;
    } catch (error) {
      console.error("Error in DoctorService.getAll():", error);
      throw error;
    }
  }

  static async getById(id: number) {
    return await db.query.doctors.findFirst({ where: eq(doctors.doctorId, id) });
  }

  static async create(data: typeof doctors.$inferInsert) {
    return await db.insert(doctors).values(data).returning();
  }

  static async update(id: number, data: Partial<typeof doctors.$inferInsert>) {
    return await db.update(doctors).set(data).where(eq(doctors.doctorId, id)).returning();
  }

  static async delete(id: number) {
    return await db.delete(doctors).where(eq(doctors.doctorId, id));
  }
}
