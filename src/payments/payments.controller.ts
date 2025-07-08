// payment.controller.ts
import { Request, Response } from 'express';
import { PaymentService } from '../payments/payments.service';

export class PaymentController {
  static async getAll(_req: Request, res: Response) {
    const result = await PaymentService.getAll();
    res.json(result);
  }

  static async getById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const result = await PaymentService.getById(id);
    if (!result) return res.status(404).json({ error: 'Payment not found' });
    res.json(result);
  }

  static async create(req: Request, res: Response) {
    const [payment] = await PaymentService.create(req.body);
    res.status(201).json(payment);
  }

  static async update(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const [payment] = await PaymentService.update(id, req.body);
    res.json(payment);
  }

  static async delete(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    await PaymentService.delete(id);
    res.status(204).send();
  }
}