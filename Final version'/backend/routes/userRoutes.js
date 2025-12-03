import express from 'express';
import { getProfile, updateProfile, uploadResume, getAllUsers, getUserById, deleteUser } from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.post('/resume', authenticate, uploadResume);

// Admin routes
router.get('/', authenticate, authorize('admin'), getAllUsers);
router.get('/:id', authenticate, getUserById);
router.delete('/:id', authenticate, authorize('admin'), deleteUser);

export default router;
