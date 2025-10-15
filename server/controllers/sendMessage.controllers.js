import express from "express";
import { Message } from "../models/message.models.js";
const sendMesssage = async (req, res) => {
	const message = new Message(req.body);
	await message.save();
	res.json(message);
};
export { sendMesssage };
