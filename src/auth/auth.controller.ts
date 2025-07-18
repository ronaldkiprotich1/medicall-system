
import { Request, Response } from 'express';
import { AuthService } from '../../src/auth/auth.service';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const user = await AuthService.register(req.body);
      res.status(201).json(user);
    } catch (error: any) {
      const status = error.status || 400;
      const message = error.message || 'Registration failed';
      res.status(status).json({ error: message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      res.status(200).json(result);
    } catch (error: any) {
      const status = error.status || 401;
      const message = error.message || 'Login failed';
      res.status(status).json({ error: message });
    }
  }
}
