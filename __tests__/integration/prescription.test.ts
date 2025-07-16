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
    medications: JSON.stringify(['Ibuprofen']),
    dosage: '200mg twice daily',
    instructions: 'Take with food',
    notes: 'Test prescription',
  };

  // +tests

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

  //-tests

  test('POST /prescriptions - should fail with missing required fields', async () => {
    const res = await request(app).post('/prescriptions').send({
      notes: 'Missing fields',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('POST /prescriptions - should fail with invalid medication format', async () => {
    const res = await request(app).post('/prescriptions').send({
      ...testData,
      medications: ['Not a string'], // invalid format
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('GET /prescriptions/:id - should return 404 for non-existent ID', async () => {
    const res = await request(app).get('/prescriptions/999999');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  test('PUT /prescriptions/:id - should return 404 for non-existent ID', async () => {
    const res = await request(app).put('/prescriptions/999999').send({
      medications: JSON.stringify(['UpdatedDrug']),
    });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  test('PUT /prescriptions/:id - should return 400 for invalid input', async () => {
    const [created] = await db.insert(prescriptions).values(testData).returning();

    const res = await request(app).put(`/prescriptions/${created.prescriptionId}`).send({
      medications: 1234, // invalid type
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});
