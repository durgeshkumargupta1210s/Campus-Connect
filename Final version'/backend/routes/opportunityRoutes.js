import express from 'express';
import { createOpportunity, getOpportunities, getOpportunityById, applyOpportunity, deleteOpportunity } from '../controllers/opportunityController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getOpportunities);
router.post('/', authenticate, authorize('admin', 'recruiter'), createOpportunity);
router.get('/:id', getOpportunityById);
router.post('/:id/apply', authenticate, applyOpportunity);
router.delete('/:id', authenticate, authorize('admin', 'recruiter'), deleteOpportunity);

export default router;
