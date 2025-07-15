import request from 'supertest';
import express from 'express';
import paymentRouter from '../../src/payments/payments.router';
import { db, payments } from '../../src/Drizzle/db';
import { eq } from 'drizzle-orm';

const app = express();
app.use(express.json());
app.use('/payments', paymentRouter);

describe('Payment API Integration Tests', () => {
  beforeEach(async () => {
    await db.delete(payments);
  });

  const testData = {
    appointmentId: 1,
    amount: '3000.00',
    method: 'MPESA',
    status: 'COMPLETED',
  };

  test('POST /payments - create new payment', async () => {
    const res = await request(app).post('/payments').send(testData);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('paymentId');
    expect(res.body.amount).toBe('3000.00'); // or use Number()
  });

  test('GET /payments - get all payments', async () => {
    await db.insert(payments).values(testData);
    const res = await request(app).get('/payments');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('GET /payments/:id - get payment by ID', async () => {
    const [created] = await db.insert(payments).values(testData).returning();
    const res = await request(app).get(`/payments/${created.paymentId}`);
    expect(res.status).toBe(200);
    expect(res.body.amount).toBe('3000.00');
  });

  test('PUT /payments/:id - update payment', async () => {
    const [created] = await db.insert(payments).values(testData).returning();

    const res = await request(app).put(`/payments/${created.paymentId}`).send({
      status: 'PENDING',
      amount: '3500.00',
      method: 'CASH',
      appointmentId: created.appointmentId, // required FK
    });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('PENDING');
    expect(res.body.amount).toBe('3500.00');
  });

  test('DELETE /payments/:id - delete payment', async () => {
    const [created] = await db.insert(payments).values(testData).returning();
    const res = await request(app).delete(`/payments/${created.paymentId}`);
    expect(res.status).toBe(204);

    const check = await db.query.payments.findFirst({
      where: eq(payments.paymentId, created.paymentId),
    });

    expect(check).toBeUndefined();
  });
});
