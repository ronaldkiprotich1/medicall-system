import { Router, Request, Response } from 'express';
import { PaymentController } from '../payments/payments.controller';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  await PaymentController.getAll(req, res);
});

router.get('/:id', async (req: Request, res: Response) => {
  await PaymentController.getById(req, res);
});

router.post('/', async (req: Request, res: Response) => {
  await PaymentController.create(req, res);
});

router.put('/:id', async (req: Request, res: Response) => {
  await PaymentController.update(req, res);
});

router.delete('/:id', async (req: Request, res: Response) => {
  await PaymentController.delete(req, res);
});

export default router;
