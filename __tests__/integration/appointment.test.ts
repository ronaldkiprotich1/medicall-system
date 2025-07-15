import request from 'supertest';
import express from 'express';
import appointmentRoutes from '../../src/appointment/appointment.router';
import { db, appointments } from '../../src/Drizzle/db';
import { eq } from 'drizzle-orm';

// Setup Express app with the appointment routes
const app = express();
app.use(express.json());
app.use('/appointments', appointmentRoutes);

describe('Appointment Integration Tests', () => {
  let createdAppointmentId: number;

  const sampleAppointment = {
    userId: 1,
    doctorId: 2,
    appointmentDate: new Date().toISOString(),
    status: 'Scheduled',
  };

  // Clean test appointments before/after
  afterAll(async () => {
    if (createdAppointmentId) {
      await db.delete(appointments).where(eq(appointments.appointmentId, createdAppointmentId));
    }
  });

  describe('POST /appointments', () => {
    it('should create a new appointment', async () => {
      const res = await request(app)
        .post('/appointments')
        .send(sampleAppointment);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('appointmentId');
      expect(res.body.userId).toBe(sampleAppointment.userId);

      createdAppointmentId = res.body.appointmentId;
    });
  });

  describe('GET /appointments', () => {
    it('should return all appointments', async () => {
      const res = await request(app).get('/appointments');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('GET /appointments/:id', () => {
    it('should return the created appointment by ID', async () => {
      const res = await request(app).get(`/appointments/${createdAppointmentId}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('appointmentId', createdAppointmentId);
    });

    it('should return 404 if appointment does not exist', async () => {
      const res = await request(app).get('/appointments/999999');
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error', 'Appointment not found');
    });
  });

  describe('PUT /appointments/:id', () => {
    it('should update the appointment status', async () => {
      const res = await request(app)
        .put(`/appointments/${createdAppointmentId}`)
        .send({ status: 'Completed' });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('Completed');
    });
  });

  describe('DELETE /appointments/:id', () => {
    it('should delete the appointment', async () => {
      const res = await request(app).delete(`/appointments/${createdAppointmentId}`);
      expect(res.status).toBe(204);

      // Ensure it's gone
      const getRes = await request(app).get(`/appointments/${createdAppointmentId}`);
      expect(getRes.status).toBe(404);
    });
  });
});
