"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.complaintsRelations = exports.paymentsRelations = exports.prescriptionsRelations = exports.appointmentsRelations = exports.doctorsRelations = exports.usersRelations = exports.complaints = exports.payments = exports.prescriptions = exports.appointments = exports.doctors = exports.users = exports.availableDaysEnum = exports.complaintStatusEnum = exports.paymentStatusEnum = exports.appointmentStatusEnum = exports.userRoleEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
// Enums
exports.userRoleEnum = (0, pg_core_1.pgEnum)('user_role', ['user', 'admin', 'doctor']);
exports.appointmentStatusEnum = (0, pg_core_1.pgEnum)('appointment_status', ['Pending', 'Confirmed', 'Cancelled', 'Completed']);
exports.paymentStatusEnum = (0, pg_core_1.pgEnum)('payment_status', ['Pending', 'Completed', 'Failed', 'Refunded']);
exports.complaintStatusEnum = (0, pg_core_1.pgEnum)('complaint_status', ['Open', 'In Progress', 'Resolved', 'Closed']);
exports.availableDaysEnum = (0, pg_core_1.pgEnum)('available_days', ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
// Users Table
exports.users = (0, pg_core_1.pgTable)('users', {
    userId: (0, pg_core_1.serial)('user_id').primaryKey(),
    firstName: (0, pg_core_1.varchar)('first_name', { length: 100 }).notNull(),
    lastName: (0, pg_core_1.varchar)('last_name', { length: 100 }).notNull(),
    email: (0, pg_core_1.varchar)('email', { length: 255 }).notNull().unique(),
    password: (0, pg_core_1.varchar)('password', { length: 255 }).notNull(),
    contactPhone: (0, pg_core_1.varchar)('contact_phone', { length: 20 }),
    address: (0, pg_core_1.text)('address'),
    role: (0, exports.userRoleEnum)('role').default('user').notNull(),
    isVerified: (0, pg_core_1.boolean)('is_verified').default(false),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
});
// Doctors Table
exports.doctors = (0, pg_core_1.pgTable)('doctors', {
    doctorId: (0, pg_core_1.serial)('doctor_id').primaryKey(),
    userId: (0, pg_core_1.integer)('user_id').references(() => exports.users.userId).notNull(),
    firstName: (0, pg_core_1.varchar)('first_name', { length: 100 }).notNull(),
    lastName: (0, pg_core_1.varchar)('last_name', { length: 100 }).notNull(),
    specialization: (0, pg_core_1.varchar)('specialization', { length: 100 }).notNull(),
    contactPhone: (0, pg_core_1.varchar)('contact_phone', { length: 20 }),
    availableDays: (0, pg_core_1.varchar)('available_days', { length: 255 }), // JSON string of available days
    consultationFee: (0, pg_core_1.decimal)('consultation_fee', { precision: 10, scale: 2 }),
    biography: (0, pg_core_1.text)('biography'),
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
});
// Appointments Table
exports.appointments = (0, pg_core_1.pgTable)('appointments', {
    appointmentId: (0, pg_core_1.serial)('appointment_id').primaryKey(),
    userId: (0, pg_core_1.integer)('user_id').references(() => exports.users.userId).notNull(),
    doctorId: (0, pg_core_1.integer)('doctor_id').references(() => exports.doctors.doctorId).notNull(),
    appointmentDate: (0, pg_core_1.date)('appointment_date').notNull(),
    timeSlot: (0, pg_core_1.time)('time_slot').notNull(),
    totalAmount: (0, pg_core_1.decimal)('total_amount', { precision: 10, scale: 2 }),
    appointmentStatus: (0, exports.appointmentStatusEnum)('appointment_status').default('Pending').notNull(),
    notes: (0, pg_core_1.text)('notes'),
    cancellationReason: (0, pg_core_1.text)('cancellation_reason'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
});
// Prescriptions Table
exports.prescriptions = (0, pg_core_1.pgTable)('prescriptions', {
    prescriptionId: (0, pg_core_1.serial)('prescription_id').primaryKey(),
    appointmentId: (0, pg_core_1.integer)('appointment_id').references(() => exports.appointments.appointmentId).notNull(),
    doctorId: (0, pg_core_1.integer)('doctor_id').references(() => exports.doctors.doctorId).notNull(),
    patientId: (0, pg_core_1.integer)('patient_id').references(() => exports.users.userId).notNull(),
    medications: (0, pg_core_1.text)('medications').notNull(), // JSON string of medications
    dosage: (0, pg_core_1.text)('dosage'),
    instructions: (0, pg_core_1.text)('instructions'),
    notes: (0, pg_core_1.text)('notes'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
});
// Payments Table
exports.payments = (0, pg_core_1.pgTable)('payments', {
    paymentId: (0, pg_core_1.serial)('payment_id').primaryKey(),
    appointmentId: (0, pg_core_1.integer)('appointment_id').references(() => exports.appointments.appointmentId).notNull(),
    amount: (0, pg_core_1.decimal)('amount', { precision: 10, scale: 2 }).notNull(),
    paymentStatus: (0, exports.paymentStatusEnum)('payment_status').default('Pending').notNull(),
    transactionId: (0, pg_core_1.varchar)('transaction_id', { length: 255 }),
    paymentMethod: (0, pg_core_1.varchar)('payment_method', { length: 50 }), // 'stripe', 'mpesa', etc.
    stripePaymentIntentId: (0, pg_core_1.varchar)('stripe_payment_intent_id', { length: 255 }),
    paymentDate: (0, pg_core_1.timestamp)('payment_date'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
});
// Complaints/Support Tickets Table
exports.complaints = (0, pg_core_1.pgTable)('complaints', {
    complaintId: (0, pg_core_1.serial)('complaint_id').primaryKey(),
    userId: (0, pg_core_1.integer)('user_id').references(() => exports.users.userId).notNull(),
    relatedAppointmentId: (0, pg_core_1.integer)('related_appointment_id').references(() => exports.appointments.appointmentId),
    subject: (0, pg_core_1.varchar)('subject', { length: 255 }).notNull(),
    description: (0, pg_core_1.text)('description').notNull(),
    status: (0, exports.complaintStatusEnum)('status').default('Open').notNull(),
    adminResponse: (0, pg_core_1.text)('admin_response'),
    priority: (0, pg_core_1.varchar)('priority', { length: 20 }).default('Medium'), // 'Low', 'Medium', 'High', 'Urgent'
    resolvedAt: (0, pg_core_1.timestamp)('resolved_at'),
    assignedTo: (0, pg_core_1.integer)('assigned_to').references(() => exports.users.userId), // Admin user who handled the complaint
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
});
// Relations
exports.usersRelations = (0, drizzle_orm_1.relations)(exports.users, ({ many, one }) => ({
    doctorProfile: one(exports.doctors, {
        fields: [exports.users.userId],
        references: [exports.doctors.userId],
    }),
    appointments: many(exports.appointments),
    prescriptions: many(exports.prescriptions),
    complaints: many(exports.complaints),
}));
exports.doctorsRelations = (0, drizzle_orm_1.relations)(exports.doctors, ({ one, many }) => ({
    user: one(exports.users, {
        fields: [exports.doctors.userId],
        references: [exports.users.userId],
    }),
    appointments: many(exports.appointments),
    prescriptions: many(exports.prescriptions),
}));
exports.appointmentsRelations = (0, drizzle_orm_1.relations)(exports.appointments, ({ one, many }) => ({
    user: one(exports.users, {
        fields: [exports.appointments.userId],
        references: [exports.users.userId],
    }),
    doctor: one(exports.doctors, {
        fields: [exports.appointments.doctorId],
        references: [exports.doctors.doctorId],
    }),
    prescriptions: many(exports.prescriptions),
    payments: many(exports.payments),
    complaints: many(exports.complaints),
}));
exports.prescriptionsRelations = (0, drizzle_orm_1.relations)(exports.prescriptions, ({ one }) => ({
    appointment: one(exports.appointments, {
        fields: [exports.prescriptions.appointmentId],
        references: [exports.appointments.appointmentId],
    }),
    doctor: one(exports.doctors, {
        fields: [exports.prescriptions.doctorId],
        references: [exports.doctors.doctorId],
    }),
    patient: one(exports.users, {
        fields: [exports.prescriptions.patientId],
        references: [exports.users.userId],
    }),
}));
exports.paymentsRelations = (0, drizzle_orm_1.relations)(exports.payments, ({ one }) => ({
    appointment: one(exports.appointments, {
        fields: [exports.payments.appointmentId],
        references: [exports.appointments.appointmentId],
    }),
}));
exports.complaintsRelations = (0, drizzle_orm_1.relations)(exports.complaints, ({ one }) => ({
    user: one(exports.users, {
        fields: [exports.complaints.userId],
        references: [exports.users.userId],
    }),
    relatedAppointment: one(exports.appointments, {
        fields: [exports.complaints.relatedAppointmentId],
        references: [exports.appointments.appointmentId],
    }),
    assignedAdmin: one(exports.users, {
        fields: [exports.complaints.assignedTo],
        references: [exports.users.userId],
    }),
}));
