import User from '../models/user.models.js';
import { AuditLog } from '../models/auditLog.models.js';

export const blockUser = async (req, res) => {
    try {
        const { targetUserId } = req.body;
        const myId = req.user.id;

        if (myId === targetUserId) {
            return res.status(400).json({ message: "You cannot block yourself" });
        }

        const user = await User.findById(myId);
        const target = await User.findById(targetUserId);

        if (!target) return res.status(404).json({ message: "User not found" });

        if (user.blockedUsers.includes(targetUserId)) {
            return res.status(400).json({ message: "User already blocked" });
        }

        // Add to my blocked list
        user.blockedUsers.push(targetUserId);
        await user.save();

        // Add me to their blockedBy list
        target.blockedBy.push(myId);
        await target.save();

        await AuditLog.create({
            action: 'BLOCK_USER',
            admin: myId, // In this system, 'admin' field in AuditLog might be used for 'initiator'
            targetUser: targetUserId,
            meta: { initiator: myId }
        });

        res.json({ message: "User blocked successfully", blockedUsers: user.blockedUsers });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error during blocking" });
    }
};

export const unblockUser = async (req, res) => {
    try {
        const { targetUserId } = req.body;
        const myId = req.user.id;

        const user = await User.findById(myId);
        const target = await User.findById(targetUserId);

        if (!target) return res.status(404).json({ message: "User not found" });

        user.blockedUsers = user.blockedUsers.filter(id => id.toString() !== targetUserId);
        await user.save();

        target.blockedBy = target.blockedBy.filter(id => id.toString() !== myId);
        await target.save();

        res.json({ message: "User unblocked successfully", blockedUsers: user.blockedUsers });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error during unblocking" });
    }
};

export const getBlockedUsers = async (req, res) => {
    try {
        console.log("Fetching blocked users for ID:", req.user.id);
        const user = await User.findById(req.user.id).populate('blockedUsers', 'username email profilePic');
        if (!user) {
            console.log("User not found in DB for ID:", req.user.id);
            return res.status(404).json({ message: "User not found" });
        }
        console.log(`Found ${user.blockedUsers?.length || 0} blocked users`);
        res.json({ blockedUsers: user.blockedUsers || [] });
    } catch (err) {
        console.error("DEBUG ERROR in getBlockedUsers:", err);
        res.status(500).json({ message: "Server error fetching blocked users" });
    }
};

export const getActivityLogs = async (req, res) => {
    try {
        const myId = req.user.id;
        const user = await User.findById(myId);

        let query = {};
        if (user.role !== 'admin') {
            // Regular users see actions they performed or actions done to them
            query = {
                $or: [
                    { admin: myId },
                    { targetUser: myId }
                ]
            };
        }

        const logs = await AuditLog.find(query)
            .populate('admin', 'username profilePic')
            .populate('targetUser', 'username email profilePic')
            .sort({ createdAt: -1 })
            .limit(50);

        res.json({ logs });
    } catch (err) {
        console.error("getActivityLogs error:", err);
        res.status(500).json({ message: "Server error fetching activity logs" });
    }
};
