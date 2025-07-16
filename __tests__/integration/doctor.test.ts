import request from 'supertest';
import express from 'express';
import doctorRoutes from '../../src/doctor/doctor.router';
import { db, doctors, users } from '../../src/Drizzle/db';
import { eq } from 'drizzle-orm';

const app = express();
app.use(express.json());
app.use('/doctors', doctorRoutes);

describe('Doctor API Integration Tests', () => {
  let createdDoctorId: number;
  let testUserId: number;

  beforeAll(async () => {
    const result = await db.insert(users).values({
      firstName: 'Test',
      lastName: 'User',
      email: 'doctoruser@example.com',
      password: 'hashedPassword',
      role: 'doctor',
    }).returning();

    testUserId = result[0].userId;
  });

  afterAll(async () => {
    if (createdDoctorId) {
      await db.delete(doctors).where(eq(doctors.doctorId, createdDoctorId));
    }
    if (testUserId) {
      await db.delete(users).where(eq(users.userId, testUserId));
    }
  });

  const sampleDoctor = {
    userId: 0, // set dynamically
    firstName: 'John',
    lastName: 'Doe',
    specialization: 'Cardiology',
    contactPhone: '+254712345678',
    availableDays: JSON.stringify(['Monday', 'Wednesday', 'Friday']),
    consultationFee: '5000.00',
    biography: 'Test cardiologist doctor',
    isActive: true,
  };

  describe('POST /doctors', () => {
    it('should create a new doctor', async () => {
      sampleDoctor.userId = testUserId;

      const res = await request(app).post('/doctors').send(sampleDoctor);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('doctorId');
      expect(res.body.firstName).toBe(sampleDoctor.firstName);
      createdDoctorId = res.body.doctorId;
    });

    it('should return 400 if required fields are missing', async () => {
      const res = await request(app).post('/doctors').send({
        firstName: 'MissingFields'
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 400 or 500 if userId is invalid', async () => {
      const res = await request(app).post('/doctors').send({
        ...sampleDoctor,
        userId: 999999,
      });

      expect([400, 500]).toContain(res.status);
    });
  });

  describe('GET /doctors', () => {
    it('should return all doctors', async () => {
      const res = await request(app).get('/doctors');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('GET /doctors/:id', () => {
    it('should return a specific doctor by ID', async () => {
      const res = await request(app).get(`/doctors/${createdDoctorId}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('doctorId', createdDoctorId);
    });

    it('should return 404 if doctor not found', async () => {
      const res = await request(app).get('/doctors/999999');
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error', 'Doctor not found');
    });

    it('should return 400 or 404 for invalid ID format', async () => {
      const res = await request(app).get('/doctors/invalid-id');
      expect([400, 404]).toContain(res.status);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('PUT /doctors/:id', () => {
    it('should update an existing doctor', async () => {
      const res = await request(app)
        .put(`/doctors/${createdDoctorId}`)
        .send({ contactPhone: '+254799999999' });

      expect(res.status).toBe(200);
      expect(res.body.contactPhone).toBe('+254799999999');
    });

    it('should return 400 when given invalid field value', async () => {
      const res = await request(app)
        .put(`/doctors/${createdDoctorId}`)
        .send({ consultationFee: 'not-a-number' });

      expect([400, 500]).toContain(res.status);
    });

    it('should return 400 or 404 for invalid ID format', async () => {
      const res = await request(app)
        .put('/doctors/not-a-number')
        .send({ contactPhone: '+254700000000' });

      expect([400, 404]).toContain(res.status);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('DELETE /doctors/:id', () => {
    it('should delete the doctor', async () => {
      const res = await request(app).delete(`/doctors/${createdDoctorId}`);
      expect(res.status).toBe(204);

      const getRes = await request(app).get(`/doctors/${createdDoctorId}`);
      expect(getRes.status).toBe(404);
    });

    it('should return 400 or 404 for invalid ID format', async () => {
      const res = await request(app).delete('/doctors/not-a-number');
      expect([400, 404]).toContain(res.status);
      expect(res.body).toHaveProperty('error');
    });
  });
});
