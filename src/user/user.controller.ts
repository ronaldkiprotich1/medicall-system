import { Request, Response } from 'express';
import { UserService } from '../user/user.service';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export class UserController {
  static async register(req: Request, res: Response) {
    const { password, ...rest } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const [user] = await UserService.create({ ...rest, password: hashedPassword });
    res.status(201).json(user);
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const user = await UserService.getByEmail(email);
    if (!user) return res.status(404).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.userId, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  }

  static async getAll(_req: Request, res: Response) {
    const users = await UserService.getAll();
    res.json(users);
  }

  static async getById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const user = await UserService.getById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  }

  static async update(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const [user] = await UserService.update(id, req.body);
    res.json(user);
  }

  static async delete(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    await UserService.delete(id);
    res.status(204).send();
  }
}
