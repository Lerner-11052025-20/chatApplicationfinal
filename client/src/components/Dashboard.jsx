import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import io from "socket.io-client";
import ChatWindow from "./ChatWindow";
import { jwtDecode } from "jwt-decode";
// Removed MUI in favor of custom theme classes

const socket = io("http://localhost:3334");

function Dashboard() {
	const [user, setUser] = useState(null);
	const [userList, setUserList] = useState([]);
	const [chats, setChats] = useState([]);
	const [selectedChat, setSelectedChat] = useState(null);
	const [messages, setMessages] = useState([]);
	const [activeUserId, setActiveUserId] = useState(null); // for highlighting
	const navigate = useNavigate();

	const logOut = () => {
		localStorage.removeItem("token");
		navigate("/login");
	};

	useEffect(() => {
		const fetchData = async () => {
			const token = localStorage.getItem("token");
			if (!token) return alert("Unauthorized!");

			try {
				const decoded = jwtDecode(token);
				const details = {
					_id: decoded.id,
					username: decoded.username,
					email: decoded.email,
				};
				setUser(details);
			} catch (err) {
				alert("Invalid token");
			}
		};
		fetchData();
	}, []);

	const fetchUser = async () => {
		if (!user) return;
		try {
			const token = localStorage.getItem("token");
			const res = await axios.get("http://localhost:3334/api/users", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setUserList(res.data.users);
		} catch (error) {
			console.log(error);
		}
	};

	const getChats = async (id) => {
		setActiveUserId(id); // highlight selected user
		const token = localStorage.getItem("token");
		try {
			const res = await axios.get(`http://localhost:3334/api/chats/${id}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setSelectedChat(res.data.chat);
			setChats(res.data.chats); // optional, not used anymore
		} catch (err) {
			console.error("Failed to fetch chats:", err);
		}
	};

	useEffect(() => {
		if (!selectedChat) return;
		socket.emit("joinChat", selectedChat._id);

		const token = localStorage.getItem("token");
		axios
			.get(`http://localhost:3334/api/messages/${selectedChat._id}`, {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then((res) => setMessages(res.data))
			.catch((err) => console.error("Failed to fetch messages:", err));
	}, [selectedChat]);

	useEffect(() => {
		socket.on("receiveMessage", (msg) => {
			setMessages((prev) =>
				prev.find((m) => m._id === msg._id) ? prev : [...prev, msg]
			);
		});
		return () => socket.off("receiveMessage");
	}, []);

	const sendMessage = async (text) => {
		if (!selectedChat || !user) return;
		const token = localStorage.getItem("token");
		const newMsg = {
			chatId: selectedChat._id,
			sender: user._id,
			content: text,
		};
		try {
			const res = await axios.post(
				"http://localhost:3334/api/messages",
				newMsg,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			socket.emit("sendMessage", res.data);
		} catch (err) {
			console.error("Failed to send message:", err);
		}
	};

    if (!user) return <p className="muted" style={{padding:16}}>Loading...</p>;

	return (
        <div className="container">
            <div className="header">
                <div>
                    <h2 className="title" style={{marginBottom:4}}>Welcome, {user.username}!</h2>
                    <div className="muted">{user.email}</div>
                </div>
                <div className="btn-group">
                    <button className="btn btn-ghost" onClick={fetchUser}>Refresh users</button>
                    <button className="btn btn-danger" onClick={logOut}>Log out</button>
                </div>
            </div>

            <div className="shell">
                <aside className="sidebar">
                    <h3 style={{marginTop:0}}>Start chat</h3>
                    <ul className="list">
                        {userList.map((userr) => (
                            <li
                                key={userr._id}
                                onClick={() => getChats(userr._id)}
                                className={`list-item${activeUserId === userr._id ? ' active' : ''}`}
                            >
                                {userr.username}
                            </li>
                        ))}
                    </ul>
                </aside>

                <main className="content">
                    {!selectedChat ? (
                        <div className="muted">Select a user to start chatting.</div>
                    ) : (
                        <ChatWindow
                            messages={messages}
                            onSend={sendMessage}
                            currentUser={user}
                        />
                    )}
                </main>
            </div>
        </div>
	);
}

export default Dashboard;
