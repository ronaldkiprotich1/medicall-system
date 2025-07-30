import { db, appointments, users, doctors } from '../Drizzle/db';
import { eq } from 'drizzle-orm';

export class AppointmentService {
  static getAll() {
    return db.select().from(appointments);
  }

  // NEW METHOD: Get detailed appointments with patient and doctor info
  static getDetailed() {
    return db
      .select({
        appointmentId: appointments.appointmentId,
        userId: appointments.userId,
        doctorId: appointments.doctorId,
        appointmentDate: appointments.appointmentDate,
        timeSlot: appointments.timeSlot,
        appointmentStatus: appointments.appointmentStatus,
        totalAmount: appointments.totalAmount,
        notes: appointments.notes,
        createdAt: appointments.createdAt,
        updatedAt: appointments.updatedAt,
        // Patient information
        patient: {
          name: users.firstName,
          lastName: users.lastName,
          email: users.email,
          contactPhone: users.contactPhone,
        },
        // Doctor information
        doctor: {
          name: doctors.firstName,
          lastName: doctors.lastName,
          specialization: doctors.specialization,
        }
      })
      .from(appointments)
      .leftJoin(users, eq(appointments.userId, users.userId))
      .leftJoin(doctors, eq(appointments.doctorId, doctors.doctorId));
  }

  static getById(id: number) {
    return db.query.appointments.findFirst({
      where: eq(appointments.appointmentId, id)
    });
  }

  // NEW: Get appointments by user ID
  static getByUserId(userId: number) {
    return db.select().from(appointments).where(eq(appointments.userId, userId));
  }

  // NEW: Get appointments by doctor ID
  static getByDoctorId(doctorId: number) {
    return db.select().from(appointments).where(eq(appointments.doctorId, doctorId));
  }

  static create(data: typeof appointments.$inferInsert) {
    return db.insert(appointments).values(data).returning();
  }

  static update(id: number, data: Partial<typeof appointments.$inferInsert>) {
    return db.update(appointments)
      .set(data)
      .where(eq(appointments.appointmentId, id))
      .returning();
  }

  static delete(id: number) {
    return db.delete(appointments)
      .where(eq(appointments.appointmentId, id));
  }
}