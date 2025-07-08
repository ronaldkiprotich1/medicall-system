// src/controllers/payment.controller.ts
import { Request, Response } from 'express';
import { PaymentService } from '@/services/payment.service';
import { paymentSchema } from '@/validators/payment.validator';

export class PaymentController {
  static async create(req: Request, res: Response) {
    const parsed = paymentSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.format() });
    }

    const payment = await PaymentService.createPayment(parsed.data);
    res.status(201).json(payment);
  }

  static async getAll(_: Request, res: Response) {
    const payments = await PaymentService.getAllPayments();
    res.json(payments);
  }

  static async getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const payment = await PaymentService.getPaymentById(id);
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    res.json(payment);
  }

  static async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const updateData = req.body;

    const payment = await PaymentService.updatePayment(id, updateData);
    res.json(payment);
  }

  static async delete(req: Request, res: Response) {
    const id = Number(req.params.id);
    const payment = await PaymentService.deletePayment(id);
    res.json(payment);
  }
}
