import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { sendEmail } from '../mailer/mailer';
import { db, users } from '../Drizzle/db';
import { eq } from 'drizzle-orm';

export const createUserController = async (req: Request, res: Response) => {
  try {
    const userData = req.body;
    const user = await AuthService.register(userData);

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const verificationUrl = `${frontendUrl}/verify-email?email=${encodeURIComponent(user.email)}&code=${user.verificationCode}`;

    // ✅ Dev-only logging (remove in production)
    console.log('🔐 Verification Code:', user.verificationCode);
    console.log('🔗 Verification URL:', verificationUrl);

    const plainText = `Your SwiftCare verification code is: ${user.verificationCode}`;
    const html = `<p>Your SwiftCare verification code is:</p><h2>${user.verificationCode}</h2>`;

    await sendEmail(user.email, 'Verify your SwiftCare account', plainText, html);

    res.status(201).json({ message: 'User created successfully. Verification code sent to email.' });
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

export const loginUserController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password);

    res.status(200).json({
      token: result.token,
      user: {
        userId: result.user.userId,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        email: result.user.email,
        role: result.user.role,
      },
    });
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

export const verifyUserController = async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;
    const user = await db.query.users.findFirst({ where: eq(users.email, email) });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.verificationCode !== code) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    const updatedUser = await AuthService.verifyUser(email);

    res.status(200).json({ message: 'User verified successfully', user: updatedUser });
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

export const getAllUsersController = async (_req: Request, res: Response) => {
  try {
    const users = await AuthService.getAllUsers();
    res.status(200).json(users);
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

export const updateUserByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedUser = await AuthService.updateUserById(id, req.body);
    res.status(200).json(updatedUser);
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

export const getUserByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await AuthService.getUserById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message });
  }
};
