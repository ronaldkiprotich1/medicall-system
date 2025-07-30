import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { sendEmail } from '../mailer/mailer';
import { db, users } from '../Drizzle/db';
import { eq } from 'drizzle-orm';

// Register User
export const createUserController = async (req: Request, res: Response) => {
  try {
    const userData = req.body;
    const user = await AuthService.register(userData);

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const verificationUrl = `${frontendUrl}/verify-email?email=${encodeURIComponent(user.email)}&code=${user.verificationCode}`;

    console.log('Verification Code:', user.verificationCode);
    console.log('Verification URL:', verificationUrl);

    const plainText = `Your SwiftCare verification code is: ${user.verificationCode}`;
    const html = `<p>Your SwiftCare verification code is:</p><h2>${user.verificationCode}</h2>`;

    await sendEmail(user.email, 'Verify your SwiftCare account', plainText, html);

    res.status(201).json({ message: 'User created successfully. Verification code sent to email.' });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(error.status || 500).json({ error: error.message });
  }
};

// Login User
export const loginUserController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password);

    res.status(200).json({
      token: result.token,
      role: result.user.role,
      user: {
        userId: result.user.userId,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        email: result.user.email,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(error.status || 500).json({ error: error.message });
  }
};

// ✅ Verify User + Send Success Email
export const verifyUserController = async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;

    const user = await db.query.users.findFirst({ where: eq(users.email, email) });
    if (!user) return res.status(404).json({ message: 'User not found' });

    console.log('Comparing codes:', String(code), '===', String(user.verificationCode));
    if (String(user.verificationCode) !== String(code)) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    const updatedUser = await AuthService.verifyUser(email);

    // ✅ Send success verification email
    const subject = 'SwiftCare Email Verified Successfully';
    const plainText = `Hi ${updatedUser.firstName}, your email has been successfully verified. You can now log in.`;
    const html = `
      <p>Hi <strong>${updatedUser.firstName}</strong>,</p>
      <p>Your email has been <strong>successfully verified ✅</strong>.</p>
      <p><a href="http://localhost:5173/login">Click here to log in</a></p>
    `;

    await sendEmail(email, subject, plainText, html);

    res.status(200).json({ message: 'User verified successfully', user: updatedUser });
  } catch (error: any) {
    console.error('Verification error:', error);
    res.status(error.status || 500).json({ error: error.message });
  }
};

// Get All Users
export const getAllUsersController = async (_req: Request, res: Response) => {
  try {
    const allUsers = await AuthService.getAllUsers();
    res.status(200).json(allUsers);
  } catch (error: any) {
    console.error('Get all users error:', error);
    res.status(error.status || 500).json({ error: error.message });
  }
};

// Get User by ID
export const getUserByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await AuthService.getUserById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (error: any) {
    console.error('Get user by ID error:', error);
    res.status(error.status || 500).json({ error: error.message });
  }
};

// Update User by ID
export const updateUserByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedUser = await AuthService.updateUserById(id, req.body);
    res.status(200).json(updatedUser);
  } catch (error: any) {
    console.error('Update user error:', error);
    res.status(error.status || 500).json({ error: error.message });
  }
};
