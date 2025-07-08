import { Router, Request, Response } from 'express';
import { ComplaintController } from '../complaints/complaints.controller';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  await ComplaintController.getAll(req, res);
});

router.get('/:id', async (req: Request, res: Response) => {
  await ComplaintController.getById(req, res);
});

router.post('/', async (req: Request, res: Response) => {
  await ComplaintController.create(req, res);
});

router.put('/:id', async (req: Request, res: Response) => {
  await ComplaintController.update(req, res);
});

router.delete('/:id', async (req: Request, res: Response) => {
  await ComplaintController.delete(req, res);
});

export default router;
