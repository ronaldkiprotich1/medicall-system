import { Router, Request, Response } from 'express';
import { AppointmentController } from '../appointment/appointment.controller';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  await AppointmentController.getAll(req, res);
});

router.get('/:id', async (req: Request, res: Response) => {
  await AppointmentController.getById(req, res);
});

router.post('/', async (req: Request, res: Response) => {
  await AppointmentController.create(req, res);
});

router.put('/:id', async (req: Request, res: Response) => {
  await AppointmentController.update(req, res);
});

router.delete('/:id', async (req: Request, res: Response) => {
  await AppointmentController.delete(req, res);
});

export default router;
