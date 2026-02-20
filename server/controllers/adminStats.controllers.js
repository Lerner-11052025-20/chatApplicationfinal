import User from '../models/user.models.js';
import { Message } from '../models/message.models.js';
import { Chat } from '../models/chat.models.js';

// ─── Overview Stats ─────────────────────────────────────────────────────────
export const getAdminStats = async (req, res) => {
    try {
        const now = new Date();
        const last24h = new Date(now - 24 * 60 * 60 * 1000);
        const todayStart = new Date(now.setHours(0, 0, 0, 0));

        const [
            totalUsers,
            activeUsers,
            bannedUsers,
            verifiedUsers,
            totalMessages,
            messagesToday,
            totalChats,
        ] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ lastSeen: { $gte: last24h } }),
            User.countDocuments({ isBanned: true }),
            User.countDocuments({ isVerified: true }),
            Message.countDocuments({ isDeleted: false }),
            Message.countDocuments({ createdAt: { $gte: todayStart }, isDeleted: false }),
            Chat.countDocuments(),
        ]);

        res.json({
            totalUsers,
            activeUsers,
            bannedUsers,
            verifiedUsers,
            totalMessages,
            messagesToday,
            totalChats,
        });
    } catch (err) {
        console.error('getAdminStats error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// ─── Messages per Day (last 14 days) ────────────────────────────────────────
export const getMessagesPerDay = async (req, res) => {
    try {
        const days = 14;
        const result = [];
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dayStart = new Date(date.setHours(0, 0, 0, 0));
            const dayEnd = new Date(date.setHours(23, 59, 59, 999));
            const count = await Message.countDocuments({
                createdAt: { $gte: dayStart, $lte: dayEnd },
                isDeleted: false,
            });
            result.push({
                date: dayStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                messages: count,
            });
        }
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// ─── New Users per Week (last 8 weeks) ──────────────────────────────────────
export const getNewUsersPerWeek = async (req, res) => {
    try {
        const weeks = 8;
        const result = [];
        for (let i = weeks - 1; i >= 0; i--) {
            const weekEnd = new Date();
            weekEnd.setDate(weekEnd.getDate() - i * 7);
            const weekStart = new Date(weekEnd);
            weekStart.setDate(weekStart.getDate() - 7);
            const count = await User.countDocuments({
                createdAt: { $gte: weekStart, $lte: weekEnd },
            });
            result.push({
                week: `W${weeks - i}`,
                users: count,
            });
        }
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// ─── Most Active Users ───────────────────────────────────────────────────────
export const getMostActiveUsers = async (req, res) => {
    try {
        const agg = await Message.aggregate([
            { $match: { isDeleted: false } },
            { $group: { _id: '$sender', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
            { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
            { $unwind: '$user' },
            { $project: { username: '$user.username', email: '$user.email', count: 1 } },
        ]);
        res.json(agg);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// ─── Hour Heatmap (messages by hour of day) ─────────────────────────────────
export const getHourHeatmap = async (req, res) => {
    try {
        const agg = await Message.aggregate([
            { $match: { isDeleted: false } },
            { $project: { hour: { $hour: '$createdAt' }, dayOfWeek: { $dayOfWeek: '$createdAt' } } },
            { $group: { _id: { hour: '$hour', day: '$dayOfWeek' }, count: { $sum: 1 } } },
        ]);
        res.json(agg);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
