import User from '../models/user.models.js';
import { AuditLog } from '../models/auditLog.models.js';
import Report from '../models/report.models.js';

// ─── List Users (paginated, searchable, filterable) ──────────────────────────
export const listUsers = async (req, res) => {
    try {
        const { search = '', filter = 'all', page = 1, limit = 20 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);

        const query = { _id: { $ne: req.user.id } };
        if (search) query.$or = [
            { username: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
        ];
        if (filter === 'banned') query.isBanned = true;
        if (filter === 'active') query.isBanned = false;
        if (filter === 'verified') query.isVerified = true;

        const [users, total] = await Promise.all([
            User.find(query)
                .select('-password')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            User.countDocuments(query),
        ]);

        res.json({ users, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
    } catch (err) {
        console.error('listUsers error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// ─── Ban / Unban User ────────────────────────────────────────────────────────
export const toggleBanUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason = '' } = req.body;
        if (String(id) === String(req.user.id)) {
            return res.status(400).json({ message: 'Cannot ban yourself' });
        }

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const newBanState = !user.isBanned;
        user.isBanned = newBanState;
        user.bannedAt = newBanState ? new Date() : undefined;
        user.bannedReason = newBanState ? reason : undefined;
        await user.save();

        await AuditLog.create({
            action: newBanState ? 'BAN_USER' : 'UNBAN_USER',
            admin: req.user.id,
            targetUser: id,
            meta: { reason },
        });

        res.json({ message: `User ${newBanState ? 'banned' : 'unbanned'} successfully`, isBanned: newBanState });
    } catch (err) {
        console.error('toggleBanUser error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// ─── Delete User ─────────────────────────────────────────────────────────────
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        if (String(id) === String(req.user.id)) {
            return res.status(400).json({ message: 'Cannot delete yourself' });
        }
        const user = await User.findByIdAndDelete(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        await AuditLog.create({
            action: 'DELETE_USER',
            admin: req.user.id,
            targetUser: id,
        });

        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('deleteUser error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// ─── Audit Log ───────────────────────────────────────────────────────────────
export const getAuditLog = async (req, res) => {
    try {
        const { page = 1, limit = 30 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);

        const [logs, total] = await Promise.all([
            AuditLog.find()
                .populate('admin', 'username')
                .populate('targetUser', 'username email')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            AuditLog.countDocuments(),
        ]);

        res.json({ logs, total });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// ─── Verify User (toggle blue badge) ─────────────────────────────────────────
export const toggleVerifyUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const newState = !user.isVerified;
        user.isVerified = newState;
        user.verifiedAt = newState ? new Date() : undefined;
        await user.save();

        await AuditLog.create({
            action: newState ? 'VERIFY_USER' : 'UNVERIFY_USER',
            admin: req.user.id,
            targetUser: id,
        });

        res.json({ message: `User ${newState ? 'verified' : 'unverified'} successfully`, isVerified: newState });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// ─── Get Reports ─────────────────────────────────────────────────────────────
export const getReports = async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);

        const [reports, total] = await Promise.all([
            Report.find()
                .populate('reporter', 'username email')
                .populate('reportedUser', 'username email isBanned')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            Report.countDocuments(),
        ]);

        res.json({ reports, total });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
