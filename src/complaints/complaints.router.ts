import { Router, Request, Response } from 'express';
import { ComplaintController } from '../complaints/complaints.controller';

const router = Router();

// Get all complaints
router.get('/', async (req: Request, res: Response) => {
  await ComplaintController.getAll(req, res);
});

// Get complaint by ID
router.get('/:id', async (req: Request, res: Response) => {
  await ComplaintController.getById(req, res);
});

// Create a new complaint
router.post('/', async (req: Request, res: Response) => {
  await ComplaintController.create(req, res);
});

// Update full complaint (PUT)
router.put('/:id', async (req: Request, res: Response) => {
  await ComplaintController.update(req, res);
});

// ✅ Update only complaint status (PATCH)
router.patch('/status/:id', async (req: Request, res: Response) => {
  await ComplaintController.updateStatus(req, res);
});

// Delete complaint
router.delete('/:id', async (req: Request, res: Response) => {
  await ComplaintController.delete(req, res);
});

export default router;
