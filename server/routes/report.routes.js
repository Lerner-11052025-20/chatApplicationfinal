import express from 'express';
import { reportUser } from '../controllers/report.controllers.js';
import { Authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(Authenticate);

router.post('/', reportUser);

export default router;
