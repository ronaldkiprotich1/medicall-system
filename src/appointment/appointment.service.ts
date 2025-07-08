import { db } from '../Drizzle/db';
import { appointments, type NewAppointment, type Appointment } from '../Drizzle/schema';
import { eq, and, gte, lte } from 'drizzle-orm';

export class AppointmentService {
  async createAppointment(dto: NewAppointment) {
    // Check if doctor is available (add your availability logic)
    const [appointment] = await db.insert(appointments).values(dto).returning();
    return appointment;
  }

  async getAppointmentsByUser(userId: number) {
    return db.select().from(appointments).where(eq(appointments.userId, userId));
  }

  async cancelAppointment(appointmentId: number, reason: string) {
    return db.update(appointments)
      .set({ appointmentStatus: 'Cancelled', cancellationReason: reason })
      .where(eq(appointments.appointmentId, appointmentId))
      .returning();
  }

  async getDoctorAppointments(doctorId: number, date?: Date) {
    const query = db.select().from(appointments)
      .where(eq(appointments.doctorId, doctorId));

    if (date) {
      query.where(eq(appointments.appointmentDate, date));
    }

    return query;
  }
}