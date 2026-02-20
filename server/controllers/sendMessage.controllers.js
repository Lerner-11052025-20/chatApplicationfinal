import express from "express";
import { Message } from "../models/message.models.js";
import { Chat } from "../models/chat.models.js";
const sendMesssage = async (req, res) => {
	try {
		const { chatId, content, parentMessageId } = req.body;
		const sender = req.user?.id || req.body.sender;

		// Check for block
		const chat = await Chat.findById(chatId).populate('users');
		if (chat) {
			const isBlocked = chat.users.some(u =>
				u.blockedUsers.includes(sender) || u.blockedBy.includes(sender)
			);
			if (isBlocked) {
				return res.status(403).json({ message: "You cannot message this user" });
			}
		}

		const message = new Message({ chatId, sender, content, parentMessage: parentMessageId });
		const saved = await message.save();
		// update chat lastMessage pointer
		try {
			await Chat.findByIdAndUpdate(chatId, { $set: { lastMessage: saved._id } });
		} catch (e) {
			console.warn("Failed to update chat lastMessage:", e.message);
		}
		return res.json(saved);
	} catch (err) {
		console.error("sendMessage controller error:", err);
		return res.status(500).json({ message: "Failed to send message" });
	}
};
export { sendMesssage };
