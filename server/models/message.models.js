import express from "express";
import mongoose from "mongoose";
const messageSchema = new mongoose.Schema(
	{
		chatId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Chat",
		},
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		content: String,
		status: {
			type: String,
			enum: ["sent", "delivered", "seen"],
			default: "sent",
		},
		isEdited: {
			type: Boolean,
			default: false,
		},
		editedAt: Date,
		originalContent: String,
		isDeleted: {
			type: Boolean,
			default: false,
		},
		deletedAt: Date,
		deletedFor: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
		reactions: [
			{
				userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
				emoji: String,
				reactedAt: { type: Date, default: Date.now },
			},
		],
		parentMessage: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Message",
		},
		isPinned: {
			type: Boolean,
			default: false,
		},
		pinnedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		pinnedAt: {
			type: Date,
		},
	},
	{ timestamps: true }
);
export const Message = mongoose.model("Message", messageSchema);
