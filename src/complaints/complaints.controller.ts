import { Request, Response } from 'express';
import { ComplaintService } from '../complaints/complaints.service';

export class ComplaintController {
  static async getAll(_req: Request, res: Response) {
    const result = await ComplaintService.getAll();
    res.json(result);
  }

  static async getById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid complaint ID format' });

    const result = await ComplaintService.getById(id);
    if (!result) return res.status(404).json({ error: 'Complaint not found' });

    res.json(result);
  }

  static async create(req: Request, res: Response) {
    const { userId, subject, description } = req.body;

    if (!userId || !subject || !description) {
      return res.status(400).json({ error: 'userId, subject, and description are required' });
    }

    if (typeof userId !== 'number') {
      return res.status(400).json({ error: 'userId must be a number' });
    }

    try {
      const [complaint] = await ComplaintService.create(req.body);
      res.status(201).json(complaint);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create complaint' });
    }
  }

  static async update(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid complaint ID format' });

    const exists = await ComplaintService.getById(id);
    if (!exists) return res.status(404).json({ error: 'Complaint not found' });

    const [complaint] = await ComplaintService.update(id, req.body);
    res.json(complaint);
  }

  static async delete(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid complaint ID format' });

    const exists = await ComplaintService.getById(id);
    if (!exists) return res.status(404).json({ error: 'Complaint not found' });

    await ComplaintService.delete(id);
    res.status(204).send();
  }
}
