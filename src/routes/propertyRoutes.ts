import { Router } from 'express';
import * as propertyController from '../controllers/propertyController';
import { authenticate, authorize } from '../middlewares/auth';
import { validate } from '../middlewares/validate';

const router = Router();

/**
 * @route   GET /api/properties
 * @desc    Get all properties (public)
 * @access  Public
 */
router.get(
  '/',
  validate(propertyController.getPropertiesSchema),
  propertyController.getAllProperties
);

/**
 * @route   GET /api/properties/:id
 * @desc    Get property by ID (public)
 * @access  Public
 */
router.get(
  '/:id',
  validate(propertyController.propertyIdSchema),
  propertyController.getPropertyById
);

/**
 * @route   POST /api/properties
 * @desc    Create new property
 * @access  Agent/Admin
 */
router.post(
  '/',
  authenticate,
  authorize('agent', 'admin'),
  validate(propertyController.createPropertySchema),
  propertyController.createProperty
);

/**
 * @route   PUT /api/properties/:id
 * @desc    Update property (only owner or admin)
 * @access  Agent/Admin
 */
router.put(
  '/:id',
  authenticate,
  authorize('agent', 'admin'),
  validate(propertyController.updatePropertySchema),
  propertyController.updateProperty
);

/**
 * @route   DELETE /api/properties/:id
 * @desc    Delete property (only owner or admin)
 * @access  Agent/Admin
 */
router.delete(
  '/:id',
  authenticate,
  authorize('agent', 'admin'),
  validate(propertyController.propertyIdSchema),
  propertyController.deleteProperty
);

export default router;
