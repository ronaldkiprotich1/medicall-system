import { Request, Response } from 'express';
import { DoctorService } from '../doctor/doctor.service';

export class DoctorController {
  static async getAll(_req: Request, res: Response) {
    const result = await DoctorService.getAll();
    res.json(result);
  }

  static async getById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const result = await DoctorService.getById(id);
    if (!result) return res.status(404).json({ error: 'Doctor not found' });
    res.json(result);
  }

  static async create(req: Request, res: Response) {
    const [doctor] = await DoctorService.create(req.body);
    res.status(201).json(doctor);
  }

  static async update(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const [doctor] = await DoctorService.update(id, req.body);
    res.json(doctor);
  }

  static async delete(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    await DoctorService.delete(id);
    res.status(204).send();
  }
}