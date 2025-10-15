import mongoose from "mongoose";
import { Chat } from "../models/chat.models.js";

const getChats = async (req, res) => {
	try {
		const myId = req.user.id;
		// console.log(myId);
		const { userId: userToChatWith } = req.params;
		// console.log(userToChatWith);
		// console.log(userId)
		let chat = await Chat.findOne({
			users: { $all: [myId, userToChatWith] },
		});
		if (!chat) {
			chat = new Chat({ users: [myId, userToChatWith] });
			await chat.save();
		}

		const chats = await Chat.find({ users: userToChatWith }).populate(
			"users"
		);
		console.log(chat);
		console.log(chats);
		res.status(201).json({ chat, chats });
	} catch (error) {
		console.error("Error in getChats:", error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export { getChats };

// const myId = req.user.id;
// 		console.log(myId);
// 		const { userId: userToChatWith } = req.params;
// 		console.log(userToChatWith);
// 		// console.log(userId)
// 		let chat = await Chat.findOne({
// 			users: { $all: [myId, userToChatWith] },
// 		});
// 		if (!chat) {
// 			chat = new Chat({ users: [myId, userToChatWith] });
// 			await chat.save();
// 		}
//     console.log(chat)
