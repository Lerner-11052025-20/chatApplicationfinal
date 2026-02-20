import express from "express";
import { Message } from "../models/message.models.js";
const recieveMessage = async (req, res) => {
	const messages = await Message.find({
		chatId: req.params.chatId,
		deletedFor: { $ne: req.user.id }
	})
		.populate("sender", "username profilePic")
		.populate("reactions.userId", "username")
		.populate({
			path: "parentMessage",
			populate: { path: "sender", select: "username" }
		});
	res.json(messages);
};
export { recieveMessage };
