import { db, prescriptions } from '../Drizzle/db';
import { eq } from 'drizzle-orm';

export class PrescriptionService {
  static getAll() {
    return db.select().from(prescriptions);
  }

  static getById(id: number) {
    return db.query.prescriptions.findFirst({ where: eq(prescriptions.prescriptionId, id) });
  }

  static create(data: typeof prescriptions.$inferInsert) {
    return db.insert(prescriptions).values(data).returning();
  }

  static update(id: number, data: Partial<typeof prescriptions.$inferInsert>) {
    return db.update(prescriptions).set(data).where(eq(prescriptions.prescriptionId, id)).returning();
  }

  static delete(id: number) {
    return db.delete(prescriptions).where(eq(prescriptions.prescriptionId, id));
  }
}

// prescription.controller.ts