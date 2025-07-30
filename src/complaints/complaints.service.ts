import { db, complaints } from '../Drizzle/db';
import { eq } from 'drizzle-orm';

export class ComplaintService {
  static getAll() {
    return db.select().from(complaints);
  }

  static getById(id: number) {
    return db.query.complaints.findFirst({ where: eq(complaints.complaintId, id) });
  }

  static getByUserId(userId: number) {
    return db.select().from(complaints).where(eq(complaints.userId, userId));
  }

  static getByAppointmentId(appointmentId: number) {
    return db.select().from(complaints).where(eq(complaints.relatedAppointmentId, appointmentId));
  }

  static create(data: typeof complaints.$inferInsert) {
    return db.insert(complaints).values(data).returning();
  }

  static update(id: number, data: Partial<typeof complaints.$inferInsert>) {
    return db.update(complaints).set(data).where(eq(complaints.complaintId, id)).returning();
  }

  static delete(id: number) {
    return db.delete(complaints).where(eq(complaints.complaintId, id));
  }
}