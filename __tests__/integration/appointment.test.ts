import request from 'supertest';
import express from 'express';
import appointmentRoutes from '../../src/appointment/appointment.router';
import { db, appointments, users, doctors } from '../../src/Drizzle/db';
import { eq } from 'drizzle-orm';

const app = express();
app.use(express.json());
app.use('/appointments', appointmentRoutes);

describe('Appointment Integration Tests', () => {
  let createdAppointmentId: number;
  let userId: number;
  let doctorId: number;

  beforeAll(async () => {
    const [user] = await db.insert(users).values({
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@example.com',
      password: 'hashedpassword',
      role: 'user',
    }).returning();
    userId = user.userId;

    const [doctor] = await db.insert(doctors).values({
      userId: userId,
      firstName: 'Jane',
      lastName: 'Smith',
      specialization: 'Cardiology',
      contactPhone: '+1234567890',
      availableDays: '["Monday", "Wednesday"]',
      consultationFee: '5000.00',
      biography: 'Experienced cardiologist.',
    }).returning();
    doctorId = doctor.doctorId;
  });

  afterAll(async () => {
    if (createdAppointmentId) {
      await db.delete(appointments).where(eq(appointments.appointmentId, createdAppointmentId));
    }
    await db.delete(doctors).where(eq(doctors.doctorId, doctorId));
    await db.delete(users).where(eq(users.userId, userId));
  });

  test('POST /appointments - create new appointment', async () => {
    const sampleAppointment = {
      userId,
      doctorId,
      appointmentDate: new Date().toISOString().split('T')[0],
      timeSlot: '09:00:00',
      totalAmount: '5000.00',
      appointmentStatus: 'Pending',
    };

    const res = await request(app).post('/appointments').send(sampleAppointment);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('appointmentId');
    createdAppointmentId = res.body.appointmentId;
  });

  test('POST /appointments - missing required fields should return 400', async () => {
    const res = await request(app).post('/appointments').send({
      doctorId,
      appointmentDate: '2025-08-01',
    });
    expect(res.status).toBe(400); // Or 500 if not validated
  });

  test('GET /appointments - get all appointments', async () => {
    const res = await request(app).get('/appointments');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /appointments/:id - get appointment by ID', async () => {
    const res = await request(app).get(`/appointments/${createdAppointmentId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('appointmentId', createdAppointmentId);
  });

  test('GET /appointments/:id - non-existent ID should return 404', async () => {
    const res = await request(app).get('/appointments/999999');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  test('PUT /appointments/:id - update appointment status', async () => {
    const res = await request(app)
      .put(`/appointments/${createdAppointmentId}`)
      .send({ appointmentStatus: 'Completed' });

    expect(res.status).toBe(200);
    expect(res.body.appointmentStatus).toBe('Completed');
  });

  test('PUT /appointments/:id - non-existent ID should return 404', async () => {
    const res = await request(app)
      .put('/appointments/999999')
      .send({ appointmentStatus: 'Confirmed' });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  test('DELETE /appointments/:id - delete appointment', async () => {
    const res = await request(app).delete(`/appointments/${createdAppointmentId}`);
    expect(res.status).toBe(204);

    const check = await db.query.appointments.findFirst({
      where: eq(appointments.appointmentId, createdAppointmentId),
    });
    expect(check).toBeUndefined();
  });

  test('DELETE /appointments/:id - non-existent ID should return 404', async () => {
    const res = await request(app).delete('/appointments/999999');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});
