// payments.service.ts
import { db, payments } from '../Drizzle/db';
import { eq } from 'drizzle-orm';

export class PaymentService {
  static getAll() {
    return db.select().from(payments);
  }

  static getById(id: number) {
    return db.query.payments.findFirst({
      where: eq(payments.paymentId, id),
    });
  }

  static create(data: typeof payments.$inferInsert) {
    return db.insert(payments).values(data).returning();
  }

  static update(id: number, data: Partial<typeof payments.$inferInsert>) {
    return db.update(payments).set(data).where(eq(payments.paymentId, id)).returning();
  }

  static delete(id: number) {
    return db.delete(payments).where(eq(payments.paymentId, id));
  }
}
