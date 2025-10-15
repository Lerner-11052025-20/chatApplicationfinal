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
import {Server as socketIO} from "socket.io";
import http from "http";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const MONGO_URI = process.env.MONGO_URI;
mongoose
	.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log("MongoDB Connected");
	})
	.catch((err) => console.log(err));

app.use("/api", authRoutes);
app.use("/api", chatRoutes);

const server = http.createServer(app);
const io = new socketIO(server, {
	cors: {
		origin: "*",
	},
});

io.on("connection", (socket) => {
	console.log("New client connected");

	socket.on("joinChat", (chatId) => {
		socket.join(chatId);
	});

	socket.on("sendMessage", (message) => {
		io.to(message.chatId).emit("receiveMessage", message);
	});

	socket.on("disconnect", () => {
		console.log("Client disconnected");
	});
});

const PORT = process.env.PORT;
server.listen(process.env.PORT, () =>
	console.log(`Server running on port http://localhost:${PORT}`)
);
