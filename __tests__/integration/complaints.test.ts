import request from 'supertest';
import express from 'express';
import complaintRouter from '../../src/complaints/complaints.router';
import { db, complaints } from '../../src/Drizzle/db';
import { eq } from 'drizzle-orm';

// Setup Express app
const app = express();
app.use(express.json()); // Use Express' built-in JSON parser
app.use('/complaints', complaintRouter);

describe('Complaint Integration Tests', () => {
  // Clean DB before each test
  beforeEach(async () => {
    await db.delete(complaints);
  });

  test('POST /complaints - create a new complaint', async () => {
    const res = await request(app).post('/complaints').send({
      userId: 1,
      subject: 'Broken Appointment System',
      description: 'The system crashed while booking.',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('complaintId');
    expect(res.body.subject).toBe('Broken Appointment System');
  });

  test('GET /complaints - get all complaints', async () => {
    await db.insert(complaints).values({
      userId: 1,
      subject: 'Test Subject',
      description: 'Test description',
    });

    const res = await request(app).get('/complaints');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('GET /complaints/:id - get complaint by ID', async () => {
    const [inserted] = await db.insert(complaints).values({
      userId: 1,
      subject: 'Find Me',
      description: 'Find this complaint',
    }).returning();

    const res = await request(app).get(`/complaints/${inserted.complaintId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.subject).toBe('Find Me');
  });

  test('PUT /complaints/:id - update complaint', async () => {
    const [created] = await db.insert(complaints).values({
      userId: 1,
      subject: 'Old Subject',
      description: 'Old Desc',
    }).returning();

    const res = await request(app).put(`/complaints/${created.complaintId}`).send({
      subject: 'Updated Subject',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.subject).toBe('Updated Subject');
  });

  test('DELETE /complaints/:id - delete complaint', async () => {
    const [created] = await db.insert(complaints).values({
      userId: 1,
      subject: 'To be deleted',
      description: 'This will be deleted',
    }).returning();

    const res = await request(app).delete(`/complaints/${created.complaintId}`);
    expect(res.statusCode).toBe(204);

    const check = await db.query.complaints.findFirst({
      where: eq(complaints.complaintId, created.complaintId),
    });

    expect(check).toBeUndefined();
  });
});
