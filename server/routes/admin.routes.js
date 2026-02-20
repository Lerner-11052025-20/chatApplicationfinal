import express from 'express';
import { Authenticate, AdminOnly } from '../middleware/auth.middleware.js';
import {
    getAdminStats,
    getMessagesPerDay,
    getNewUsersPerWeek,
    getMostActiveUsers,
    getHourHeatmap,
} from '../controllers/adminStats.controllers.js';
import {
    listUsers,
    toggleBanUser,
    deleteUser,
    getAuditLog,
    toggleVerifyUser,
    getReports,
} from '../controllers/adminUsers.controllers.js';
import {
    listMessages,
    adminDeleteMessage,
} from '../controllers/adminContent.controllers.js';

const router = express.Router();

// All admin routes require JWT auth + admin role
router.use(Authenticate, AdminOnly);

// ── Stats & Analytics ────────────────────────────────────────────────────────
router.get('/stats', getAdminStats);
router.get('/analytics/messages-per-day', getMessagesPerDay);
router.get('/analytics/users-per-week', getNewUsersPerWeek);
router.get('/analytics/most-active-users', getMostActiveUsers);
router.get('/analytics/heatmap', getHourHeatmap);

// ── User Management ──────────────────────────────────────────────────────────
router.get('/users', listUsers);
router.put('/users/:id/ban', toggleBanUser);
router.put('/users/:id/verify', toggleVerifyUser);
router.delete('/users/:id', deleteUser);

// ── Content Moderation ───────────────────────────────────────────────────────
router.get('/messages', listMessages);
router.delete('/messages/:id', adminDeleteMessage);
router.get('/reports', getReports);

// ── Audit Log ────────────────────────────────────────────────────────────────
router.get('/audit', getAuditLog);

export default router;
