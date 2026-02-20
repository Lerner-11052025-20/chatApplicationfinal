import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
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
	UserX,
	AlertTriangle,
} from "lucide-react";
import VerifiedBadge from "./common/VerifiedBadge";
import { toast } from "react-hot-toast"; // assuming toast might be used elsewhere or adding basic alert logic
import { API_URL } from "../config/api";


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

function Profile() {
	const [user, setUser] = useState(null);
	const [fullUser, setFullUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [copied, setCopied] = useState(false);
	const navigate = useNavigate();

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

				const res = await axios.get(`${API_URL}/api/me`, {
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

	const handleLogout = () => {
		localStorage.removeItem("token");
		navigate("/login");
	};

	const copyToClipboard = (text) => {
		navigator.clipboard.writeText(text);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	// No notification settings

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
				<motion.div
					animate={{ rotate: 360 }}
					transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
				>
					<MessageCircle size={36} style={{ color: 'var(--text-tertiary)' }} />
				</motion.div>
			</div>
		);
	}

	if (!user) return null;

	const initials = user.username[0].toUpperCase();
	const joinedDate = fullUser?.createdAt ? new Date(fullUser.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Unknown';
	const avatarColor = `hsl(${user.username.charCodeAt(0) * 7 % 360}, 60%, 70%)`;

	return (
		<div className="min-h-screen bg-dark-bg text-white relative overflow-hidden flex flex-col">
			{/* Background Decorations */}
			<div className="absolute top-0 left-0 w-full h-full bg-mesh opacity-30 -z-10" />
			<div className="absolute top-1/4 -right-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] -z-10" />
			<div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] -z-10" />

			{/* Header */}
			<header className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-dark-bg/30 backdrop-blur-xl sticky top-0 z-50">
				<div className="flex items-center gap-4">
					<motion.button
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}
						onClick={() => navigate('/dashboard')}
						className="p-2.5 glass rounded-xl text-gray-400 hover:text-white transition-colors"
					>
						<ArrowLeft size={20} />
					</motion.button>
					<h1 className="text-xl font-bold tracking-tight">Account Profile</h1>
				</div>
				<motion.button
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					className="p-2.5 glass rounded-xl text-gray-400 hover:text-white transition-colors"
				>
					<Settings size={20} />
				</motion.button>
			</header>

			{/* Profile Content */}
			<div className="flex-1 overflow-y-auto px-6 py-10 custom-scrollbar">
				<div className="max-w-4xl mx-auto space-y-8">
					{/* Profile Hero Card */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="glass p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group"
					>
						{/* Subtle Glow */}
						<div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors" />

						<div className="flex flex-col md:flex-row items-center gap-8 relative">
							{/* Avatar Section */}
							<div className="relative">
								<div className="w-32 h-32 rounded-[2.5rem] p-1.5 bg-gradient-to-tr from-blue-500 to-indigo-600 shadow-xl shadow-blue-500/20">
									<div className="w-full h-full rounded-[2.1rem] bg-dark-bg flex items-center justify-center text-4xl font-bold text-blue-400 border border-white/5 overflow-hidden">
										{initials}
									</div>
								</div>
								<motion.button
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}
									className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-white text-dark-bg flex items-center justify-center shadow-lg border-4 border-dark-bg"
								>
									<Edit2 size={16} />
								</motion.button>
							</div>

							{/* User Info */}
							<div className="flex-1 text-center md:text-left">
								<div className="flex items-center justify-center md:justify-start gap-2 mb-1">
									<h2 className="text-3xl font-bold">{user.username}</h2>
									{fullUser?.isVerified && <VerifiedBadge size={20} />}
								</div>
								<p className="text-gray-500 text-sm mb-6">{user.email}</p>

								{/* Stats Area */}
								<div className="flex items-center justify-center md:justify-start gap-4">
									{[
										{ label: 'Messages', value: '4.2k' },
										{ label: 'Network', value: '52' },
										{ label: 'Rank', value: 'Elite' },
									].map((stat, idx) => (
										<div key={idx} className="px-4 py-2 rounded-2xl bg-white/5 border border-white/5">
											<div className="text-lg font-bold leading-none mb-1">{stat.value}</div>
											<div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">{stat.label}</div>
										</div>
									))}
								</div>
							</div>

							{/* Actions */}
							<div className="flex flex-col gap-3 w-full md:w-auto">
								<motion.button
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									onClick={() => navigate('/dashboard')}
									className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 font-bold text-sm shadow-lg shadow-blue-600/20"
								>
									Send Message
								</motion.button>
								<motion.button
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									className="px-6 py-3 rounded-2xl glass border border-white/5 font-bold text-sm"
								>
									Share Profile
								</motion.button>
							</div>
						</div>
					</motion.div>

					{/* End of Profile Hero Card */}

					{/* Extended Details Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{[
							{ label: 'Full Username', value: user.username, icon: User, color: 'text-blue-400', bg: 'bg-blue-500/10' },
							{ label: 'Email Address', value: user.email, icon: Mail, color: 'text-purple-400', bg: 'bg-purple-500/10' },
							{ label: 'Account Created', value: joinedDate, icon: Calendar, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
							{ label: 'Identity Token', value: user._id, icon: Shield, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
						].map((item, idx) => (
							<motion.div
								key={item.label}
								initial={{ opacity: 0, scale: 0.95 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.1 * idx }}
								className="glass p-5 rounded-3xl border border-white/5 flex items-center gap-4 group"
							>
								<div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center ${item.color} border border-white/5`}>
									<item.icon size={20} />
								</div>
								<div className="flex-1 overflow-hidden">
									<p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{item.label}</p>
									<p className="text-sm font-bold truncate pr-4">{item.value}</p>
								</div>
								<button
									onClick={() => copyToClipboard(item.value)}
									className="p-2.5 rounded-xl hover:bg-white/5 text-gray-500 hover:text-white transition-colors"
								>
									{copied ? <Check size={16} /> : <Copy size={16} />}
								</button>
							</motion.div>
						))}
					</div>

					{/* Dangerous Area */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6"
					>
						<div className="text-center md:text-left">
							<h3 className="text-lg font-bold">Logout session</h3>
							<p className="text-sm text-gray-500">Sign out from this device and end current session</p>
						</div>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={handleLogout}
							className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-bold text-sm hover:bg-red-500 hover:text-white transition-all"
						>
							<LogOut size={18} />
							Terminate Session
						</motion.button>
					</motion.div>
				</div>
			</div>
		</div>
	);
}

export default Profile;
