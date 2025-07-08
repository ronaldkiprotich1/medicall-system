import { Request, Response } from 'express';
import { PrescriptionService } from '../prescription/prescription.service';

export class PrescriptionController {
  static async getAll(_req: Request, res: Response) {
    const result = await PrescriptionService.getAll();
    res.json(result);
  }

  static async getById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const result = await PrescriptionService.getById(id);
    if (!result) return res.status(404).json({ error: 'Prescription not found' });
    res.json(result);
  }

  static async create(req: Request, res: Response) {
    const [prescription] = await PrescriptionService.create(req.body);
    res.status(201).json(prescription);
  }

  static async update(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const [prescription] = await PrescriptionService.update(id, req.body);
    res.json(prescription);
  }

  static async delete(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    await PrescriptionService.delete(id);
    res.status(204).send();
  }
}