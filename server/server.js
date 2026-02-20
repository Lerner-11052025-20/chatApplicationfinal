// console.log("Om Ganeshay Namah")
// app.get("/", (req, res) => {
//     res.send("Om Ganeshay Namah");
// });
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import userActionsRoutes from "./routes/user.routes.js";
import reportRoutes from "./routes/report.routes.js";
import { Server as socketIO } from "socket.io";
import jwt from "jsonwebtoken";
import http from "http";
import User from "./models/user.models.js";
import { Message } from "./models/message.models.js";
import { Chat } from "./models/chat.models.js";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// Track online users: Map<userId, socketId> or Map<userId, socketCount>
const onlineUsers = new Map();

const MONGO_URI = process.env.MONGO_URI;
mongoose
	.connect(MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of buffering indefinitely
		socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
	})
	.then(() => {
		console.log("MongoDB Connected Successfully");
	})
	.catch((err) => {
		console.error("MongoDB Connection Error Details:");
		console.error("Error Name:", err.name);
		console.error("Error Message:", err.message);
		if (err.reason) {
			console.error("Reason:", err.reason);
		}
		console.log("\nTIP: If you see 'ReplicaSetNoPrimary' or 'buffering timed out', please check your MongoDB Atlas 'Network Access' settings and ensure your current IP address is whitelisted.\n");
	});

app.use("/api", authRoutes);
app.use("/api", chatRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userActionsRoutes);
app.use("/api/report", reportRoutes);

const server = http.createServer(app);
const io = new socketIO(server, {
	cors: {
		origin: "*",
	},
});

// Socket authentication middleware using JWT
io.use((socket, next) => {
	const token = socket.handshake.auth?.token;
	if (!token) return next(new Error("Authentication error: token missing"));
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		socket.user = decoded;
		return next();
	} catch (err) {
		console.error("Socket auth error:", err.message);
		return next(new Error("Authentication error: token invalid"));
	}
});

