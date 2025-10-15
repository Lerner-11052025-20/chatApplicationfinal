import express from "express";
import { Message } from "../models/message.models.js";
const recieveMessage = async (req, res) => {
	const messages = await Message.find({
		chatId: req.params.chatId,
	}).populate("sender");
	res.json(messages);
};
export { recieveMessage };
