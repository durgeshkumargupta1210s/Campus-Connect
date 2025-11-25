import express from 'express';
import { createPayment, getPayments, getPaymentById, completePayment, refundPayment } from '../controllers/paymentController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticate, createPayment);
router.get('/', authenticate, getPayments);
router.get('/:id', authenticate, getPaymentById);
router.put('/:id/complete', authenticate, completePayment);
router.put('/:id/refund', authenticate, refundPayment);

export default router;
