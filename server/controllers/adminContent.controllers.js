import { Message } from '../models/message.models.js';
import { AuditLog } from '../models/auditLog.models.js';

// ─── List Messages (all, filterable) ─────────────────────────────────────────
export const listMessages = async (req, res) => {
    try {
        const { filter = 'all', page = 1, limit = 30 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);

        const query = {};
        if (filter === 'pinned') query.isPinned = true;
        if (filter === 'deleted') query.isDeleted = true;

        const [messages, total] = await Promise.all([
            Message.find(query)
                .populate('sender', 'username email')
                .populate('chatId', '_id')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            Message.countDocuments(query),
        ]);

        res.json({ messages, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
    } catch (err) {
        console.error('listMessages error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// ─── Delete Message (mark as deleted) ────────────────────────────────────────
export const adminDeleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const msg = await Message.findById(id);
        if (!msg) return res.status(404).json({ message: 'Message not found' });

        msg.isDeleted = true;
        msg.content = '[Removed by admin]';
        msg.deletedAt = new Date();
        await msg.save();

        await AuditLog.create({
            action: 'DELETE_MESSAGE',
            admin: req.user.id,
            targetMessage: id,
            targetUser: msg.sender,
        });

        res.json({ message: 'Message deleted' });
    } catch (err) {
        console.error('adminDeleteMessage error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
