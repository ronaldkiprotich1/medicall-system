import { Request, Response } from 'express';
import { AppointmentService } from '../appointment/appointment.service';

export class AppointmentController {
  static async getAll(_req: Request, res: Response) {
    try {
      const result = await AppointmentService.getAll();
      // For admin dashboard, return appointments array wrapped in object
      res.json({ appointments: result });
    } catch (error) {
      console.error('Error fetching appointments:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // NEW METHOD: Get detailed appointments with patient and doctor info
  static async getDetailed(_req: Request, res: Response) {
    try {
      const result = await AppointmentService.getDetailed();
     
      // Transform the data to match your frontend expectations
      const transformedData = result.map(appointment => ({
        appointmentId: appointment.appointmentId,
        userId: appointment.userId,
        doctorId: appointment.doctorId,
        appointmentDate: appointment.appointmentDate,
        timeSlot: appointment.timeSlot,
        appointmentStatus: appointment.appointmentStatus,
        totalAmount: appointment.totalAmount,
        notes: appointment.notes,
        createdAt: appointment.createdAt,
        updatedAt: appointment.updatedAt,
        patient: appointment.patient,
        doctor: appointment.doctor
      }));
      res.json({ data: transformedData });
    } catch (error) {
      console.error('Error fetching detailed appointments:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: 'Invalid appointment ID format' });
      
      const result = await AppointmentService.getById(id);
      if (!result) return res.status(404).json({ error: 'Appointment not found' });
      
      // Return appointment wrapped in object for consistency with frontend expectations
      res.json({ appointment: result });
    } catch (error) {
      console.error('Error fetching appointment by ID:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // NEW: Get appointments by user ID
  static async getByUserId(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) return res.status(400).json({ error: 'Invalid user ID format' });
      
      const appointments = await AppointmentService.getByUserId(userId);
      res.json({ appointments });
    } catch (error) {
      console.error('Error fetching appointments by user ID:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // NEW: Get appointments by doctor ID
  static async getByDoctorId(req: Request, res: Response) {
    try {
      const doctorId = parseInt(req.params.doctorId);
      if (isNaN(doctorId)) return res.status(400).json({ error: 'Invalid doctor ID format' });
      
      const appointments = await AppointmentService.getByDoctorId(doctorId);
      res.json({ appointments });
    } catch (error) {
      console.error('Error fetching appointments by doctor ID:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { userId, doctorId, appointmentDate, timeSlot } = req.body;
      if (!userId || !doctorId || !appointmentDate || !timeSlot) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      const [appointment] = await AppointmentService.create(req.body);
      res.status(201).json(appointment);
    } catch (error) {
      console.error('Error creating appointment:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: 'Invalid appointment ID format' });
      
      const [appointment] = await AppointmentService.update(id, req.body);
      if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found' });
      }
      res.json(appointment);
    } catch (error) {
      console.error('Error updating appointment:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: 'Invalid appointment ID format' });
      
      const deleted = await AppointmentService.delete(id);
      if (deleted.rowCount === 0 || (Array.isArray(deleted) && deleted.length === 0)) {
        return res.status(404).json({ error: 'Appointment not found' });
      }
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting appointment:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}