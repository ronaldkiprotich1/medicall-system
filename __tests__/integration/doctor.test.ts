import request from 'supertest';
import express from 'express';
import doctorRoutes from '../../src/doctor/doctor.router';
import { db, doctors } from '../../src/Drizzle/db';
import { eq } from 'drizzle-orm';

const app = express();
app.use(express.json());
app.use('/doctors', doctorRoutes);

describe('Doctor API Integration Tests', () => {
  let createdDoctorId: number;

  const sampleDoctor = {
    firstName: 'John',
    lastName: 'Doe',
    specialization: 'Cardiology',
    email: 'john.doe@example.com',
    phone: '1234567890',
  };

  afterAll(async () => {
    if (createdDoctorId) {
      await db.delete(doctors).where(eq(doctors.doctorId, createdDoctorId));
    }
  });

  describe('POST /doctors', () => {
    it('should create a new doctor', async () => {
      const res = await request(app).post('/doctors').send(sampleDoctor);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('doctorId');
      expect(res.body.email).toBe(sampleDoctor.email);
      createdDoctorId = res.body.doctorId;
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
  });

  describe('PUT /doctors/:id', () => {
    it('should update an existing doctor', async () => {
      const res = await request(app)
        .put(`/doctors/${createdDoctorId}`)
        .send({ phone: '9876543210' });
      expect(res.status).toBe(200);
      expect(res.body.phone).toBe('9876543210');
    });
  });

  describe('DELETE /doctors/:id', () => {
    it('should delete the doctor', async () => {
      const res = await request(app).delete(`/doctors/${createdDoctorId}`);
      expect(res.status).toBe(204);

      // Confirm deletion
      const getRes = await request(app).get(`/doctors/${createdDoctorId}`);
      expect(getRes.status).toBe(404);
    });
  });
});
