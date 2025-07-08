import { Request, Response } from 'express';
import { ComplaintService } from '../complaints/complaints.service';

export class ComplaintController {
  static async getAll(_req: Request, res: Response) {
    const result = await ComplaintService.getAll();
    res.json(result);
  }

  static async getById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const result = await ComplaintService.getById(id);
    if (!result) return res.status(404).json({ error: 'Complaint not found' });
    res.json(result);
  }

  static async create(req: Request, res: Response) {
    const [complaint] = await ComplaintService.create(req.body);
    res.status(201).json(complaint);
  }

  static async update(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const [complaint] = await ComplaintService.update(id, req.body);
    res.json(complaint);
  }

  static async delete(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    await ComplaintService.delete(id);
    res.status(204).send();
  }
}