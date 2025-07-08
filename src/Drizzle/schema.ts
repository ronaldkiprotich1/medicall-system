import { pgTable, serial, varchar, text, timestamp, pgEnum, integer, decimal, boolean, date, time } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userRoleEnum = pgEnum('user_role', ['user', 'admin', 'doctor']);
export const appointmentStatusEnum = pgEnum('appointment_status', ['Pending', 'Confirmed', 'Cancelled', 'Completed']);
export const paymentStatusEnum = pgEnum('payment_status', ['Pending', 'Completed', 'Failed', 'Refunded']);
export const complaintStatusEnum = pgEnum('complaint_status', ['Open', 'In Progress', 'Resolved', 'Closed']);
export const availableDaysEnum = pgEnum('available_days', ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);

// Users Table
export const users = pgTable('users', {
  userId: serial('user_id').primaryKey(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  contactPhone: varchar('contact_phone', { length: 20 }),
  address: text('address'),
  role: userRoleEnum('role').default('user').notNull(),
  isVerified: boolean('is_verified').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Doctors Table
export const doctors = pgTable('doctors', {
  doctorId: serial('doctor_id').primaryKey(),
  userId: integer('user_id').references(() => users.userId).notNull(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  specialization: varchar('specialization', { length: 100 }).notNull(),
  contactPhone: varchar('contact_phone', { length: 20 }),
  availableDays: varchar('available_days', { length: 255 }), // JSON string of available days
  consultationFee: decimal('consultation_fee', { precision: 10, scale: 2 }),
  biography: text('biography'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Appointments Table
export const appointments = pgTable('appointments', {
  appointmentId: serial('appointment_id').primaryKey(),
  userId: integer('user_id').references(() => users.userId).notNull(),
  doctorId: integer('doctor_id').references(() => doctors.doctorId).notNull(),
  appointmentDate: date('appointment_date').notNull(),
  timeSlot: time('time_slot').notNull(),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }),
  appointmentStatus: appointmentStatusEnum('appointment_status').default('Pending').notNull(),
  notes: text('notes'),
  cancellationReason: text('cancellation_reason'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Prescriptions Table
export const prescriptions = pgTable('prescriptions', {
  prescriptionId: serial('prescription_id').primaryKey(),
  appointmentId: integer('appointment_id').references(() => appointments.appointmentId).notNull(),
  doctorId: integer('doctor_id').references(() => doctors.doctorId).notNull(),
  patientId: integer('patient_id').references(() => users.userId).notNull(),
  medications: text('medications').notNull(), // JSON string of medications
  dosage: text('dosage'),
  instructions: text('instructions'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Payments Table
export const payments = pgTable('payments', {
  paymentId: serial('payment_id').primaryKey(),
  appointmentId: integer('appointment_id').references(() => appointments.appointmentId).notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  paymentStatus: paymentStatusEnum('payment_status').default('Pending').notNull(),
  transactionId: varchar('transaction_id', { length: 255 }),
  paymentMethod: varchar('payment_method', { length: 50 }), // 'stripe', 'mpesa', etc.
  stripePaymentIntentId: varchar('stripe_payment_intent_id', { length: 255 }),
  paymentDate: timestamp('payment_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Complaints
export const complaints = pgTable('complaints', {
  complaintId: serial('complaint_id').primaryKey(),
  userId: integer('user_id').references(() => users.userId).notNull(),
  relatedAppointmentId: integer('related_appointment_id').references(() => appointments.appointmentId),
  subject: varchar('subject', { length: 255 }).notNull(),
  description: text('description').notNull(),
  status: complaintStatusEnum('status').default('Open').notNull(),
  adminResponse: text('admin_response'),
  priority: varchar('priority', { length: 20 }).default('Medium'), // 'Low', 'Medium', 'High', 'Urgent'
  resolvedAt: timestamp('resolved_at'),
  assignedTo: integer('assigned_to').references(() => users.userId), // Admin user who handled the complaint
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});



// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  doctorProfile: one(doctors, {
    fields: [users.userId],
    references: [doctors.userId],
  }),
  appointments: many(appointments),
  prescriptions: many(prescriptions),
  complaints: many(complaints),
}));

export const doctorsRelations = relations(doctors, ({ one, many }) => ({
  user: one(users, {
    fields: [doctors.userId],
    references: [users.userId],
  }),
  appointments: many(appointments),
  prescriptions: many(prescriptions),
}));

export const appointmentsRelations = relations(appointments, ({ one, many }) => ({
  user: one(users, {
    fields: [appointments.userId],
    references: [users.userId],
  }),
  doctor: one(doctors, {
    fields: [appointments.doctorId],
    references: [doctors.doctorId],
  }),
  prescriptions: many(prescriptions),
  payments: many(payments),
  complaints: many(complaints),
}));

export const prescriptionsRelations = relations(prescriptions, ({ one }) => ({
  appointment: one(appointments, {
    fields: [prescriptions.appointmentId],
    references: [appointments.appointmentId],
  }),
  doctor: one(doctors, {
    fields: [prescriptions.doctorId],
    references: [doctors.doctorId],
  }),
  patient: one(users, {
    fields: [prescriptions.patientId],
    references: [users.userId],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  appointment: one(appointments, {
    fields: [payments.appointmentId],
    references: [appointments.appointmentId],
  }),
}));

export const complaintsRelations = relations(complaints, ({ one }) => ({
  user: one(users, {
    fields: [complaints.userId],
    references: [users.userId],
  }),
  relatedAppointment: one(appointments, {
    fields: [complaints.relatedAppointmentId],
    references: [appointments.appointmentId],
  }),
  assignedAdmin: one(users, {
    fields: [complaints.assignedTo],
    references: [users.userId],
  }),
}));

// Type exports for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Doctor = typeof doctors.$inferSelect;
export type NewDoctor = typeof doctors.$inferInsert;
export type Appointment = typeof appointments.$inferSelect;
export type NewAppointment = typeof appointments.$inferInsert;
export type Prescription = typeof prescriptions.$inferSelect;
export type NewPrescription = typeof prescriptions.$inferInsert;
export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
export type Complaint = typeof complaints.$inferSelect;
export type NewComplaint = typeof complaints.$inferInsert;