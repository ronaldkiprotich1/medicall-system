import { Request, Response } from 'express';
import { AppointmentService } from '../appointment/appointment.service';

export class AppointmentController {
  static async getAll(_req: Request, res: Response) {
    const result = await AppointmentService.getAll();
    res.json(result);
  }

  static async getById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const result = await AppointmentService.getById(id);
    if (!result) return res.status(404).json({ error: 'Appointment not found' });
    res.json(result);
  }

  static async create(req: Request, res: Response) {
    const [appointment] = await AppointmentService.create(req.body);
    res.status(201).json(appointment);
  }

  static async update(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const [appointment] = await AppointmentService.update(id, req.body);
    res.json(appointment);
  }

  static async delete(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    await AppointmentService.delete(id);
    res.status(204).send();
  }
}
