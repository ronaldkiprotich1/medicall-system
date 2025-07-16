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
    expect(res.body.amount).toBe('3000.00');
  });

  test('POST /payments - should fail with missing required fields', async () => {
    const res = await request(app).post('/payments').send({
      appointmentId: 1,
      amount: '3000.00'
      // method and status missing
    });
    expect([400, 500]).toContain(res.status);
    expect(res.body).toHaveProperty('error');
  });

  test('POST /payments - should fail with invalid amount format', async () => {
    const res = await request(app).post('/payments').send({
      ...testData,
      amount: 'invalid-amount',
    });
    expect([400, 500]).toContain(res.status);
    expect(res.body).toHaveProperty('error');
  });

  test('GET /payments - get all payments', async () => {
    await db.insert(payments).values(testData);
    const res = await request(app).get('/payments');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('GET /payments/:id - get payment by ID', async () => {
    const [created] = await db.insert(payments).values(testData).returning();
    const res = await request(app).get(`/payments/${created.paymentId}`);
    expect(res.status).toBe(200);
    expect(res.body.amount).toBe('3000.00');
  });

  test('GET /payments/:id - should return 404 for non-existent payment', async () => {
    const res = await request(app).get('/payments/999999');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  test('GET /payments/:id - should return 400 or 404 for invalid ID format', async () => {
    const res = await request(app).get('/payments/invalid-id');
    expect([400, 404]).toContain(res.status);
    expect(res.body).toHaveProperty('error');
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

  test('DELETE /payments/:id - should return 404 for non-existent payment', async () => {
    const res = await request(app).delete('/payments/999999');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  test('DELETE /payments/:id - should return 400 or 404 for invalid ID format', async () => {
    const res = await request(app).delete('/payments/invalid-id');
    expect([400, 404]).toContain(res.status);
    expect(res.body).toHaveProperty('error');
  });
});
