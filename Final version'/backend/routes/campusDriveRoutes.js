import express from 'express';
import { createCampusDrive, getCampusDrives, getCampusDriveById, registerForDrive, deleteCampusDrive } from '../controllers/campusDriveController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getCampusDrives);
router.post('/', authenticate, authorize('admin', 'recruiter'), createCampusDrive);
router.get('/:id', getCampusDriveById);
router.post('/:id/register', authenticate, registerForDrive);
router.delete('/:id', authenticate, authorize('admin', 'recruiter'), deleteCampusDrive);

export default router;
