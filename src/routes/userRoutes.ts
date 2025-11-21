import { Router } from 'express';
import * as userController from '../controllers/userController';
import { authenticate, authorize } from '../middlewares/auth';
import { validate } from '../middlewares/validate';

const router = Router();

// Todas las rutas de usuarios requieren autenticación y rol admin
router.use(authenticate);
router.use(authorize('admin'));

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Admin
 */
router.get(
  '/',
  validate(userController.getUsersSchema),
  userController.getAllUsers
);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Admin
 */
router.get(
  '/:id',
  validate(userController.userIdSchema),
  userController.getUserById
);

/**
 * @route   POST /api/users
 * @desc    Create new user
 * @access  Admin
 */
router.post(
  '/',
  validate(userController.createUserSchema),
  userController.createUser
);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user
 * @access  Admin
 */
router.put(
  '/:id',
  validate(userController.updateUserSchema),
  userController.updateUser
);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user
 * @access  Admin
 */
router.delete(
  '/:id',
  validate(userController.userIdSchema),
  userController.deleteUser
);

export default router;
