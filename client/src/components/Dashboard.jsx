import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";
import ChatWindow from "./ChatWindow";
import { motion, AnimatePresence } from "framer-motion";
import {
	LogOut, Search, MessageCircle, User, Settings,
	Edit, Loader2, X, Shield, Plus, MoreHorizontal,
	ChevronRight, Activity, Zap, Compass, Sparkles,
	Ghost
} from "lucide-react";
import { API_BASE_URL } from "../config";

/* ─── JWT helper ─── */
function parseJwt(token) {
	if (!token) return null;
	try {
		const base64Url = token.split(".")[1];
		const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
		const jsonPayload = decodeURIComponent(
			atob(base64)
				.split("")
				.map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
				.join("")
		);
		return JSON.parse(jsonPayload);
	} catch (e) { return null; }
}

/* ─── Framer variants ─── */
const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { staggerChildren: 0.1, delayChildren: 0.2 }
	}
};

const itemVariants = {
	hidden: { opacity: 0, x: -20 },
	visible: {
		opacity: 1, x: 0,
		transition: { type: "spring", stiffness: 300, damping: 24 }
	}
};

/* ─── Nav items ─── */
const NAV_ITEMS = [
	{ icon: MessageCircle, id: "chats", label: "Chats", color: "#3b82f6" },
	{ icon: Compass, id: "explore", label: "Explore", color: "#8b5cf6" },
	{ icon: Shield, id: "privacy", label: "Privacy", color: "#ec4899" },
	{ icon: Settings, id: "settings", label: "Settings", color: "#f59e0b" },
];

/* ─── Avatar ─── */
const UserAvatar = ({ username, isActive, isOnline, size = "md", isTyping }) => {
	const gradients = [
		"from-blue-600 to-indigo-600",
		"from-violet-600 to-purple-600",
		"from-emerald-500 to-teal-600",
		"from-rose-500 to-pink-600",
		"from-amber-500 to-orange-600",
	];
	const idx = username?.charCodeAt(0) % gradients.length || 0;
	const sz = size === "lg" ? "w-14 h-14 text-xl" : "w-11 h-11 text-base";

	return (
		<div className="relative flex-shrink-0">
			<motion.div
				whileHover={{ scale: 1.05 }}
				className={`relative ${sz} rounded-2xl flex items-center justify-center font-black border overflow-hidden shadow-2xl transition-all duration-300 bg-gradient-to-tr ${gradients[idx]} ${isActive ? "border-white/40 ring-4 ring-blue-500/20" : "border-white/10"
					}`}
			>
				{/* Inner glow */}
				<div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
				<span className="relative z-10 text-white drop-shadow-md">
					{username?.[0]?.toUpperCase()}
				</span>
			</motion.div>

			<AnimatePresence>
				{isOnline && (
					<motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						exit={{ scale: 0 }}
						className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#030014] z-20"
						style={{ boxShadow: '0 0 12px rgba(16,185,129,0.5)' }}
					/>
				)}
			</AnimatePresence>

			{isTyping && (
				<div className="absolute -top-1 -right-1 flex gap-0.5">
					<motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1.5 h-1.5 rounded-full bg-blue-400" />
					<motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-blue-400" />
				</div>
			)}
		</div>
	);
};

