import express from 'express';
import { createClub, getClubs, getClubById, updateClub, deleteClub, joinClub, leaveClub } from '../controllers/clubController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getClubs);
router.post('/', authenticate, authorize('admin', 'club_head'), createClub);
router.get('/:id', getClubById);
router.put('/:id', authenticate, authorize('admin', 'club_head'), updateClub);
router.delete('/:id', authenticate, authorize('admin', 'club_head'), deleteClub);
router.post('/:id/join', authenticate, joinClub);
router.post('/:id/leave', authenticate, leaveClub);

export default router;
