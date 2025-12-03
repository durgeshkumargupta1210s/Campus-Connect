import express from 'express';
import { registerEvent, getRegistrations, cancelRegistration } from '../controllers/registrationController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticate, registerEvent);
router.get('/', authenticate, getRegistrations);
router.put('/:id/cancel', authenticate, cancelRegistration);

export default router;
