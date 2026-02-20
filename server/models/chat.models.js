import mongoose from "mongoose";
const chatSchema = new mongoose.Schema(
	{
		users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
		lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message", default: null },
		pinnedMessages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
	},
	{ timestamps: true }
);
export const Chat = mongoose.model("Chat", chatSchema);
