import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";
import ChatWindow from "./ChatWindow";
import { API_URL, SOCKET_URL } from "../config/api";


function parseJwt(token) {
	if (!token) return null;
	try {
		const base64Url = token.split('.')[1];
		const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		const jsonPayload = decodeURIComponent(
			atob(base64)
				.split('')
				.map(function (c) {
					return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
				})
				.join('')
		);
		return JSON.parse(jsonPayload);
	} catch (e) {
		return null;
	}
}
import { motion, AnimatePresence } from "framer-motion";
import {
	LogOut,
	RefreshCw,
	Search,
	MessageCircle,
	User,
	Settings,
	ChevronLeft,
	Edit,
	Loader2
} from "lucide-react";

function Dashboard() {
	const [user, setUser] = useState(null);
	const [userList, setUserList] = useState([]);
	const [selectedChat, setSelectedChat] = useState(null);
	const [messages, setMessages] = useState([]);
	const [activeUserId, setActiveUserId] = useState(null);
	const [typingUsers, setTypingUsers] = useState({});
	const [searchQuery, setSearchQuery] = useState("");
	const [mobileShowChat, setMobileShowChat] = useState(false);
	const [onlineUserIds, setOnlineUserIds] = useState([]);
	const [pinnedMessages, setPinnedMessages] = useState([]);
	const navigate = useNavigate();

	const socketRef = useRef(null);

	const logOut = () => {
		localStorage.removeItem("token");
		navigate("/login");
	};

	useEffect(() => {
		const fetchData = async () => {
			const token = localStorage.getItem("token");
			if (!token) return navigate("/login");

			try {
				const decoded = parseJwt(token);
				setUser({
					_id: decoded.id,
					username: decoded.username,
					email: decoded.email,
				});
				const socket = io(SOCKET_URL, { auth: { token } });
				socketRef.current = socket;
				socket.on("connect", () => {
					if (socketRef.current && decoded.id) socketRef.current.emit("joinChat", decoded.id);
				});
			} catch (err) {
				navigate("/login");
			}
		};

		fetchData();

		return () => {
			if (socketRef.current) {
				socketRef.current.disconnect();
				socketRef.current = null;
			}
		};
	}, [navigate]);

	const fetchUser = async () => {
		if (!user) return;
		try {
			const token = localStorage.getItem("token");
			const res = await axios.get(`${API_URL}/api/users`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setUserList(res.data.users.map(u => ({
				...u,
				hasNew: false,
				lastMessage: null,
				isOnline: onlineUserIds.some(id => String(id) === String(u._id))
			})));
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		if (user) fetchUser();
	}, [user]);

	const getChats = async (id) => {
		setActiveUserId(id);
		setUserList(prev => prev.map(u => u._id === id ? { ...u, hasNew: false } : u));
		const token = localStorage.getItem("token");
		try {
			const res = await axios.get(`${API_URL}/api/chats/${id}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setSelectedChat(res.data.chat);
			setMobileShowChat(true);
		} catch (err) {
			console.error("Failed to fetch chats:", err);
		}
	};

	useEffect(() => {
		const socket = socketRef.current;
		if (!socket) return;

		const handleChatUpdated = ({ chatId, lastMessage, from }) => {
			const otherId = (from && from !== user?._id) ? from : activeUserId;
			if (!otherId) return;

			setUserList(prev => {
				const updated = prev.map(u => u._id === otherId ? { ...u, lastMessage, hasNew: (from !== user?._id) } : u);
				const foundIndex = updated.findIndex(u => u._id === otherId);
				if (foundIndex > 0) {
					const [item] = updated.splice(foundIndex, 1);
					return [item, ...updated];
				}
				return updated;
			});

			if (selectedChat && selectedChat._id === chatId) {
				setMessages(prev => (prev.find(m => m._id === lastMessage._id) ? prev : [...prev, lastMessage]));
			}
		};

		socket.on('chatUpdated', handleChatUpdated);

		socket.on('error', (err) => {
			alert(err.message);
		});

		return () => {
			socket.off('chatUpdated', handleChatUpdated);
			socket.off('error');
		};

		return () => {
			socket.off('chatUpdated', handleChatUpdated);
		};
	}, [user, activeUserId, selectedChat]);

	useEffect(() => {
		if (!selectedChat) return;
		const socket = socketRef.current;
		if (socket) socket.emit("joinChat", selectedChat._id);

		const token = localStorage.getItem("token");

		// Fetch messages
		axios
			.get(`${API_URL}/api/messages/${selectedChat._id}`, {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then((res) => setMessages(res.data))
			.catch((err) => console.error("Failed to fetch messages:", err));

		// Fetch pinned messages for this chat
		axios
			.get(`${API_URL}/api/pinned/${selectedChat._id}`, {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then((res) => setPinnedMessages(res.data))
			.catch((err) => console.error("Failed to fetch pinned messages:", err));
	}, [selectedChat]);

	useEffect(() => {
		const socket = socketRef.current;
		if (!socket) return;

		const handleReceive = (msg) => {
			setMessages((prev) => (prev.find((m) => m._id === msg._id) ? prev : [...prev, msg]));

			const senderId = msg.sender?._id || msg.sender;
			const isVisible = document.visibilityState === 'visible';
			const isSameChat = selectedChat && selectedChat._id === msg.chatId;

			if (user && senderId !== user._id) {
				// Mark as seen/delivered
				socket.emit("updateStatus", {
					messageIds: [msg._id],
					status: isSameChat ? "seen" : "delivered",
					chatId: msg.chatId,
				});

				// No sound/toast logic
			}
		};

		const handleStatus = ({ messageIds, status, chatId }) => {
			if (selectedChat && selectedChat._id === chatId) {
				setMessages((prev) => prev.map((m) => (messageIds.includes(m._id) ? { ...m, status } : m)));
			}
		};

		const handleOnlineUsersList = (ids) => {
			setOnlineUserIds(ids);
			setUserList(prev => prev.map(u => ({ ...u, isOnline: ids.some(id => String(id) === String(u._id)) })));
		};

		const handleUserStatusChanged = ({ userId, status, lastSeen }) => {
			setOnlineUserIds(prev => {
				if (status === "online") {
					return prev.some(id => String(id) === String(userId)) ? prev : [...prev, userId];
				} else {
					return prev.filter(id => String(id) !== String(userId));
				}
			});
			setUserList(prev => prev.map(u => String(u._id) === String(userId) ? { ...u, isOnline: status === "online", lastSeen: status === "offline" ? lastSeen : u.lastSeen } : u));
		};

		const handleTyping = ({ chatId, userId }) => {
			if (userId === user?._id) return;
			setTypingUsers(prev => ({
				...prev,
				[chatId]: [...(prev[chatId] || []).filter(id => id !== userId), userId]
			}));
		};

		const handleStopTyping = ({ chatId, userId }) => {
			setTypingUsers(prev => ({
				...prev,
				[chatId]: (prev[chatId] || []).filter(id => id !== userId)
			}));
		};

		const handleMessageEdited = ({ messageId, newContent, chatId, editedAt }) => {
			if (selectedChat && selectedChat._id === chatId) {
				setMessages(prev => prev.map(m => m._id === messageId ? { ...m, content: newContent, isEdited: true, editedAt } : m));
			}
		};

		const handleMessageDeleted = ({ messageId, chatId, isDeleted, isDeletedForMe }) => {
			if (selectedChat && selectedChat._id === chatId) {
				if (isDeleted) {
					// Delete for Everyone
					setMessages(prev => prev.map(m => m._id === messageId ? { ...m, content: "This message was deleted", isDeleted: true } : m));
				} else if (isDeletedForMe) {
					// Delete for Me
					setMessages(prev => prev.filter(m => m._id !== messageId));
				}
			}
		};

		const handleReactionUpdated = ({ messageId, reactions, chatId }) => {
			if (selectedChat && selectedChat._id === chatId) {
				setMessages(prev => prev.map(m => m._id === messageId ? { ...m, reactions } : m));
			}
		};

		const handleMessagePinned = ({ chatId, message }) => {
			if (selectedChat && selectedChat._id === chatId) {
				// Update the message in the list to mark isPinned
				setMessages(prev => prev.map(m => m._id === message._id ? { ...m, isPinned: true, pinnedBy: message.pinnedBy, pinnedAt: message.pinnedAt } : m));
				// Add to pinnedMessages (deduplicated)
				setPinnedMessages(prev => [message, ...prev.filter(p => String(p._id) !== String(message._id))]);
			}
		};

		const handleMessageUnpinned = ({ chatId, messageId }) => {
			if (selectedChat && selectedChat._id === chatId) {
				setMessages(prev => prev.map(m => String(m._id) === String(messageId) ? { ...m, isPinned: false, pinnedBy: null, pinnedAt: null } : m));
				setPinnedMessages(prev => prev.filter(p => String(p._id) !== String(messageId)));
			}
		};

		socket.on("receiveMessage", handleReceive);
		socket.on("statusUpdated", handleStatus);
		socket.on("onlineUsersList", handleOnlineUsersList);
		socket.on("userStatusChanged", handleUserStatusChanged);
		socket.on("typing", handleTyping);
		socket.on("stopTyping", handleStopTyping);
		socket.on("messageEdited", handleMessageEdited);
		socket.on("messageDeleted", handleMessageDeleted);
		socket.on("reactionUpdated", handleReactionUpdated);
		socket.on("messagePinned", handleMessagePinned);
		socket.on("messageUnpinned", handleMessageUnpinned);

		return () => {
			socket.off("receiveMessage", handleReceive);
			socket.off("statusUpdated", handleStatus);
			socket.off("onlineUsersList", handleOnlineUsersList);
			socket.off("userStatusChanged", handleUserStatusChanged);
			socket.off("typing", handleTyping);
			socket.off("stopTyping", handleStopTyping);
			socket.off("messageEdited", handleMessageEdited);
			socket.off("messageDeleted", handleMessageDeleted);
			socket.off("reactionUpdated", handleReactionUpdated);
			socket.off("messagePinned", handleMessagePinned);
			socket.off("messageUnpinned", handleMessageUnpinned);
		};
	}, [user, selectedChat]);

	useEffect(() => {
		if (selectedChat && messages.length > 0 && socketRef.current) {
			const unseenMessageIds = messages.filter((m) => m.sender !== user._id && m.status !== "seen").map((m) => m._id);

			if (unseenMessageIds.length > 0) {
				socketRef.current.emit("updateStatus", {
					messageIds: unseenMessageIds,
					status: "seen",
					chatId: selectedChat._id,
				});
			}
		}
	}, [selectedChat, messages, user]);

	const handleSendMessage = (content, parentMessageId) => {
		if (socketRef.current) {
			socketRef.current.emit("sendMessage", { chatId: selectedChat._id, content, parentMessageId });
		}
	};

	const handleBlock = async (targetId) => {
		try {
			const token = localStorage.getItem("token");
			const res = await axios.post(`${API_URL}/api/user/block`, { targetUserId: targetId }, {
				headers: { Authorization: `Bearer ${token}` }
			});
			// Update local state
			setUserList(prev => prev.filter(u => u._id !== targetId));
			setSelectedChat(null);
			setMobileShowChat(false);
			alert("User blocked successfully");
		} catch (err) {
			alert(err.response?.data?.message || "Failed to block user");
		}
	};

	const handleUnblock = async (targetId) => {
		try {
			const token = localStorage.getItem("token");
			await axios.post(`${API_URL}/api/user/unblock`, { targetUserId: targetId }, {
				headers: { Authorization: `Bearer ${token}` }
			});
			fetchUser(); // Refresh list to maybe show them again if they weren't blocked by other criteria
			alert("User unblocked successfully");
		} catch (err) {
			alert("Failed to unblock user");
		}
	};

	const handleReport = async (targetId, reason, description) => {
		try {
			const token = localStorage.getItem("token");
			await axios.post(`${API_URL}/api/report`, { reportedUserId: targetId, reason, description }, {
				headers: { Authorization: `Bearer ${token}` }
			});
			alert("Report submitted successfully");
		} catch (err) {
			alert("Failed to submit report");
		}
	};

	const handleEditMessage = (msgId, newContent) => {
		socketRef.current?.emit("editMessage", { messageId: msgId, newContent, chatId: selectedChat._id });
	};

	const handleDeleteMessage = (msgId) => {
		socketRef.current?.emit("deleteMessage", { messageId: msgId, chatId: selectedChat._id });
	};

	const handleReact = (msgId, emoji) => {
		socketRef.current?.emit("toggleReaction", { messageId: msgId, emoji, chatId: selectedChat._id });
	};

	const handlePin = (msgId) => {
		socketRef.current?.emit("pinMessage", { messageId: msgId, chatId: selectedChat._id });
	};

	const handleUnpin = (msgId) => {
		socketRef.current?.emit("unpinMessage", { messageId: msgId, chatId: selectedChat._id });
	};

	const filteredUsers = userList.filter(u =>
		String(u._id) !== String(user?._id) &&
		u.username.toLowerCase().includes(searchQuery.toLowerCase())
	);

	if (!user) return (
		<div>
			<Loader2 />
		</div>
	);

	return (
		<div className="flex h-screen bg-dark-bg text-white overflow-hidden font-sans">
			{/* ========== INTEGRATED SIDEBAR ========== */}
			<aside className="w-20 lg:w-24 flex flex-col items-center py-8 border-r border-white/5 bg-dark-bg/50 backdrop-blur-2xl z-20">
				<div className="mb-12">
					<div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
						<MessageCircle size={24} className="text-white fill-white/20" />
					</div>
				</div>

				{/* No In-App Toast Notification */}

				<nav className="flex-1 flex flex-col gap-8">
					{[
						{ icon: MessageCircle, id: 'chats', active: true },
						{ icon: User, id: 'contacts' },
						{ icon: Search, id: 'search' },
						{ icon: Settings, id: 'settings' },
					].map((item) => (
						<motion.button
							key={item.id}
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
							onClick={() => item.id === 'settings' ? navigate('/blocked') : null}
							className={`p-3 rounded-2xl transition-all ${item.active
								? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
								: 'text-gray-500 hover:text-white hover:bg-white/5'
								}`}
						>
							<item.icon size={24} />
						</motion.button>
					))}
				</nav>

				<div className="flex flex-col gap-6 mt-auto">
					<motion.button
						whileHover={{ scale: 1.1 }}
						onClick={() => navigate('/profile')}
						className="relative"
					>
						<div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center border-2 border-white/10">
							<span className="text-xs font-bold">{user?.username?.[0]?.toUpperCase()}</span>
						</div>
						<div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-dark-bg" title="Online" />
					</motion.button>

					<motion.button
						whileHover={{ scale: 1.1 }}
						onClick={logOut}
						className="p-3 rounded-2xl text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
					>
						<LogOut size={24} />
					</motion.button>
				</div>
			</aside>

			{/* ========== CHAT LIST SIDEBAR ========== */}
			<aside className={`w-80 lg:w-96 flex flex-col border-r border-white/5 bg-dark-bg/30 backdrop-blur-xl z-10 ${mobileShowChat ? 'hidden md:flex' : 'flex'}`}>
				<div className="p-6">
					<h2 className="text-2xl font-bold mb-6 flex items-center justify-between">
						Chats
						<motion.button
							whileHover={{ rotate: 90 }}
							className="p-2 glass rounded-lg"
						>
							<Edit size={18} className="text-gray-400" />
						</motion.button>
					</h2>

					<div className="relative group">
						<Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={18} />
						<input
							type="text"
							placeholder="Search conversations..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white/10 transition-all text-sm"
						/>
					</div>
				</div>

				<div className="flex-1 overflow-y-auto custom-scrollbar px-3 pb-6">
					<div className="space-y-1">
						{filteredUsers.length === 0 ? (
							<div className="text-center py-10">
								<p className="text-gray-500 text-sm">No users found</p>
							</div>
						) : (
							filteredUsers.map((u) => {
								const lastMsg = u.lastMessage;
								const isActive = activeUserId === u._id;

								return (
									<motion.div
										key={u._id}
										initial={{ opacity: 0, x: -10 }}
										animate={{ opacity: 1, x: 0 }}
										onClick={() => getChats(u._id)}
										className={`group flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all ${isActive
											? 'bg-blue-600/10 border border-blue-500/20 shadow-lg shadow-blue-500/5'
											: 'hover:bg-white/5 border border-transparent'
											}`}
									>
										<div className="relative flex-shrink-0">
											<div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold border-2 ${isActive ? 'border-blue-500/50' : 'border-white/5'
												} bg-gradient-to-tr ${isActive ? 'from-blue-600 to-indigo-600 text-white' : 'from-gray-700 to-gray-800 text-gray-300'
												}`}>
												{u.username[0].toUpperCase()}
											</div>
											{u.isOnline && (
												<div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-dark-bg" />
											)}
										</div>

										<div className="flex-1 min-w-0">
											<div className="flex justify-between items-center mb-1">
												<span className={`font-semibold truncate ${isActive ? 'text-blue-400' : 'text-gray-200 group-hover:text-white'}`}>
													{u.username}
												</span>
												<span className="text-[10px] text-gray-500 whitespace-nowrap">
													{lastMsg ? new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
												</span>
											</div>
											<div className="flex justify-between items-center">
												<p className={`text-xs truncate max-w-[140px] ${u.hasNew ? 'text-blue-400 font-bold' : 'text-gray-500'
													}`}>
													{Object.values(typingUsers).some(uids => uids.includes(u._id))
														? <span className="text-blue-400 animate-pulse drop-shadow-[0_0_5px_rgba(96,165,250,0.5)]">Typing...</span>
														: (lastMsg?.content || 'No messages yet')}
												</p>
												{u.hasNew && (
													<div className="w-2 h-2 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50" />
												)}
											</div>
										</div>
									</motion.div>
								);
							})
						)}
					</div>
				</div>
			</aside>

			{/* ========== MAIN CHAT AREA ========== */}
			<main className={`flex-1 relative flex flex-col bg-dark-bg/20 ${!mobileShowChat ? 'hidden md:flex' : 'flex'}`}>
				<AnimatePresence mode="wait">
					{!selectedChat ? (
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.9 }}
							className="flex-1 flex flex-col items-center justify-center p-12 text-center"
						>
							<div className="w-24 h-24 rounded-[2rem] bg-gradient-to-tr from-blue-500/20 to-indigo-500/20 flex items-center justify-center mb-8 border border-blue-500/10">
								<MessageCircle size={48} className="text-blue-500" />
							</div>
							<h2 className="text-3xl font-bold mb-4 text-white">Select a conversation</h2>
							<p className="text-gray-500 max-w-sm">
								Choose a person from the left menu to start chatting and sharing your world.
							</p>
						</motion.div>
					) : (
						<ChatWindow
							messages={messages}
							onSend={handleSendMessage}
							onEdit={handleEditMessage}
							onDelete={handleDeleteMessage}
							onReact={handleReact}
							onPin={handlePin}
							onUnpin={handleUnpin}
							currentUser={user}
							partner={userList.find(u => u._id === activeUserId)}
							isPartnerTyping={!!typingUsers[activeUserId]}
							onTypingStart={() => socketRef.current.emit('typingStart', { chatId: selectedChat._id, receiverId: activeUserId })}
							onTypingStop={() => socketRef.current.emit('typingStop', { chatId: selectedChat._id, receiverId: activeUserId })}
							onBack={() => { setMobileShowChat(false); setActiveUserId(null); }}
							pinnedMessages={pinnedMessages}
							onBlock={handleBlock}
							onUnblock={handleUnblock}
							onReport={handleReport}
						/>
					)}
				</AnimatePresence>
			</main>
		</div>
	);
}

export default Dashboard;