io.on("connection", (socket) => {
	console.log("New client connected", socket.user?.id);

	// Join a personal room for direct notifications and mark messages as delivered
	if (socket.user && socket.user.id) {
		const userId = socket.user.id;
		socket.join(userId);

		// Presence Logic: Add to onlineUsers
		const existingCount = onlineUsers.get(userId) || 0;
		onlineUsers.set(userId, existingCount + 1);

		// Broadcast ONLY if this is the first session for this user
		if (existingCount === 0) {
			io.emit("userStatusChanged", { userId, status: "online" });
		}

		// Send the initial list of online users to the current socket
		socket.emit("onlineUsersList", Array.from(onlineUsers.keys()));

		// Implementation: Mark messages sent to this user as delivered
		// 1. Find all chats this user is in
		// 2. Find messages in those chats where status is 'sent' and sender is NOT this user
		(async () => {
			try {
				const userChats = await Chat.find({ users: socket.user.id });
				const chatIds = userChats.map(c => c._id);

				// Join all chat rooms for global events like typing
				chatIds.forEach(id => socket.join(id.toString()));

				const result = await Message.updateMany(
					{ chatId: { $in: chatIds }, sender: { $ne: socket.user.id }, status: "sent" },
					{ $set: { status: "delivered" } }
				);
				if (result.modifiedCount > 0) {
					// Notify relevant chat rooms about status update
					for (const chatId of chatIds) {
						io.to(chatId.toString()).emit("statusUpdated", { status: "delivered", chatId: chatId.toString() });
					}
				}
			} catch (err) {
				console.error("Error marking messages as delivered on connect:", err);
			}
		})();
	}

	socket.on("joinChat", (chatId) => {
		socket.join(chatId);
	});

	// Save message on server and broadcast to the chat room
	socket.on("sendMessage", async ({ chatId, content, parentMessageId }) => {
		try {
			// Find chat and check for blocking
			const chat = await Chat.findById(chatId).populate('users');
			if (!chat) return;

			const myId = socket.user.id;
			const isBlocked = chat.users.some(u =>
				u.blockedUsers.includes(myId) || u.blockedBy.includes(myId)
			);

			if (isBlocked) {
				return socket.emit("error", { message: "Action restricted: You have blocked this user or they have blocked you." });
			}

			const newMessage = new Message({
				chatId,
				sender: myId,
				content,
				parentMessage: parentMessageId,
				status: "sent",
			});
			const saved = await newMessage.save();

			const populatedMessage = await Message.findById(saved._id)
				.populate("sender", "username profilePic")
				.populate({
					path: "parentMessage",
					populate: { path: "sender", select: "username" }
				});

			// Update chat lastMessage
			chat.lastMessage = saved._id;
			await chat.save();

			// Broadcast to chat room
			io.to(chatId).emit("receiveMessage", populatedMessage);

			// Notify each participant for UI refresh
			chat.users.forEach(u => {
				io.to(u._id.toString()).emit("chatUpdated", {
					chatId: chat._id.toString(),
					lastMessage: populatedMessage,
					from: populatedMessage.sender,
				});
			});
		} catch (err) {
			console.error("SendMessage Error:", err);
		}
	});

	socket.on("updateStatus", async ({ messageIds, status, chatId }) => {
		try {
			await Message.updateMany(
				{ _id: { $in: messageIds } },
				{ $set: { status: status } }
			);
			io.to(chatId).emit("statusUpdated", { messageIds, status, chatId });
		} catch (err) {
			console.error("Error updating status:", err);
		}
	});

	socket.on("typing", ({ chatId }) => {
		socket.to(chatId).emit("typing", { chatId, userId: socket.user.id });
	});

	socket.on("stopTyping", ({ chatId }) => {
		socket.to(chatId).emit("stopTyping", { chatId, userId: socket.user.id });
	});

	socket.on("toggleReaction", async ({ messageId, emoji, chatId }) => {
		try {
			const msg = await Message.findById(messageId);
			if (!msg || msg.isDeleted) return;

			const userId = socket.user.id.toString();
			const existingIndex = (msg.reactions || []).findIndex(r => r.userId.toString() === userId);

			if (existingIndex !== -1) {
				if (msg.reactions[existingIndex].emoji === emoji) {
					msg.reactions.splice(existingIndex, 1);
				} else {
					msg.reactions[existingIndex].emoji = emoji;
					msg.reactions[existingIndex].reactedAt = new Date();
				}
			} else {
				if (!msg.reactions) msg.reactions = [];
				msg.reactions.push({ userId, emoji });
			}

			await msg.save();
			const updatedMsg = await Message.findById(messageId).populate("reactions.userId", "username");
			io.to(chatId).emit("reactionUpdated", { messageId, reactions: updatedMsg.reactions, chatId });
		} catch (err) {
			console.error("Error toggling reaction:", err);
		}
	});

	socket.on("editMessage", async ({ messageId, newContent, chatId }) => {
		try {
			const msg = await Message.findById(messageId);
			if (!msg) return;
			if (msg.sender.toString() !== socket.user.id) return;
			if (msg.isDeleted) return;

			// 15 minute limit check
			const now = new Date();
			const sentAt = new Date(msg.createdAt);
			const diffMin = (now - sentAt) / 60000;
			if (diffMin > 15) {
				return socket.emit("error", { message: "Edit limit (15m) exceeded" });
			}

			if (!msg.originalContent) msg.originalContent = msg.content;
			msg.content = newContent;
			msg.isEdited = true;
			msg.editedAt = now;
			await msg.save();

			io.to(chatId).emit("messageEdited", { messageId, newContent, chatId, editedAt: msg.editedAt });
		} catch (err) {
			console.error("Error editing message:", err);
		}
	});

	socket.on("deleteMessage", async ({ messageId, chatId, deleteType }) => {
		try {
			const msg = await Message.findById(messageId);
			if (!msg) return;

			if (deleteType === "everyone") {
				if (msg.sender.toString() !== socket.user.id) return;
				if (msg.isDeleted) return;

				// 15 minute limit check
				const now = new Date();
				const sentAt = new Date(msg.createdAt);
				const diffMin = (now - sentAt) / 60000;
				if (diffMin > 15) {
					return socket.emit("error", { message: "Delete limit (15m) exceeded" });
				}

				if (!msg.originalContent) msg.originalContent = msg.content;
				msg.content = "This message was deleted";
				msg.isDeleted = true;
				msg.deletedAt = now;
				await msg.save();

				io.to(chatId).emit("messageDeleted", { messageId, chatId, isDeleted: true });
			} else {
				// Delete for Me
				if (!msg.deletedFor.includes(socket.user.id)) {
					msg.deletedFor.push(socket.user.id);
					await msg.save();
				}
				socket.emit("messageDeleted", { messageId, chatId, isDeletedForMe: true });
			}
		} catch (err) {
			console.error("Error deleting message:", err);
		}
	});


	socket.on("pinMessage", async ({ messageId, chatId }) => {
		try {
			const msg = await Message.findById(messageId);
			if (!msg || msg.isDeleted) return;

			msg.isPinned = true;
			msg.pinnedBy = socket.user.id;
			msg.pinnedAt = new Date();
			await msg.save();

			// Add to chat's pinnedMessages if not already there
			await Chat.findByIdAndUpdate(chatId, {
				$addToSet: { pinnedMessages: messageId }
			});

			const populatedMsg = await Message.findById(messageId)
				.populate("sender", "username profilePic")
				.populate("pinnedBy", "username");

			io.to(chatId).emit("messagePinned", { chatId, message: populatedMsg });
		} catch (err) {
			console.error("Error pinning message:", err);
		}
	});

	socket.on("unpinMessage", async ({ messageId, chatId }) => {
		try {
			const msg = await Message.findById(messageId);
			if (!msg) return;

			msg.isPinned = false;
			msg.pinnedBy = undefined;
			msg.pinnedAt = undefined;
			await msg.save();

			// Remove from chat's pinnedMessages
			await Chat.findByIdAndUpdate(chatId, {
				$pull: { pinnedMessages: messageId }
			});

			io.to(chatId).emit("messageUnpinned", { chatId, messageId });
		} catch (err) {
			console.error("Error unpinning message:", err);
		}
	});


	socket.on("disconnect", async () => {
		console.log("Client disconnected", socket.user?.id);
		if (socket.user && socket.user.id) {
			const userId = socket.user.id;
			const remainingCount = (onlineUsers.get(userId) || 1) - 1;

			if (remainingCount <= 0) {
				onlineUsers.delete(userId);
				const lastSeen = new Date();

				try {
					await User.findByIdAndUpdate(userId, { lastSeen });
					io.emit("userStatusChanged", { userId, status: "offline", lastSeen });
				} catch (err) {
					console.error("Error updating lastSeen on disconnect:", err);
					io.emit("userStatusChanged", { userId, status: "offline" });
				}
			} else {
				onlineUsers.set(userId, remainingCount);
			}
		}
	});
});

// End of Socket.io logic

const PORT = process.env.PORT;
server.listen(PORT, () =>
	console.log(`Server running on port http://localhost:${PORT}`)
);
