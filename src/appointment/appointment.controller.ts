import { Request, Response } from 'express';
import { AppointmentService } from '../appointment/appointment.service';

export class AppointmentController {
  static async getAll(_req: Request, res: Response) {
    try {
      const result = await AppointmentService.getAll();
      res.json(result);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const result = await AppointmentService.getById(id);
      if (!result) return res.status(404).json({ error: 'Appointment not found' });
      res.json(result);
    } catch (error) {
      console.error('Error fetching appointment by ID:', error);
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
