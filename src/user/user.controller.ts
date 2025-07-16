import { Request, Response } from 'express';
import { UserService } from './user.service';

export class UserController {
  static async register(req: Request, res: Response) {
    const { firstName, lastName, email, password, role } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    try {
      const user = await UserService.create(req.body);
      return res.status(201).json(user);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      const result = await UserService.login(email, password);
      if (!result) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  }

  static async getAll(_req: Request, res: Response) {
    try {
      const result = await UserService.getAll();
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to retrieve users' });
    }
  }

  static async getById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    try {
      const user = await UserService.getById(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to get user', message: error.message });
    }
  }

  static async update(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    try {
      const updatedUser = await UserService.update(id, req.body);
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json(updatedUser);
    } catch (error: any) {
      res.status(400).json({ error: 'Failed to update user', message: error.message });
    }
  }

  static async delete(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    try {
      const user = await UserService.getById(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      await UserService.delete(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to delete user', message: error.message });
    }
  }
}
