import { db, appointments } from '../Drizzle/db';
import { eq } from 'drizzle-orm';

export class AppointmentService {
  static getAll() {
    return db.select().from(appointments);
  }

  static getById(id: number) {
    return db.query.appointments.findFirst({ where: eq(appointments.appointmentId, id) });
  }

  static create(data: typeof appointments.$inferInsert) {
    return db.insert(appointments).values(data).returning();
  }

  static update(id: number, data: Partial<typeof appointments.$inferInsert>) {
    return db.update(appointments).set(data).where(eq(appointments.appointmentId, id)).returning();
  }

  static delete(id: number) {
    return db.delete(appointments).where(eq(appointments.appointmentId, id));
  }
}
