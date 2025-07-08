import { Router, Request, Response } from 'express';
import { DoctorController } from '../doctor/doctor.controller';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  await DoctorController.getAll(req, res);
});

router.get('/:id', async (req: Request, res: Response) => {
  await DoctorController.getById(req, res);
});

router.post('/', async (req: Request, res: Response) => {
  await DoctorController.create(req, res);
});

router.put('/:id', async (req: Request, res: Response) => {
  await DoctorController.update(req, res);
});

router.delete('/:id', async (req: Request, res: Response) => {
  await DoctorController.delete(req, res);
});

export default router;
