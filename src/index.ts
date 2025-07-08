import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './auth/auth.router';
// import other routes as needed...

dotenv.config(); // Load env variables

const app = express();
const PORT = process.env.PORT || 8081;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Routes
app.use('/api/auth', authRoutes);
// app.use('/api/doctors', doctorRoutes); // when you add more

// Health check or welcome route
app.get('/', (_req, res) => {
  res.send(' Server is running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
