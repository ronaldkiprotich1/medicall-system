import { Router, Request, Response } from 'express';
import { AppointmentController } from '../appointment/appointment.controller';

const router = Router();

// Basic appointments endpoint
router.get('/', async (req: Request, res: Response) => {
  await AppointmentController.getAll(req, res);
});

// Detailed appointments endpoint (must come before /:id route)
router.get('/detailed', async (req: Request, res: Response) => {
  await AppointmentController.getDetailed(req, res);
});

// NEW: Get appointments by user ID
router.get('/user/:userId', async (req: Request, res: Response) => {
  await AppointmentController.getByUserId(req, res);
});

// NEW: Get appointments by doctor ID
router.get('/doctor/:doctorId', async (req: Request, res: Response) => {
  await AppointmentController.getByDoctorId(req, res);
});

// Get appointment by ID (keep this after the specific routes to avoid conflicts)
router.get('/:id', async (req: Request, res: Response) => {
  await AppointmentController.getById(req, res);
});

// Create a new appointment
router.post('/', async (req: Request, res: Response) => {
  await AppointmentController.create(req, res);
});

// Update appointment
router.put('/:id', async (req: Request, res: Response) => {
  await AppointmentController.update(req, res);
});

// Delete appointment
router.delete('/:id', async (req: Request, res: Response) => {
  await AppointmentController.delete(req, res);
});

export default router;