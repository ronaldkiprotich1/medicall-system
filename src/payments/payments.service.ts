// src/services/payment.service.ts
import { db } from '@/drizzle/db';
import { payments } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { NewPayment } from '@/types';

export class PaymentService {
  static async createPayment(data: NewPayment) {
    return db.insert(payments).values(data).returning();
  }

  static async getPaymentById(paymentId: number) {
    return db.query.payments.findFirst({
      where: eq(payments.paymentId, paymentId),
    });
  }

  static async getAllPayments() {
    return db.select().from(payments);
  }

  static async updatePayment(paymentId: number, data: Partial<NewPayment>) {
    return db.update(payments).set(data).where(eq(payments.paymentId, paymentId)).returning();
  }

  static async deletePayment(paymentId: number) {
    return db.delete(payments).where(eq(payments.paymentId, paymentId)).returning();
  }
}
