import { Router, Request, Response } from 'express';
import { PrescriptionController } from './prescription.controller';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  await PrescriptionController.getAll(req, res);
});

router.get('/:id', async (req: Request, res: Response) => {
  await PrescriptionController.getById(req, res);
});

router.post('/', async (req: Request, res: Response) => {
  await PrescriptionController.create(req, res);
});

router.put('/:id', async (req: Request, res: Response) => {
  await PrescriptionController.update(req, res);
});

router.delete('/:id', async (req: Request, res: Response) => {
  await PrescriptionController.delete(req, res);
});

export default router;
