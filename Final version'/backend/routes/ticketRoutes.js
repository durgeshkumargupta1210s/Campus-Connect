import express from 'express';
import { createTicket, getTickets, getTicketById, checkInTicket } from '../controllers/ticketController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticate, createTicket);
router.get('/', authenticate, getTickets);
router.get('/:id', authenticate, getTicketById);
router.put('/:id/check-in', authenticate, checkInTicket);

export default router;
