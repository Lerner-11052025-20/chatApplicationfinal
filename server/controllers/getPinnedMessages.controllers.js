import { Message } from "../models/message.models.js";

export const getPinnedMessages = async (req, res) => {
    try {
        const { chatId } = req.params;
        const pinned = await Message.find({ chatId, isPinned: true })
            .populate("sender", "username profilePic")
            .populate("pinnedBy", "username")
            .sort({ pinnedAt: -1 });
        res.json(pinned);
    } catch (err) {
        console.error("getPinnedMessages error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