/* ═══════════════════════════════════════════
   DASHBOARD
   ═══════════════════════════════════════════ */
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
	const [activeTab, setActiveTab] = useState("chats");
	const [tooltip, setTooltip] = useState(null);
	const navigate = useNavigate();
	const socketRef = useRef(null);

	/* ─── Logout ─── */
	const logOut = useCallback(() => {
		localStorage.removeItem("token");
		navigate("/login");
	}, [navigate]);

	/* ─── Socket Events ─── */
	const setupSocketEvents = useCallback((socket, decodedId) => {
		socket.on("connect", () => {
			socket.emit("joinChat", decodedId);
		});

		socket.on("chatUpdated", ({ chatId, lastMessage, from }) => {
			const otherId = from && from !== decodedId ? from : activeUserId;
			if (!otherId) return;

			setUserList((prev) => {
				const updated = prev.map((u) =>
					u._id === otherId ? { ...u, lastMessage, hasNew: from !== decodedId } : u
				);
				const foundIndex = updated.findIndex((u) => u._id === otherId);
				if (foundIndex > 0) {
					const [item] = updated.splice(foundIndex, 1);
					return [item, ...updated];
				}
				return updated;
			});

			if (selectedChat && selectedChat._id === chatId) {
				setMessages((prev) =>
					prev.find((m) => m._id === lastMessage._id) ? prev : [...prev, lastMessage]
				);
			}
		});

		socket.on("receiveMessage", (msg) => {
			setMessages((prev) => (prev.find((m) => m._id === msg._id) ? prev : [...prev, msg]));
			const senderId = msg.sender?._id || msg.sender;
			const isSameChat = selectedChat && selectedChat._id === msg.chatId;
			if (senderId !== decodedId) {
				socket.emit("updateStatus", {
					messageIds: [msg._id],
					status: isSameChat ? "seen" : "delivered",
					chatId: msg.chatId,
				});
			}
		});

		socket.on("statusUpdated", ({ messageIds, status, chatId }) => {
			if (selectedChat && selectedChat._id === chatId) {
				setMessages((prev) =>
					prev.map((m) => (messageIds.includes(m._id) ? { ...m, status } : m))
				);
			}
		});

		socket.on("onlineUsersList", (ids) => {
			setOnlineUserIds(ids);
			setUserList((prev) =>
				prev.map((u) => ({ ...u, isOnline: ids.some((id) => String(id) === String(u._id)) }))
			);
		});

		socket.on("userStatusChanged", ({ userId, status, lastSeen }) => {
			setOnlineUserIds((prev) =>
				status === "online"
					? prev.some((id) => String(id) === String(userId)) ? prev : [...prev, userId]
					: prev.filter((id) => String(id) !== String(userId))
			);
			setUserList((prev) =>
				prev.map((u) =>
					String(u._id) === String(userId)
						? { ...u, isOnline: status === "online", lastSeen: status === "offline" ? lastSeen : u.lastSeen }
						: u
				)
			);
		});

		socket.on("typing", ({ chatId, userId }) => {
			if (userId === decodedId) return;
			setTypingUsers((prev) => ({
				...prev,
				[chatId]: [...(prev[chatId] || []).filter((id) => id !== userId), userId],
			}));
		});

		socket.on("stopTyping", ({ chatId, userId }) => {
			setTypingUsers((prev) => ({
				...prev,
				[chatId]: (prev[chatId] || []).filter((id) => id !== userId),
			}));
		});

		socket.on("messageEdited", ({ messageId, newContent, chatId, editedAt }) => {
			if (selectedChat && selectedChat._id === chatId)
				setMessages((prev) =>
					prev.map((m) =>
						m._id === messageId ? { ...m, content: newContent, isEdited: true, editedAt } : m
					)
				);
		});

		socket.on("messageDeleted", ({ messageId, chatId, isDeleted, isDeletedForMe }) => {
			if (selectedChat && selectedChat._id === chatId) {
				if (isDeleted)
					setMessages((prev) =>
						prev.map((m) =>
							m._id === messageId ? { ...m, content: "This message was deleted", isDeleted: true } : m
						)
					);
				else if (isDeletedForMe)
					setMessages((prev) => prev.filter((m) => m._id !== messageId));
			}
		});

		socket.on("reactionUpdated", ({ messageId, reactions, chatId }) => {
			if (selectedChat && selectedChat._id === chatId)
				setMessages((prev) =>
					prev.map((m) => (m._id === messageId ? { ...m, reactions } : m))
				);
		});

		socket.on("messagePinned", ({ chatId, message }) => {
			if (selectedChat && selectedChat._id === chatId) {
				setMessages((prev) =>
					prev.map((m) =>
						m._id === message._id
							? { ...m, isPinned: true, pinnedBy: message.pinnedBy, pinnedAt: message.pinnedAt }
							: m
					)
				);
				setPinnedMessages((prev) => [
					message,
					...prev.filter((p) => String(p._id) !== String(message._id)),
				]);
			}
		});

		socket.on("messageUnpinned", ({ chatId, messageId }) => {
			if (selectedChat && selectedChat._id === chatId) {
				setMessages((prev) =>
					prev.map((m) =>
						String(m._id) === String(messageId)
							? { ...m, isPinned: false, pinnedBy: null, pinnedAt: null }
							: m
					)
				);
				setPinnedMessages((prev) => prev.filter((p) => String(p._id) !== String(messageId)));
			}
		});

		socket.on("error", (err) => console.error("Socket error:", err));
	}, [selectedChat, activeUserId]);

	/* ─── Init ─── */
	useEffect(() => {
		const init = async () => {
			const token = localStorage.getItem("token");
			if (!token) return navigate("/login");
			try {
				const decoded = parseJwt(token);
				setUser({ _id: decoded.id, username: decoded.username, email: decoded.email });
				const socket = io(API_BASE_URL, { auth: { token } });
				socketRef.current = socket;
				setupSocketEvents(socket, decoded.id);
			} catch (e) {
				localStorage.removeItem("token");
				navigate("/login");
			}
		};
		init();
		return () => {
			if (socketRef.current) { socketRef.current.disconnect(); socketRef.current = null; }
		};
	}, [navigate, setupSocketEvents]);

	/* ─── Fetch data ─── */
	const fetchUsers = useCallback(async () => {
		if (!user) return;
		try {
			const token = localStorage.getItem("token");
			const res = await axios.get(`${API_BASE_URL}/api/users`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setUserList(
				res.data.users.map((u) => ({
					...u,
					hasNew: false,
					lastMessage: null,
					isOnline: onlineUserIds.some((id) => String(id) === String(u._id)),
				}))
			);
		} catch (error) { console.error("Fetch users failed:", error); }
	}, [user, onlineUserIds]);

	useEffect(() => { if (user) fetchUsers(); }, [user, fetchUsers]);

	/* ─── Chat Actions ─── */
	const getChats = useCallback(async (id) => {
		setActiveUserId(id);
		setUserList((prev) => prev.map((u) => (u._id === id ? { ...u, hasNew: false } : u)));
		const token = localStorage.getItem("token");
		try {
			const res = await axios.get(`${API_BASE_URL}/api/chats/${id}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setSelectedChat(res.data.chat);
			setMobileShowChat(true);
		} catch (err) { console.error("Failed to fetch chats:", err); }
	}, []);

	useEffect(() => {
		if (!selectedChat) return;
		const token = localStorage.getItem("token");
		const headers = { Authorization: `Bearer ${token}` };

		axios.get(`${API_BASE_URL}/api/messages/${selectedChat._id}`, { headers })
			.then((res) => setMessages(res.data));
		axios.get(`${API_BASE_URL}/api/pinned/${selectedChat._id}`, { headers })
			.then((res) => setPinnedMessages(res.data));
	}, [selectedChat]);

	/* ─── Message management ─── */
	const handleSendMessage = useCallback((content, parentMessageId) => {
		socketRef.current?.emit("sendMessage", { chatId: selectedChat._id, content, parentMessageId });
	}, [selectedChat]);

	const handleBlock = useCallback(async (targetId) => {
		try {
			const token = localStorage.getItem("token");
			await axios.post(`${API_BASE_URL}/api/user/block`, { targetUserId: targetId }, { headers: { Authorization: `Bearer ${token}` } });
			setUserList((prev) => prev.filter((u) => u._id !== targetId));
			setSelectedChat(null); setMobileShowChat(false);
		} catch (err) { alert(err.response?.data?.message || "Block failed"); }
	}, []);

	const handleUnblock = useCallback(async (targetId) => {
		try {
			const token = localStorage.getItem("token");
			await axios.post(`${API_BASE_URL}/api/user/unblock`, { targetUserId: targetId }, { headers: { Authorization: `Bearer ${token}` } });
			fetchUsers();
		} catch { alert("Unblock failed"); }
	}, [fetchUsers]);

	const handleReport = useCallback(async (targetId, reason, description) => {
		try {
			const token = localStorage.getItem("token");
			await axios.post(`${API_BASE_URL}/api/report`, { reportedUserId: targetId, reason, description }, { headers: { Authorization: `Bearer ${token}` } });
		} catch { alert("Report failed"); }
	}, []);

	const handleEditMessage = useCallback((msgId, newContent) => {
		socketRef.current?.emit("editMessage", { messageId: msgId, newContent, chatId: selectedChat._id });
	}, [selectedChat]);

	const handleDeleteMessage = useCallback((msgId, deleteType = "everyone") => {
		socketRef.current?.emit("deleteMessage", { messageId: msgId, chatId: selectedChat._id, deleteType });
	}, [selectedChat]);

	const handleReact = useCallback((msgId, emoji) => {
		socketRef.current?.emit("toggleReaction", { messageId: msgId, emoji, chatId: selectedChat._id });
	}, [selectedChat]);

	const handlePin = useCallback((msgId) => {
		socketRef.current?.emit("pinMessage", { messageId: msgId, chatId: selectedChat._id });
	}, [selectedChat]);

	const handleUnpin = useCallback((msgId) => {
		socketRef.current?.emit("unpinMessage", { messageId: msgId, chatId: selectedChat._id });
	}, [selectedChat]);

	/* ─── Filtering ─── */
	const filteredUsers = useMemo(
		() => userList.filter(u =>
			String(u._id) !== String(user?._id) &&
			u.username.toLowerCase().includes(searchQuery.toLowerCase())
		), [userList, user, searchQuery]
	);

	const onlineCount = useMemo(() => filteredUsers.filter(u => u.isOnline).length, [filteredUsers]);

	/* ─── Loading phase ─── */
	if (!user) return (
		<div className="h-screen w-screen bg-[#030014] flex flex-col items-center justify-center relative overflow-hidden">
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
			<motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
				<div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center shadow-emerald-500/20 shadow-2xl mb-6">
					<MessageCircle size={36} className="text-white fill-white/10" />
				</div>
				<div className="flex items-center gap-3 text-gray-500 font-bold uppercase tracking-widest text-[10px]">
					<Loader2 size={14} className="animate-spin text-blue-500" /> accessing messenger...
				</div>
			</motion.div>
		</div>
	);

	return (
		<div className="flex h-screen bg-[#030014] text-white overflow-hidden font-sans relative">
			{/* ── Background accents ── */}
			<div className="pointer-events-none absolute inset-0 z-0">
				<div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full" />
				<div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/5 blur-[120px] rounded-full" />
			</div>

			{/* ════════════════════════════════════
				 CYBER SIDEBAR
			════════════════════════════════════ */}
			<motion.aside
				initial={{ x: -80 }}
				animate={{ x: 0 }}
				className="relative w-[80px] flex flex-col items-center py-8 border-r border-white/5 z-20 flex-shrink-0 bg-black/40 backdrop-blur-3xl"
			>
				{/* Logo */}
				<motion.div
					whileHover={{ scale: 1.1, rotate: 8 }}
					className="mb-10 w-12 h-12 rounded-[1.25rem] bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-500/20 cursor-pointer"
					onClick={() => navigate("/")}
				>
					<MessageCircle size={24} className="text-white" />
				</motion.div>

				{/* Navigation */}
				<nav className="flex-1 flex flex-col gap-4">
					{NAV_ITEMS.map((item) => {
						const active = activeTab === item.id;
						return (
							<div key={item.id} className="relative group flex justify-center py-1">
								{active && (
									<motion.div
										layoutId="sidePill"
										className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.6)]"
									/>
								)}
								<motion.button
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}
									onClick={() => {
										setActiveTab(item.id);
										if (["settings", "privacy"].includes(item.id)) navigate("/blocked");
										if (item.id === "contacts") navigate("/profile");
									}}
									className={`p-3.5 rounded-2xl transition-all duration-300 relative ${active
										? "bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-blue-500/5"
										: "text-gray-500 hover:text-white"
										}`}
								>
									<item.icon size={22} strokeWidth={active ? 2.5 : 2} />
									{active && (
										<motion.div
											layoutId="glow"
											className="absolute inset-0 bg-blue-500/5 blur-lg rounded-full"
										/>
									)}
								</motion.button>

								{/* Tooltip */}
								<div className="absolute left-full ml-4 px-3 py-1.5 rounded-lg bg-gray-900 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50 translate-x-[-10px] group-hover:translate-x-0">
									{item.label}
								</div>
							</div>
						);
					})}
				</nav>

				{/* Bottom Actions */}
				<div className="mt-auto flex flex-col items-center gap-6">
					<motion.div
						className="relative"
						whileHover={{ scale: 1.1 }}
						onClick={() => navigate("/profile")}
					>
						<div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center p-[2px] cursor-pointer shadow-xl">
							<div className="w-full h-full rounded-[0.9rem] bg-gray-900 flex items-center justify-center overflow-hidden border border-white/10">
								<span className="text-sm font-black text-white">{user.username[0].toUpperCase()}</span>
							</div>
						</div>
						<div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#030014] shadow-emerald-500/20 shadow-lg" />
					</motion.div>

					<motion.button
						whileHover={{ scale: 1.1, color: "#ef4444" }}
						onClick={logOut}
						className="p-3 text-gray-500 transition-colors"
					>
						<LogOut size={20} />
					</motion.button>
				</div>
			</motion.aside>

			{/* ════════════════════════════════════
				 CHAT LIST PANEL
			════════════════════════════════════ */}
			<motion.section
				initial={{ x: -20, opacity: 0 }}
				animate={{ x: 0, opacity: 1 }}
				className={`w-full md:w-[350px] lg:w-[400px] flex flex-col border-r border-white/5 bg-black/20 backdrop-blur-2xl z-10 ${mobileShowChat ? "hidden md:flex" : "flex"
					}`}
			>
				{/* Top Header */}
				<div className="p-6 pb-2">
					<div className="flex items-center justify-between mb-6">
						<div className="space-y-1">
							<h2 className="text-2xl font-black text-white tracking-tight leading-none">Intelligence</h2>
							<div className="flex items-center gap-2">
								<Activity size={10} className="text-emerald-500" />
								<span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">
									{onlineCount} agents active
								</span>
							</div>
						</div>
						<motion.button
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
							className="w-10 h-10 rounded-xl bg-white/3 border border-white/6 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/20 transition-all"
						>
							<Plus size={18} />
						</motion.button>
					</div>

					{/* Digital Search Bar */}
					<div className="relative group mb-4">
						<div className="absolute inset-0 bg-blue-500/5 blur-xl group-focus-within:bg-blue-500/10 transition-all rounded-2xl" />
						<div className="relative flex items-center bg-white/5 border border-white/6 rounded-2xl px-4 group-focus-within:border-blue-500/30 transition-all shadow-inner">
							<Search size={16} className="text-gray-500 group-focus-within:text-blue-400 transition-colors" />
							<input
								type="text"
								placeholder="Search encrypted channels..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-3 px-3 text-white placeholder:text-gray-600 font-medium"
							/>
							{searchQuery && (
								<X size={14} className="text-gray-500 cursor-pointer" onClick={() => setSearchQuery("")} />
							)}
						</div>
					</div>
				</div>

				{/* User List */}
				<div className="flex-1 overflow-y-auto no-scrollbar px-3 space-y-1 pb-6">
					<AnimatePresence mode="popLayout">
						{filteredUsers.length === 0 ? (
							<motion.div
								key="empty"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								className="flex flex-col items-center justify-center py-20 opacity-40"
							>
								<div className="p-4 rounded-full bg-white/2 border border-white/5 mb-4">
									<Ghost size={32} strokeWidth={1} />
								</div>
								<span className="text-xs font-bold uppercase tracking-widest text-gray-600">No signals found</span>
							</motion.div>
						) : (
							<motion.div
								variants={containerVariants}
								initial="hidden"
								animate="visible"
								className="space-y-1"
							>
								{filteredUsers.map((u) => {
									const isActive = activeUserId === u._id;
									const isTyping = Object.values(typingUsers).some(ids => ids.includes(u._id));
									const lastTime = u.lastMessage ? new Date(u.lastMessage.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";

									return (
										<motion.div
											key={u._id}
											variants={itemVariants}
											layout
											onClick={() => getChats(u._id)}
											className={`group relative flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 ${isActive
												? "bg-blue-500/10 border border-blue-500/20 shadow-xl"
												: "hover:bg-white/5 border border-transparent hover:border-white/5"
												}`}
										>
											{isActive && (
												<motion.div
													layoutId="activeGlow"
													className="absolute inset-0 bg-blue-500/5 blur-lg rounded-2xl -z-10"
												/>
											)}

											<UserAvatar
												username={u.username}
												isActive={isActive}
												isOnline={u.isOnline}
												isTyping={isTyping}
											/>

											<div className="flex-1 min-w-0">
												<div className="flex justify-between items-start mb-0.5">
													<h4 className={`text-sm font-black truncate transition-colors ${isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
														{u.username}
													</h4>
													<span className="text-[10px] font-black text-gray-600 uppercase tabular-nums">
														{lastTime}
													</span>
												</div>
												<div className="flex items-center justify-between gap-2">
													<p className={`text-xs truncate transition-colors font-medium ${u.hasNew ? 'text-blue-400 font-bold' : 'text-gray-500 group-hover:text-gray-400'}`}>
														{isTyping ? "typing signal detected..." : (u.lastMessage?.content || "No active transmission")}
													</p>
													{u.hasNew && (
														<div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
													)}
												</div>
											</div>

											{/* Subtle entry detail */}
											<div className="absolute right-4 translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all pointer-events-none">
												<ChevronRight size={14} className="text-gray-700" />
											</div>
										</motion.div>
									)
								})}
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</motion.section>

			{/* ════════════════════════════════════
				 MAIN CONTENT AREA
			════════════════════════════════════ */}
			<main className={`flex-1 flex flex-col relative z-0 ${!mobileShowChat ? "hidden md:flex" : "flex"}`}>
				<AnimatePresence mode="wait">
					{!selectedChat ? (
						/* Empty workspace view */
						<motion.div
							key="empty"
							initial={{ opacity: 0, scale: 0.98 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.98 }}
							className="flex-1 flex flex-col items-center justify-center p-12 text-center"
						>
							<div className="relative mb-8">
								<motion.div
									animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
									transition={{ repeat: Infinity, duration: 4 }}
									className="absolute inset-x-[-100px] inset-y-[-100px] bg-blue-600/10 blur-[80px] rounded-full pointer-events-none"
								/>
								<motion.div
									animate={{ y: [0, -10, 0] }}
									transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
									className="relative w-28 h-28 rounded-3xl bg-white/3 border border-white/8 backdrop-blur-xl flex items-center justify-center shadow-2xl"
								>
									<div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-indigo-500/10 rounded-3xl" />
									<Sparkles size={48} className="text-blue-400 opacity-60" />
								</motion.div>
								{/* Floating accents */}
								<motion.div animate={{ y: [0, 15, 0], x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute -top-4 -right-4 w-8 h-8 rounded-full border border-blue-500/20 bg-blue-500/5 flex items-center justify-center text-blue-500"><Zap size={14} /></motion.div>
								<motion.div animate={{ y: [0, -10, 0], x: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 5 }} className="absolute -bottom-6 -left-2 w-10 h-10 rounded-[12px] border border-white/5 bg-white/2 flex items-center justify-center text-gray-700 font-black text-xs uppercase">Enc</motion.div>
							</div>

							<h2 className="text-3xl font-black text-white mb-3 tracking-tighter">Messenger Hub</h2>
							<p className="text-gray-500 text-sm max-w-sm font-medium leading-relaxed">
								Select a secure channel from the sidebar to begin messaging. All transmissions are end-to-end encrypted.
							</p>

							<div className="flex gap-4 mt-10">
								{[
									{ l: "Secure Stack", i: Shield, c: "#3b82f6" },
									{ l: "Nano Sync", i: Zap, c: "#f59e0b" },
									{ l: "Vector Hub", i: Activity, c: "#10b981" }
								].map((tag, i) => (
									<div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/3 border border-white/5">
										<tag.i size={10} style={{ color: tag.c }} />
										<span className="text-[9px] font-black uppercase tracking-widest text-gray-500">{tag.l}</span>
									</div>
								))}
							</div>
						</motion.div>
					) : (
						/* Active chat interface */
						<motion.div
							key="chat"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="h-full"
						>
							<ChatWindow
								currentUser={user}
								partner={userList.find((u) => u._id === activeUserId)}
								messages={messages}
								onSend={handleSendMessage}
								onBack={() => { setMobileShowChat(false); setSelectedChat(null); }}
								pinnedMessages={pinnedMessages}
								isPartnerTyping={(typingUsers[selectedChat._id] || []).length > 0}
								onTypingStart={() => socketRef.current?.emit("typing", { chatId: selectedChat._id, userId: user._id })}
								onTypingStop={() => socketRef.current?.emit("stopTyping", { chatId: selectedChat._id, userId: user._id })}
								onEdit={handleEditMessage}
								onDelete={handleDeleteMessage}
								onReact={handleReact}
								onPin={handlePin}
								onUnpin={handleUnpin}
								onBlock={handleBlock}
								onUnblock={handleUnblock}
								onReport={handleReport}
							/>
						</motion.div>
					)}
				</AnimatePresence>
			</main>
		</div>
	);
}

export default Dashboard;
