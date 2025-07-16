import { Request, Response } from 'express';
import { PaymentService } from '../payments/payments.service';

export class PaymentController {
  static async getAll(_req: Request, res: Response) {
    try {
      const result = await PaymentService.getAll();
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  }

  static async getById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID format' });

    try {
      const result = await PaymentService.getById(id);
      if (!result) return res.status(404).json({ error: 'Payment not found' });
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async create(req: Request, res: Response) {
    const { appointmentId, amount, method, status } = req.body;

    // Simple input validation
    if (!appointmentId || !amount || !method || !status) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (isNaN(Number(amount))) {
      return res.status(400).json({ error: 'Invalid amount format' });
    }

    try {
      const [payment] = await PaymentService.create(req.body);
      res.status(201).json(payment);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async update(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID format' });

    try {
      const existing = await PaymentService.getById(id);
      if (!existing) return res.status(404).json({ error: 'Payment not found' });

      const [payment] = await PaymentService.update(id, req.body);
      res.json(payment);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async delete(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID format' });

    try {
      const existing = await PaymentService.getById(id);
      if (!existing) return res.status(404).json({ error: 'Payment not found' });

      await PaymentService.delete(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
