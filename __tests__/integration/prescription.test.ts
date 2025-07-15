import request from 'supertest';
import express from 'express';
import prescriptionRouter from '../../src/prescription/prescription.router';
import { db, prescriptions } from '../../src/Drizzle/db';
import { eq } from 'drizzle-orm';

const app = express();
app.use(express.json());
app.use('/prescriptions', prescriptionRouter);

describe('Prescription Integration Tests', () => {
  beforeEach(async () => {
    await db.delete(prescriptions);
  });

  const testData = {
    appointmentId: 1,
    doctorId: 1,
    patientId: 1,
    medications: JSON.stringify(['Ibuprofen']), // ✅ stringified array
    dosage: '200mg twice daily',
    instructions: 'Take with food',
    notes: 'Test prescription',
  };

  test('POST /prescriptions - create a new prescription', async () => {
    const res = await request(app).post('/prescriptions').send(testData);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('prescriptionId');
    expect(res.body.medications).toBe(testData.medications);
  });

  test('GET /prescriptions - get all prescriptions', async () => {
    await db.insert(prescriptions).values(testData);

    const res = await request(app).get('/prescriptions');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('GET /prescriptions/:id - get prescription by ID', async () => {
    const [inserted] = await db.insert(prescriptions).values(testData).returning();

    const res = await request(app).get(`/prescriptions/${inserted.prescriptionId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.medications).toBe(testData.medications);
  });

  test('PUT /prescriptions/:id - update prescription', async () => {
    const [created] = await db.insert(prescriptions).values(testData).returning();

    const res = await request(app).put(`/prescriptions/${created.prescriptionId}`).send({
      medications: JSON.stringify(['Paracetamol']),
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.medications).toBe(JSON.stringify(['Paracetamol']));
  });

  test('DELETE /prescriptions/:id - delete prescription', async () => {
    const [created] = await db.insert(prescriptions).values(testData).returning();

    const res = await request(app).delete(`/prescriptions/${created.prescriptionId}`);
    expect(res.statusCode).toBe(204);

    const check = await db.query.prescriptions.findFirst({
      where: eq(prescriptions.prescriptionId, created.prescriptionId),
    });

    expect(check).toBeUndefined();
  });
});
