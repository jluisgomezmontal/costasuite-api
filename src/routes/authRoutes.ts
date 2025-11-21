import { Router } from 'express';
import * as authController from '../controllers/authController';
import { validate } from '../middlewares/validate';

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  '/register',
  validate(authController.registerSchema),
  authController.register
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post(
  '/login',
  validate(authController.loginSchema),
  authController.login
);

export default router;
