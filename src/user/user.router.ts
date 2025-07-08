import { Router, Request, Response } from 'express';
import { UserController } from '../user/user.controller';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
  await UserController.register(req, res);
});

router.post('/login', async (req: Request, res: Response) => {
  await UserController.login(req, res);
});

router.get('/', async (req: Request, res: Response) => {
  await UserController.getAll(req, res);
});

router.get('/:id', async (req: Request, res: Response) => {
  await UserController.getById(req, res);
});

router.put('/:id', async (req: Request, res: Response) => {
  await UserController.update(req, res);
});

router.delete('/:id', async (req: Request, res: Response) => {
  await UserController.delete(req, res);
});

export default router;
