import { Router } from 'express';
import {
  createUserController,
  loginUserController,
  verifyUserController,
  getAllUsersController,
  updateUserByIdController,
  getUserByIdController,
} from '../auth/auth.controller';
import { adminRoleAuth, bothRoleAuth } from '../middleware/bearAuth';

const router = Router();

// Public routes
router.post('/register', async (req, res, next) => {
  try {
    await createUserController(req, res);
  } catch (error) {
    next(error);
  }
});

router.post('/verify', async (req, res, next) => {
  try {
    await verifyUserController(req, res);
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    await loginUserController(req, res);
  } catch (error) {
    next(error);
  }
});

// Protected admin-only route
router.get('/users', adminRoleAuth, async (req, res, next) => {
  try {
    await getAllUsersController(req, res);
  } catch (error) {
    next(error);
  }
});

// Protected user routes (admin + user)
router.put('/user/:id', bothRoleAuth, async (req, res, next) => {
  try {
    await updateUserByIdController(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/user/:id', bothRoleAuth, async (req, res, next) => {
  try {
    await getUserByIdController(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;
