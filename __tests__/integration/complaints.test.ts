import request from 'supertest';
import express from 'express';
import complaintRouter from '../../src/complaints/complaints.router';
import { db, complaints } from '../../src/Drizzle/db';
import { eq } from 'drizzle-orm';

const app = express();
app.use(express.json());
app.use('/complaints', complaintRouter);

describe('Complaint Integration Tests', () => {
  beforeEach(async () => {
    await db.delete(complaints);
  });

  const validComplaint = {
    userId: 1,
    subject: 'System Glitch',
    description: 'The booking system froze.',
  };

   

  test('POST /complaints - create a new complaint', async () => {
    const res = await request(app).post('/complaints').send(validComplaint);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('complaintId');
    expect(res.body.subject).toBe(validComplaint.subject);
  });

  test('GET /complaints - get all complaints', async () => {
    await db.insert(complaints).values(validComplaint);

    const res = await request(app).get('/complaints');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('GET /complaints/:id - get complaint by ID', async () => {
    const [inserted] = await db.insert(complaints).values(validComplaint).returning();

    const res = await request(app).get(`/complaints/${inserted.complaintId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.subject).toBe(validComplaint.subject);
  });

  test('PUT /complaints/:id - update complaint', async () => {
    const [created] = await db.insert(complaints).values(validComplaint).returning();

    const res = await request(app)
      .put(`/complaints/${created.complaintId}`)
      .send({ subject: 'Updated Subject' });

    expect(res.statusCode).toBe(200);
    expect(res.body.subject).toBe('Updated Subject');
  });

  test('DELETE /complaints/:id - delete complaint', async () => {
    const [created] = await db.insert(complaints).values(validComplaint).returning();

    const res = await request(app).delete(`/complaints/${created.complaintId}`);
    expect(res.statusCode).toBe(204);

    const check = await db.query.complaints.findFirst({
      where: eq(complaints.complaintId, created.complaintId),
    });

    expect(check).toBeUndefined();
  });

  test('GET /complaints/:id - non-existent complaint should return 404', async () => {
    const res = await request(app).get('/complaints/999999');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  // -test

  test('POST /complaints - should fail with missing fields', async () => {
    const res = await request(app).post('/complaints').send({ subject: 'Missing description' });

    expect([400, 500]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('error');
  });

  test('POST /complaints - should fail with invalid userId', async () => {
    const res = await request(app).post('/complaints').send({
      userId: 'not-a-number',
      subject: 'Invalid userId',
      description: 'Fails validation',
    });

    expect([400, 500]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('error');
  });

  test('GET /complaints/:id - invalid ID format', async () => {
    const res = await request(app).get('/complaints/not-a-number');

    expect([400, 404]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('error');
  });

  test('PUT /complaints/:id - non-existent complaint', async () => {
    const res = await request(app).put('/complaints/999999').send({ subject: 'New' });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  test('PUT /complaints/:id - invalid ID format', async () => {
    const res = await request(app).put('/complaints/invalid-id').send({ subject: 'Test' });

    expect([400, 404]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('error');
  });

  test('DELETE /complaints/:id - non-existent complaint', async () => {
    const res = await request(app).delete('/complaints/999999');

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  test('DELETE /complaints/:id - invalid ID format', async () => {
    const res = await request(app).delete('/complaints/not-a-number');

    expect([400, 404]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('error');
  });
});
