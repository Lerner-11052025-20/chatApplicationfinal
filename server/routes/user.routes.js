import express from 'express';
import { blockUser, unblockUser, getBlockedUsers } from '../controllers/userBlock.controllers.js';
import { Authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(Authenticate);

router.post('/block', blockUser);
router.post('/unblock', unblockUser);
router.get('/blocked', getBlockedUsers);

export default router;
