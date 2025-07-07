import { db, users, doctors, appointments, prescriptions, payments, complaints, testConnection, closeConnection } from './db';
import { config } from 'dotenv';
import bcrypt from 'bcryptjs';

// Load environment variables
config();

/**
 * Hash password for seeding
 */
async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

/**
 * Seed users (admins, patients, doctors)
 */
async function seedUsers() {
  console.log('👥 Seeding users...');

  const hashedPassword = await hashPassword('password123');

  const userData = [
    // Admin users
    {
      firstName: 'John',
      lastName: 'Admin',
      email: 'admin@medical.com',
      password: hashedPassword,
      contactPhone: '+254700000001',
      address: '123 Admin Street, Nairobi',
      role: 'admin' as const,
      isVerified: true,
    },
    {
      firstName: 'Jane',
      lastName: 'SuperAdmin',
      email: 'superadmin@medical.com',
      password: hashedPassword,
      contactPhone: '+254700000002',
      address: '456 Admin Avenue, Nairobi',
      role: 'admin' as const,
      isVerified: true,
    },
    // Doctor users
    {
      firstName: 'Dr. Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@medical.com',
      password: hashedPassword,
      contactPhone: '+254700000003',
      address: '789 Medical Center, Nairobi',
      role: 'doctor' as const,
      isVerified: true,
    },
    {
      firstName: 'Dr. Michael',
      lastName: 'Smith',
      email: 'michael.smith@medical.com',
      password: hashedPassword,
      contactPhone: '+254700000004',
      address: '321 Health Plaza, Nairobi',
      role: 'doctor' as const,
      isVerified: true,
    },
    {
      firstName: 'Dr. Emily',
      lastName: 'Brown',
      email: 'emily.brown@medical.com',
      password: hashedPassword,
      contactPhone: '+254700000005',
      address: '654 Wellness Street, Nairobi',
      role: 'doctor' as const,
      isVerified: true,
    },
    // Patient users
    {
      firstName: 'Peter',
      lastName: 'Kamau',
      email: 'peter.kamau@email.com',
      password: hashedPassword,
      contactPhone: '+254700000006',
      address: '123 Patient Street, Thika',
      role: 'user' as const,
      isVerified: true,
    },
    {
      firstName: 'Mary',
      lastName: 'Wanjiku',
      email: 'mary.wanjiku@email.com',
      password: hashedPassword,
      contactPhone: '+254700000007',
      address: '456 Patient Avenue, Thika',
      role: 'user' as const,
      isVerified: true,
    },
    {
      firstName: 'James',
      lastName: 'Mwangi',
      email: 'james.mwangi@email.com',
      password: hashedPassword,
      contactPhone: '+254700000008',
      address: '789 Patient Road, Nairobi',
      role: 'user' as const,
      isVerified: true,
    },
    {
      firstName: 'Grace',
      lastName: 'Njeri',
      email: 'grace.njeri@email.com',
      password: hashedPassword,
      contactPhone: '+254700000009',
      address: '321 Patient Lane, Thika',
      role: 'user' as const,
      isVerified: true,
    },
    {
      firstName: 'David',
      lastName: 'Ochieng',
      email: 'david.ochieng@email.com',
      password: hashedPassword,
      contactPhone: '+254700000010',
      address: '654 Patient Close, Nairobi',
      role: 'user' as const,
      isVerified: false, // Some unverified users
    },
  ];

  const insertedUsers = await db.insert(users).values(userData).returning();
  console.log(`✅ Seeded ${insertedUsers.length} users`);
  return insertedUsers;
}

/**
 * Seed doctors
 */
