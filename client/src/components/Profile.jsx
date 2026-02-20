import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
	LogOut,
	ArrowLeft,
	User,
	Mail,
	Calendar,
	Copy,
	Check,
	Settings,
	MessageCircle,
	Shield,
	Edit2,
	Loader2,
	ChevronRight,
	Star,
	Zap,
	Lock,
} from "lucide-react";
import VerifiedBadge from "./common/VerifiedBadge";
import { toast } from "react-hot-toast";
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
	} catch (e) {
		return null;
	}
}

/* ─── Framer variants ─── */
const pageVariants = {
	hidden: { opacity: 0 },
	visible: { opacity: 1, transition: { staggerChildren: 0.08, ease: "easeOut" } },
};
const slideUp = {
	hidden: { opacity: 0, y: 28 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};
const fadeScale = {
	hidden: { opacity: 0, scale: 0.96 },
	visible: { opacity: 1, scale: 1, transition: { duration: 0.38, ease: "easeOut" } },
};

/* ─── Gradient map by username char ─── */
const GRADIENTS = [
	["#3b82f6", "#6366f1"],
	["#8b5cf6", "#ec4899"],
	["#06b6d4", "#3b82f6"],
	["#10b981", "#06b6d4"],
	["#f59e0b", "#ef4444"],
	["#6366f1", "#8b5cf6"],
];
const getGradient = (username) => {
	const idx = (username?.charCodeAt(0) || 0) % GRADIENTS.length;
	return GRADIENTS[idx];
};

/* ─── Stat Chip ─── */
const StatChip = ({ icon: Icon, label, value, color }) => (
	<motion.div
		variants={fadeScale}
		className="flex flex-col items-center gap-1.5 px-5 py-4 rounded-2xl border border-white/6 relative overflow-hidden group cursor-default"
		style={{ background: "rgba(255,255,255,0.03)" }}
		whileHover={{ scale: 1.04, backgroundColor: "rgba(255,255,255,0.06)" }}
	>
		<div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-1 ${color}`}
			style={{ background: "rgba(255,255,255,0.05)" }}>
			<Icon size={16} />
		</div>
		<span className="text-xl font-bold text-white leading-none">{value}</span>
		<span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">{label}</span>
	</motion.div>
);

/* ─── Info Row Card ─── */
const InfoCard = ({ icon: Icon, label, value, colorCls, bgCls, copiedKey, onCopy }) => {
	const isCopied = copiedKey === label;
	return (
		<motion.div
			variants={slideUp}
			whileHover={{ scale: 1.012, backgroundColor: "rgba(255,255,255,0.05)" }}
			className="flex items-center gap-4 p-4 rounded-2xl border border-white/5 group transition-all duration-200 cursor-default"
			style={{ background: "rgba(255,255,255,0.025)" }}
		>
			<div className={`w-11 h-11 rounded-2xl flex-shrink-0 flex items-center justify-center border border-white/8 ${bgCls} ${colorCls}`}>
				<Icon size={18} />
			</div>
			<div className="flex-1 min-w-0">
				<p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold mb-0.5">{label}</p>
				<p className="text-sm font-semibold text-gray-200 truncate">{value}</p>
			</div>
			<motion.button
				whileHover={{ scale: 1.12 }}
				whileTap={{ scale: 0.88 }}
				onClick={() => onCopy(value, label)}
				className={`p-2.5 rounded-xl transition-all duration-200 flex-shrink-0 ${isCopied
					? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
					: "text-gray-600 hover:text-white hover:bg-white/8 border border-transparent"
					}`}
				title="Copy"
			>
				<AnimatePresence mode="wait" initial={false}>
					{isCopied ? (
						<motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
							<Check size={15} />
						</motion.span>
					) : (
						<motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
							<Copy size={15} />
						</motion.span>
					)}
				</AnimatePresence>
			</motion.button>
		</motion.div>
	);
};

/* ══════════════════════════════════════
   PROFILE
══════════════════════════════════════ */
function Profile() {
	const [user, setUser] = useState(null);
	const [fullUser, setFullUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [copiedKey, setCopiedKey] = useState(null);
	const navigate = useNavigate();

	/* ─── Fetch data ─── */
	useEffect(() => {
		const fetchData = async () => {
			const token = localStorage.getItem("token");
			if (!token) return navigate("/login");
			try {
				const decoded = parseJwt(token);
				setUser({ _id: decoded.id, username: decoded.username, email: decoded.email });
				const res = await axios.get(`${API_BASE_URL}/api/me`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				setFullUser(res.data);
			} catch (err) {
				console.error(err);
				navigate("/login");
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [navigate]);

	const handleLogout = useCallback(() => {
		localStorage.removeItem("token");
		navigate("/login");
	}, [navigate]);

	const copyToClipboard = useCallback((text, key) => {
		navigator.clipboard.writeText(text);
		setCopiedKey(key);
		setTimeout(() => setCopiedKey(null), 2200);
	}, []);

	/* ─── Derived ─── */
	const initials = user?.username?.[0]?.toUpperCase() ?? "?";
	const joinedDate = fullUser?.createdAt
		? new Date(fullUser.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
		: "Unknown";
	const [g1, g2] = user ? getGradient(user.username) : ["#3b82f6", "#6366f1"];

	/* ─── Loading ─── */
	if (loading)
		return (
			<div className="h-screen w-screen bg-[#030014] flex items-center justify-center">
				<div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[120px] orb-animate pointer-events-none"
					style={{ background: `radial-gradient(circle, ${g1}22, transparent)` }} />
				<motion.div
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ duration: 0.5 }}
					className="flex flex-col items-center gap-4"
				>
					<div className="w-16 h-16 rounded-[1.25rem] flex items-center justify-center shadow-2xl"
						style={{ background: `linear-gradient(135deg, ${g1}, ${g2})` }}>
						<User size={28} className="text-white" />
					</div>
					<div className="flex items-center gap-2 text-gray-500 text-sm">
						<Loader2 size={16} className="animate-spin" />
						Loading profile…
					</div>
				</motion.div>
			</div>
		);

	if (!user) return null;

	/* ─── Info cards config ─── */
	const infoCards = [
		{ label: "Full Username", value: user.username, icon: User, colorCls: "text-blue-400", bgCls: "bg-blue-500/10" },
		{ label: "Email Address", value: user.email, icon: Mail, colorCls: "text-violet-400", bgCls: "bg-violet-500/10" },
		{ label: "Member Since", value: joinedDate, icon: Calendar, colorCls: "text-cyan-400", bgCls: "bg-cyan-500/10" },
		{ label: "Identity Token", value: user._id, icon: Shield, colorCls: "text-indigo-400", bgCls: "bg-indigo-500/10" },
	];

	return (
		<div className="min-h-screen bg-[#030014] text-white relative overflow-hidden">

			{/* ── Ambient orbs ── */}
			<div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
				<div className="absolute top-0 right-0 w-[480px] h-[480px] rounded-full blur-[130px] orb-animate opacity-60"
					style={{ background: `radial-gradient(circle, ${g1}18, transparent)` }} />
				<div className="absolute bottom-0 left-0 w-[380px] h-[380px] rounded-full blur-[110px] orb-animate opacity-50"
					style={{ background: `radial-gradient(circle, ${g2}14, transparent)`, animationDelay: "5s" }} />
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full blur-[90px] orb-animate opacity-30"
					style={{ background: "radial-gradient(circle, rgba(6,182,212,0.1), transparent)", animationDelay: "2.5s" }} />
			</div>

			{/* ── Sticky Header ── */}
			<header
				className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-white/5"
				style={{ background: "rgba(3,0,20,0.75)", backdropFilter: "blur(24px)" }}
			>
				<div className="flex items-center gap-3">
					<motion.button
						whileHover={{ scale: 1.08 }}
						whileTap={{ scale: 0.92 }}
						onClick={() => navigate("/dashboard")}
						className="p-2.5 rounded-xl text-gray-400 hover:text-white transition-all border border-transparent hover:border-white/10 hover:bg-white/5"
					>
						<ArrowLeft size={20} />
					</motion.button>
					<div>
						<h1 className="text-lg font-bold tracking-tight leading-none">My Profile</h1>
						<p className="text-[11px] text-gray-500 mt-0.5">Account details & settings</p>
					</div>
				</div>

				<div className="flex items-center gap-2">
					<motion.button
						whileHover={{ scale: 1.08 }}
						whileTap={{ scale: 0.92 }}
						onClick={() => navigate("/dashboard")}
						className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-white border border-transparent hover:border-white/10 hover:bg-white/5 transition-all"
					>
						<MessageCircle size={16} />
						<span className="hidden sm:inline">Chat</span>
					</motion.button>
					<motion.button
						whileHover={{ scale: 1.08, rotate: 45 }}
						whileTap={{ scale: 0.92 }}
						className="p-2.5 rounded-xl text-gray-400 hover:text-white border border-transparent hover:border-white/10 hover:bg-white/5 transition-all"
					>
						<Settings size={18} />
					</motion.button>
				</div>
			</header>

			{/* ── Scrollable content ── */}
			<div className="relative z-10 overflow-y-auto custom-scrollbar">
				<motion.div
					variants={pageVariants}
					initial="hidden"
					animate="visible"
					className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6 pb-16"
				>

					{/* ════════════════════════
              HERO CARD
          ════════════════════════ */}
					<motion.div variants={slideUp} className="relative rounded-[2rem] overflow-hidden border border-white/8 shadow-2xl">

						{/* Gradient banner */}
						<div
							className="h-36 w-full relative"
							style={{ background: `linear-gradient(135deg, ${g1}55 0%, ${g2}66 50%, ${g1}33 100%)` }}
						>
							{/* Mesh noise overlay */}
							<div className="absolute inset-0 opacity-20"
								style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
							{/* Radial shine */}
							<div className="absolute inset-0"
								style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.08) 0%, transparent 70%)" }} />
						</div>

						{/* Card body */}
						<div className="px-6 pb-7" style={{ background: "rgba(5,3,22,0.85)", backdropFilter: "blur(20px)" }}>

							{/* Avatar row */}
							<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-14 mb-5">
								{/* Avatar */}
								<div className="relative w-fit">
									<div
										className="w-24 h-24 rounded-[1.5rem] p-[3px] shadow-2xl"
										style={{ background: `linear-gradient(135deg, ${g1}, ${g2})`, boxShadow: `0 8px 40px ${g1}55` }}
									>
										<div
											className="w-full h-full rounded-[1.35rem] flex items-center justify-center text-4xl font-black border border-white/10"
											style={{ background: "#030014", color: g1 }}
										>
											{initials}
										</div>
									</div>
									{/* Edit button */}
									<motion.button
										whileHover={{ scale: 1.15 }}
										whileTap={{ scale: 0.88 }}
										className="absolute -bottom-1.5 -right-1.5 w-9 h-9 rounded-[0.75rem] bg-white text-[#030014] flex items-center justify-center shadow-lg border-[3px] border-[#030014]"
										title="Edit avatar"
									>
										<Edit2 size={14} />
									</motion.button>
									{/* Online indicator */}
									<div className="absolute top-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#030014] pulse-ring" />
								</div>

								{/* Action buttons */}
								<div className="flex gap-2.5 flex-wrap">
									<motion.button
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										onClick={() => navigate("/dashboard")}
										className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold shadow-lg transition-all"
										style={{ background: `linear-gradient(135deg, ${g1}, ${g2})`, boxShadow: `0 4px 20px ${g1}44` }}
									>
										<MessageCircle size={15} />
										Send Message
									</motion.button>
									<motion.button
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										onClick={() => copyToClipboard(`${user.username} | ${user._id}`, "share")}
										className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold border border-white/10 text-gray-300 hover:border-white/20 hover:text-white transition-all"
										style={{ background: "rgba(255,255,255,0.04)" }}
									>
										{copiedKey === "share" ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
										{copiedKey === "share" ? "Copied!" : "Share Profile"}
									</motion.button>
								</div>
							</div>

							{/* Name + verified */}
							<div className="flex items-center gap-2.5 mb-1">
								<h2 className="text-2xl font-black tracking-tight text-white">{user.username}</h2>
								{fullUser?.isVerified && <VerifiedBadge size={20} />}
							</div>
							<p className="text-sm text-gray-500 mb-5 flex items-center gap-1.5">
								<Mail size={13} className="opacity-60" />
								{user.email}
							</p>

							{/* Stats bar */}
							<motion.div variants={pageVariants} className="grid grid-cols-3 gap-3">
								<StatChip icon={Zap} label="Messages" value="4.2k" color="text-blue-400" />
								<StatChip icon={Star} label="Network" value="52" color="text-amber-400" />
								<StatChip icon={Shield} label="Status" value={fullUser?.isVerified ? "Verified" : "Active"} color={fullUser?.isVerified ? "text-cyan-400" : "text-emerald-400"} />
							</motion.div>
						</div>
					</motion.div>

					{/* ════════════════════════
              ADMIN PANEL (Conditional)
          ════════════════════════ */}
					{fullUser?.role === 'admin' && (
						<motion.div variants={slideUp} className="relative group">
							<motion.button
								whileHover={{ scale: 1.02, y: -2 }}
								whileTap={{ scale: 0.98 }}
								onClick={() => navigate("/admin")}
								className="w-full p-6 rounded-[2rem] flex items-center justify-between border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 shadow-[0_0_30px_rgba(245,158,11,0.1)] hover:border-amber-500/50 transition-all overflow-hidden relative group"
							>
								{/* Decorative Background Elements */}
								<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
								<div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />

								<div className="flex items-center gap-5 relative z-10">
									<div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
										<Shield size={28} className="text-white" />
									</div>
									<div className="text-left">
										<h3 className="text-xl font-black text-white tracking-tight leading-none mb-1">Admin Control Center</h3>
										<p className="text-[11px] text-amber-500/80 font-black uppercase tracking-[0.15em]">Global Infrastructure Management</p>
									</div>
								</div>

								<div className="w-12 h-12 rounded-full border border-amber-500/20 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all relative z-10">
									<ChevronRight size={20} />
								</div>
							</motion.button>
						</motion.div>
					)}

					{/* ════════════════════════
              ACCOUNT INFO
          ════════════════════════ */}
					<motion.section variants={slideUp}>
						<div className="flex items-center gap-2 mb-3 px-1">
							<div className="w-5 h-5 rounded-md flex items-center justify-center"
								style={{ background: `linear-gradient(135deg, ${g1}, ${g2})` }}>
								<User size={11} className="text-white" />
							</div>
							<h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Account Information</h3>
						</div>

						<div className="space-y-2">
							{infoCards.map((card) => (
								<InfoCard
									key={card.label}
									{...card}
									copiedKey={copiedKey}
									onCopy={copyToClipboard}
								/>
							))}
						</div>
					</motion.section>

					{/* ════════════════════════
              SECURITY SECTION
          ════════════════════════ */}
					<motion.section variants={slideUp}>
						<div className="flex items-center gap-2 mb-3 px-1">
							<div className="w-5 h-5 rounded-md bg-indigo-500/20 flex items-center justify-center">
								<Lock size={11} className="text-indigo-400" />
							</div>
							<h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Privacy & Security</h3>
						</div>

						<div className="rounded-2xl border border-white/5 overflow-hidden divide-y divide-white/5"
							style={{ background: "rgba(255,255,255,0.025)" }}>
							{[
								{ label: "Blocked Users", sub: "Manage who you've blocked", icon: Shield, path: "/blocked" },
								{ label: "Activity Log", sub: "View your audit trail", icon: Calendar, path: "/blocked" },
								{ label: "Privacy Hub", sub: "Control your privacy settings", icon: Lock, path: "/blocked" },
							].map((item) => (
								<motion.button
									key={item.label}
									whileHover={{ backgroundColor: "rgba(255,255,255,0.04)" }}
									whileTap={{ scale: 0.99 }}
									onClick={() => navigate(item.path)}
									className="w-full flex items-center gap-4 px-4 py-4 text-left transition-colors"
								>
									<div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 flex-shrink-0">
										<item.icon size={16} />
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-semibold text-gray-200">{item.label}</p>
										<p className="text-[11px] text-gray-500 mt-0.5">{item.sub}</p>
									</div>
									<ChevronRight size={16} className="text-gray-600 flex-shrink-0" />
								</motion.button>
							))}
						</div>
					</motion.section>

					{/* ════════════════════════
              SESSION / LOGOUT
          ════════════════════════ */}
					<motion.section variants={slideUp}>
						<div className="rounded-2xl border border-red-500/12 overflow-hidden"
							style={{ background: "rgba(239,68,68,0.04)" }}>
							<div className="px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
								<div>
									<div className="flex items-center gap-2 mb-1">
										<LogOut size={15} className="text-red-400" />
										<h3 className="text-sm font-bold text-red-300">End Session</h3>
									</div>
									<p className="text-xs text-gray-500">Sign out and clear your session from this device</p>
								</div>
								<motion.button
									whileHover={{ scale: 1.04, backgroundColor: "rgba(239,68,68,0.85)" }}
									whileTap={{ scale: 0.96 }}
									onClick={handleLogout}
									className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-red-500/15 border border-red-500/25 text-red-400 hover:text-white font-bold text-sm transition-all duration-200 whitespace-nowrap"
								>
									<LogOut size={15} />
									Logout
								</motion.button>
							</div>
						</div>
					</motion.section>

					{/* Footer spacing */}
					<div className="h-4" />
				</motion.div>
			</div>
		</div>
	);
}

export default Profile;
