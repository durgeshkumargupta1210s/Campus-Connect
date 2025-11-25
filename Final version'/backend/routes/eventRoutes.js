import express from 'express';
import { createEvent, getEvents, getEventById, updateEvent, deleteEvent, getUpcomingEvents } from '../controllers/eventController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/upcoming', getUpcomingEvents);
router.get('/', getEvents);
router.post('/', authenticate, authorize('admin', 'club_head'), createEvent);
router.get('/:id', getEventById);
router.put('/:id', authenticate, authorize('admin', 'club_head'), updateEvent);
router.delete('/:id', authenticate, authorize('admin', 'club_head'), deleteEvent);

export default router;
