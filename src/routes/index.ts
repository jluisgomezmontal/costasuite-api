import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import propertyRoutes from './propertyRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/properties', propertyRoutes);

export default router;
