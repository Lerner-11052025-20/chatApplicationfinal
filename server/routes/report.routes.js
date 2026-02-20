import express from 'express';
import { reportUser, getMyReports } from '../controllers/report.controllers.js';
import { Authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(Authenticate);

router.post('/', reportUser);
router.get('/', getMyReports);

export default router;