async function seedDoctors(usersList: any[]) {
  console.log('👨‍⚕️ Seeding doctors...');

  // Get doctor users
  const doctorUsers = usersList.filter(user => user.role === 'doctor');

  const doctorData = [
    {
      userId: doctorUsers[0].userId,
      firstName: 'Dr. Sarah',
      lastName: 'Johnson',
      specialization: 'Cardiology',
      contactPhone: '+254700000003',
      availableDays: JSON.stringify(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']),
      consultationFee: '5000.00',
      biography: 'Experienced cardiologist with 15+ years in heart disease treatment.',
      isActive: true,
    },
    {
      userId: doctorUsers[1].userId,
      firstName: 'Dr. Michael',
      lastName: 'Smith',
      specialization: 'Pediatrics',
      contactPhone: '+254700000004',
      availableDays: JSON.stringify(['Monday', 'Wednesday', 'Friday', 'Saturday']),
      consultationFee: '3500.00',
      biography: 'Specialized in child healthcare and development.',
      isActive: true,
    },
    {
      userId: doctorUsers[2].userId,
      firstName: 'Dr. Emily',
      lastName: 'Brown',
      specialization: 'Dermatology',
      contactPhone: '+254700000005',
      availableDays: JSON.stringify(['Tuesday', 'Thursday', 'Saturday']),
      consultationFee: '4000.00',
      biography: 'Expert in skin conditions and cosmetic dermatology.',
      isActive: true,
    },
  ];

  const insertedDoctors = await db.insert(doctors).values(doctorData).returning();
  console.log(`✅ Seeded ${insertedDoctors.length} doctors`);
  return insertedDoctors;
}

/**
 * Seed appointments
 */
async function seedAppointments(usersList: any[], doctorsList: any[]) {
  console.log('📅 Seeding appointments...');

  // Get patient users
  const patientUsers = usersList.filter(user => user.role === 'user');

  const appointmentData = [
    {
      userId: patientUsers[0].userId,
      doctorId: doctorsList[0].doctorId,
      appointmentDate: '2025-07-15',
      timeSlot: '09:00:00',
      totalAmount: '5000.00',
      appointmentStatus: 'Confirmed' as const,
      notes: 'Regular checkup for heart condition',
    },
    {
      userId: patientUsers[1].userId,
      doctorId: doctorsList[1].doctorId,
      appointmentDate: '2025-07-16',
      timeSlot: '10:30:00',
      totalAmount: '3500.00',
      appointmentStatus: 'Confirmed' as const,
      notes: 'Child vaccination',
    },
    {
      userId: patientUsers[2].userId,
      doctorId: doctorsList[2].doctorId,
      appointmentDate: '2025-07-17',
      timeSlot: '14:00:00',
      totalAmount: '4000.00',
      appointmentStatus: 'Pending' as const,
      notes: 'Skin rash consultation',
    },
    {
      userId: patientUsers[3].userId,
      doctorId: doctorsList[0].doctorId,
      appointmentDate: '2025-07-18',
      timeSlot: '11:00:00',
      totalAmount: '5000.00',
      appointmentStatus: 'Completed' as const,
      notes: 'Follow-up appointment',
    },
    {
      userId: patientUsers[0].userId,
      doctorId: doctorsList[1].doctorId,
      appointmentDate: '2025-07-20',
      timeSlot: '15:30:00',
      totalAmount: '3500.00',
      appointmentStatus: 'Cancelled' as const,
      notes: 'General consultation',
      cancellationReason: 'Patient requested cancellation',
    },
  ];

  const insertedAppointments = await db.insert(appointments).values(appointmentData).returning();
  console.log(`✅ Seeded ${insertedAppointments.length} appointments`);
  return insertedAppointments;
}

/**
 * Seed prescriptions
 */
async function seedPrescriptions(appointmentsList: any[], doctorsList: any[], usersList: any[]) {
  console.log('💊 Seeding prescriptions...');

  // Only create prescriptions for completed appointments
  const completedAppointments = appointmentsList.filter(apt => apt.appointmentStatus === 'Completed');
  const patientUsers = usersList.filter(user => user.role === 'user');

  const prescriptionData = [
    {
      appointmentId: completedAppointments[0].appointmentId,
      doctorId: doctorsList[0].doctorId,
      patientId: patientUsers[3].userId,
      medications: JSON.stringify([
        { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily' },
        { name: 'Metoprolol', dosage: '25mg', frequency: 'Twice daily' }
      ]),
      dosage: 'As prescribed above',
      instructions: 'Take with food. Monitor blood pressure daily.',
      notes: 'Patient responded well to treatment. Continue for 3 months.',
    },
  ];

  const insertedPrescriptions = await db.insert(prescriptions).values(prescriptionData).returning();
  console.log(`✅ Seeded ${insertedPrescriptions.length} prescriptions`);
  return insertedPrescriptions;
}

/**
 * Seed payments
 */
async function seedPayments(appointmentsList: any[]) {
  console.log('💳 Seeding payments...');

  const paymentData = [
    {
      appointmentId: appointmentsList[0].appointmentId,
      amount: '5000.00',
      paymentStatus: 'Completed' as const,
      transactionId: 'TXN_001_2025',
      paymentMethod: 'stripe',
      stripePaymentIntentId: 'pi_1234567890',
      paymentDate: new Date('2025-07-15T08:30:00Z'),
    },
    {
      appointmentId: appointmentsList[1].appointmentId,
      amount: '3500.00',
      paymentStatus: 'Completed' as const,
      transactionId: 'TXN_002_2025',
      paymentMethod: 'mpesa',
      paymentDate: new Date('2025-07-16T09:15:00Z'),
    },
    {
      appointmentId: appointmentsList[2].appointmentId,
      amount: '4000.00',
      paymentStatus: 'Pending' as const,
      transactionId: 'TXN_003_2025',
      paymentMethod: 'stripe',
    },
    {
      appointmentId: appointmentsList[3].appointmentId,
      amount: '5000.00',
      paymentStatus: 'Completed' as const,
      transactionId: 'TXN_004_2025',
      paymentMethod: 'stripe',
      stripePaymentIntentId: 'pi_0987654321',
      paymentDate: new Date('2025-07-18T10:45:00Z'),
    },
  ];

  const insertedPayments = await db.insert(payments).values(paymentData).returning();
  console.log(`✅ Seeded ${insertedPayments.length} payments`);
  return insertedPayments;
}

/**
 * Seed complaints/support tickets
 */
async function seedComplaints(usersList: any[], appointmentsList: any[]) {
  console.log('📝 Seeding complaints...');

  const patientUsers = usersList.filter(user => user.role === 'user');
  const adminUsers = usersList.filter(user => user.role === 'admin');

  const complaintData = [
    {
      userId: patientUsers[0].userId,
      relatedAppointmentId: appointmentsList[0].appointmentId,
      subject: 'Appointment Scheduling Issue',
      description: 'I had difficulty changing my appointment time through the system.',
      status: 'Resolved' as const,
      adminResponse: 'Issue has been resolved. You can now reschedule appointments easily.',
      priority: 'Medium',
      assignedTo: adminUsers[0].userId,
      resolvedAt: new Date('2025-07-10T14:30:00Z'),
    },
    {
      userId: patientUsers[1].userId,
      relatedAppointmentId: appointmentsList[1].appointmentId,
      subject: 'Payment Processing Problem',
      description: 'My payment was charged twice for the same appointment.',
      status: 'In Progress' as const,
      priority: 'High',
      assignedTo: adminUsers[1].userId,
    },
    {
      userId: patientUsers[2].userId,
      subject: 'General Inquiry',
      description: 'I need information about available specialists in cardiology.',
      status: 'Open' as const,
      priority: 'Low',
    },
    {
      userId: patientUsers[3].userId,
      relatedAppointmentId: appointmentsList[4].appointmentId,
      subject: 'Cancelled Appointment Refund',
      description: 'I cancelled my appointment but have not received my refund yet.',
      status: 'Closed' as const,
      adminResponse: 'Refund has been processed and will appear in 3-5 business days.',
      priority: 'Medium',
      assignedTo: adminUsers[0].userId,
      resolvedAt: new Date('2025-07-12T16:00:00Z'),
    },
  ];

  const insertedComplaints = await db.insert(complaints).values(complaintData).returning();
  console.log(`✅ Seeded ${insertedComplaints.length} complaints`);
  return insertedComplaints;
}

/**
 * Clear all data from tables
 */
async function clearDatabase() {
  console.log('🧹 Clearing existing data...');
  
  // Delete in reverse order to respect foreign key constraints
  await db.delete(complaints);
  await db.delete(payments);
  await db.delete(prescriptions);
  await db.delete(appointments);
  await db.delete(doctors);
  await db.delete(users);
  
  console.log('✅ Database cleared');
}

/**
 * Main seeding function
 */
async function seedDatabase() {
  console.log('🌱 Starting database seeding...');
  
  try {
    // Test database connection
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Database connection failed');
    }

    // Clear existing data
    await clearDatabase();

    // Seed data in order
    const usersList = await seedUsers();
    const doctorsList = await seedDoctors(usersList);
    const appointmentsList = await seedAppointments(usersList, doctorsList);
    const prescriptionsList = await seedPrescriptions(appointmentsList, doctorsList, usersList);
    const paymentsList = await seedPayments(appointmentsList);
    const complaintsList = await seedComplaints(usersList, appointmentsList);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Seeded data summary:');
    console.log(`   Users: ${usersList.length}`);
    console.log(`   Doctors: ${doctorsList.length}`);
    console.log(`   Appointments: ${appointmentsList.length}`);
    console.log(`   Prescriptions: ${prescriptionsList.length}`);
    console.log(`   Payments: ${paymentsList.length}`);
    console.log(`   Complaints: ${complaintsList.length}`);

    console.log('\n🔑 Test accounts:');
    console.log('   Admin: admin@medical.com / password123');
    console.log('   Doctor: sarah.johnson@medical.com / password123');
    console.log('   Patient: peter.kamau@email.com / password123');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await closeConnection();
  }
}

/**
 * Handle command line arguments
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'seed':
      await seedDatabase();
      break;
    case 'clear':
      await clearDatabase();
      await closeConnection();
      break;
    default:
      console.log('Available commands:');
      console.log('  npm run db:seed       - Seed database with sample data');
      console.log('  npm run db:clear      - Clear all data from database');
      break;
  }
}

// Run if called directly
if (require.main === module) {
  main().catch((error) => {
    console.error('❌ Seed script failed:', error);
    process.exit(1);
  });
}

export { seedDatabase, clearDatabase };