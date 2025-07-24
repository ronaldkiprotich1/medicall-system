import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './auth/auth.router';
import userRoutes from './user/user.router';
import doctorRoutes from './doctor/doctor.router';
import prescriptionRoutes from './prescription/prescription.router';
import paymentsRoutes from './payments/payments.router';
import complaintsRoutes from './complaints/complaints.router';
import appointmentRoutes from './appointment/appointment.router';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8081;

// Middleware
app.use(
  cors({
    origin: 'http://localhost:5173', // frontend URL
    credentials: true,
  })
);
app.use(express.json()); // parse JSON body

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/prescription', prescriptionRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/complaints', complaintsRoutes);
app.use('/api/appointments', appointmentRoutes);


app.get('/', (_req, res) => {
  res.send(' SwiftCare Backend API is Running!');
});


app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});


app.listen(PORT, () => {
  console.log(`🚀 SwiftCare API running at http://localhost:${PORT}`);
});
