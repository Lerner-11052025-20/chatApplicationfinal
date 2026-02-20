import React, { useEffect, useState, useCallback, useMemo, memo } from "react";
import axios from "axios";
import {
    Trash2, MessageSquare, Search, AlertTriangle,
    Clock, User, Hash, MessageCircle, Filter,
    RefreshCw, ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE_URL } from "../../config";

/* ─── Gradient helpers ───────────────────────────────────────── */
const GRADIENTS = [
    ["#8b5cf6", "#a78bfa"],
    ["#06b6d4", "#3b82f6"],
    ["#f97316", "#ef4444"],
    ["#10b981", "#22d3ee"],
    ["#ec4899", "#f43f5e"],
    ["#f59e0b", "#f97316"],
];
const getGrad = (name = "") => GRADIENTS[(name.charCodeAt(0) || 0) % GRADIENTS.length];

/* ─── Confirmation Modal ─────────────────────────────────────── */
function ConfirmModal({ open, onConfirm, onCancel, msgPreview }) {
    return (
        <AnimatePresence>
            {open && (
                <motion.div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <motion.div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onCancel} />
                    <motion.div
                        className="relative w-full max-w-sm rounded-3xl overflow-hidden border border-white/10"
                        style={{
                            background: "linear-gradient(135deg,rgba(15,10,40,0.98),rgba(5,5,25,0.98))",
                            boxShadow: "0 30px 80px rgba(0,0,0,0.8)",
                        }}
                        initial={{ scale: 0.85, y: 30, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.85, y: 30, opacity: 0 }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                    >
                        <div className="h-1 w-full" style={{ background: "#ef4444" }} />
                        <div className="p-7">
                            <div className="w-13 h-13 rounded-2xl flex items-center justify-center mx-auto mb-5"
                                style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.25)", width: 52, height: 52 }}>
                                <AlertTriangle size={22} style={{ color: "#ef4444" }} />
                            </div>
                            <h3 className="text-lg font-black text-white text-center mb-2">Delete Message?</h3>
                            {msgPreview && (
                                <p className="text-xs text-gray-500 text-center mb-4 px-2 line-clamp-2 italic">
                                    "{msgPreview}"
                                </p>
                            )}
                            <p className="text-sm text-gray-400 text-center mb-7">This message will be permanently removed.</p>
                            <div className="flex gap-3">
                                <button onClick={onCancel}
                                    className="flex-1 py-2.5 rounded-2xl text-sm font-semibold text-gray-400 border border-white/10 hover:bg-white/6 transition-all">
                                    Cancel
                                </button>
                                <button onClick={onConfirm}
                                    className="flex-1 py-2.5 rounded-2xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
                                    style={{ background: "linear-gradient(135deg,#ef4444,#dc2626)" }}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

/* ─── Skeleton ───────────────────────────────────────────────── */
function SkeletonRow() {
    return (
        <div className="rounded-2xl border border-white/6 p-5 animate-pulse flex gap-4 items-start"
            style={{ background: "rgba(255,255,255,0.02)" }}>
            <div className="w-10 h-10 rounded-2xl bg-white/8 shrink-0" />
            <div className="flex-1 space-y-2.5">
                <div className="flex gap-3 items-center">
                    <div className="h-3 w-24 bg-white/8 rounded-full" />
                    <div className="h-2.5 w-20 bg-white/5 rounded-full" />
                </div>
                <div className="h-2.5 w-3/4 bg-white/5 rounded-full" />
                <div className="h-2.5 w-1/2 bg-white/4 rounded-full" />
            </div>
            <div className="w-8 h-8 rounded-xl bg-white/6 shrink-0" />
        </div>
    );
}

/* ─── Message Row Card ───────────────────────────────────────── */
const MessageCard = memo(({ message, onDelete, index }) => {
    const [g1, g2] = useMemo(() => getGrad(message.sender?.username || ""), [message.sender?.username]);
    const [expanded, setExpanded] = useState(false);
    const content = message.content || "";
    const isLong = content.length > 120;
    const displayContent = isLong && !expanded ? content.slice(0, 120) + "…" : content;

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.28, delay: index * 0.03 }}
            className="group relative rounded-2xl border border-white/6 overflow-hidden transition-all duration-300 hover:border-white/12"
            style={{
                background: "linear-gradient(135deg,rgba(255,255,255,0.035) 0%,rgba(255,255,255,0.01) 100%)",
            }}
            whileHover={{ y: -1, boxShadow: "0 10px 32px rgba(0,0,0,0.35)" }}
        >
            {/* Left accent bar on hover */}
            <div className="absolute left-0 top-0 bottom-0 w-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-l-full"
                style={{ background: `linear-gradient(180deg, ${g1}, ${g2})` }} />

            <div className="p-5">
                <div className="flex gap-3 items-start">
                    {/* Avatar */}
                    <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-sm shrink-0 shadow-lg"
                        style={{ background: `linear-gradient(135deg,${g1},${g2})`, boxShadow: `0 4px 14px ${g1}40` }}
                    >
                        {message.sender?.username?.charAt(0).toUpperCase() || "?"}
                    </div>

                    {/* Body */}
                    <div className="flex-1 min-w-0">
                        {/* Name + timestamp */}
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="text-sm font-bold text-white">
                                {message.sender?.username || "Unknown User"}
                            </span>
                            <div className="flex items-center gap-1 text-[11px] text-gray-500">
                                <Clock size={10} />
                                <span>{new Date(message.createdAt).toLocaleString()}</span>
                            </div>
                            {message.sender?.isVerified && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                                    style={{ background: "rgba(16,185,129,0.12)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)" }}>
                                    ✓ Verified
                                </span>
                            )}
                        </div>

                        {/* Message content */}
                        <p className="text-sm text-gray-300 leading-relaxed">
                            {displayContent}
                        </p>
                        {isLong && (
                            <button
                                onClick={() => setExpanded(e => !e)}
                                className="flex items-center gap-1 mt-1.5 text-[11px] font-semibold transition-colors"
                                style={{ color: g1 }}
                            >
                                {expanded ? "Show less" : "Show more"}
                                <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                    <ChevronDown size={12} />
                                </motion.div>
                            </button>
                        )}
                    </div>

                    {/* Delete button */}
                    <motion.button
                        onClick={() => onDelete(message._id, content)}
                        className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
                        style={{ background: "rgba(239,68,68,0.12)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" }}
                        whileHover={{ scale: 1.12, background: "rgba(239,68,68,0.25)" }}
                        whileTap={{ scale: 0.9 }}
                        title="Delete message"
                    >
                        <Trash2 size={14} />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
});

/* ─── Stat Card ──────────────────────────────────────────────── */
function StatCard({ label, value, color, icon: Icon }) {
    return (
        <motion.div
            className="flex items-center gap-3 px-5 py-3.5 rounded-2xl border border-white/6"
            style={{ background: "rgba(255,255,255,0.03)" }}
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${color}18`, color }}>
                <Icon size={16} />
            </div>
            <div>
                <div className="text-xl font-black text-white leading-none">{value}</div>
                <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mt-0.5">{label}</div>
            </div>
        </motion.div>
    );
}

/* ─── Main Component ─────────────────────────────────────────── */
export default function AdminContent() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [deleting, setDeleting] = useState(null);
    const [modal, setModal] = useState({ open: false, id: null, preview: "" });
    const [refreshing, setRefreshing] = useState(false);

    const fetchMessages = useCallback(async (silent = false) => {
        if (!silent) setLoading(true);
        else setRefreshing(true);
        const token = localStorage.getItem("token");
        try {
            const res = await axios.get(`${API_BASE_URL}/api/admin/messages`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessages(res.data.messages || []);
        } catch (err) {
            console.error("Fetch messages error:", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => { fetchMessages(); }, [fetchMessages]);

    const handleDelete = (id, preview) => {
        setModal({ open: true, id, preview });
    };

    const confirmDelete = async () => {
        const id = modal.id;
        setModal({ open: false, id: null, preview: "" });
        setDeleting(id);
        const token = localStorage.getItem("token");
        try {
            await axios.delete(`${API_BASE_URL}/api/admin/messages/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessages(prev => prev.filter(m => m._id !== id));
        } catch (err) {
            console.error("Delete error:", err);
        } finally {
            setDeleting(null);
        }
    };

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        if (!q) return messages;
        return messages.filter(m =>
            (m.sender?.username || "").toLowerCase().includes(q) ||
            (m.content || "").toLowerCase().includes(q)
        );
    }, [messages, search]);

    const uniqueSenders = useMemo(() => new Set(messages.map(m => m.sender?._id)).size, [messages]);

    return (
        <>
            <ConfirmModal
                open={modal.open}
                msgPreview={modal.preview}
                onConfirm={confirmDelete}
                onCancel={() => setModal({ open: false, id: null, preview: "" })}
            />

            <div className="space-y-7">
                {/* ── Header ── */}
                <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div
                                className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-xl"
                                style={{ background: "linear-gradient(135deg,#8b5cf6,#a78bfa)", boxShadow: "0 10px 30px rgba(139,92,246,0.4)" }}
                            >
                                <MessageSquare size={20} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-white tracking-tight">Content Moderation</h1>
                                <p className="text-xs text-gray-500 mt-0.5">Review and remove messages from all conversations</p>
                            </div>
                        </div>

                        {/* Refresh button */}
                        <motion.button
                            onClick={() => fetchMessages(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-semibold text-gray-400 border border-white/8 hover:border-white/16 hover:text-white transition-all"
                            style={{ background: "rgba(255,255,255,0.03)" }}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            <motion.div animate={{ rotate: refreshing ? 360 : 0 }}
                                transition={{ duration: 0.7, repeat: refreshing ? Infinity : 0, ease: "linear" }}>
                                <RefreshCw size={14} />
                            </motion.div>
                            Refresh
                        </motion.button>
                    </div>
                </motion.div>

                {/* ── Stats Strip ── */}
                {!loading && (
                    <motion.div className="grid grid-cols-3 gap-3"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                        <StatCard label="Total Messages" value={messages.length} color="#8b5cf6" icon={MessageCircle} />
                        <StatCard label="Unique Senders" value={uniqueSenders} color="#3b82f6" icon={User} />
                        <StatCard label="Filtered Results" value={filtered.length} color="#10b981" icon={Filter} />
                    </motion.div>
                )}

                {/* ── Search ── */}
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                    <div className="relative max-w-md group">
                        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search by user or message content…"
                            className="w-full pl-9 pr-4 py-2.5 rounded-2xl text-sm text-white placeholder-gray-600 outline-none transition-all duration-300"
                            style={{
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.08)",
                            }}
                            onFocus={e => { e.target.style.borderColor = "rgba(139,92,246,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(139,92,246,0.1)"; }}
                            onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
                        />
                        {search && (
                            <button onClick={() => setSearch("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                                ×
                            </button>
                        )}
                    </div>
                </motion.div>

                {/* ── Message List ── */}
                {loading ? (
                    <div className="space-y-3">
                        {Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}
                    </div>
                ) : filtered.length === 0 ? (
                    <motion.div className="flex flex-col items-center justify-center py-20 text-center"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                            <MessageSquare size={28} className="text-gray-600" />
                        </div>
                        <p className="text-gray-500 font-semibold">No messages found</p>
                        <p className="text-gray-700 text-sm mt-1">
                            {search ? "Try a different search term" : "No messages have been sent yet"}
                        </p>
                    </motion.div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        <div className="space-y-3">
                            {filtered.map((msg, i) => (
                                <MessageCard
                                    key={msg._id}
                                    message={msg}
                                    index={i}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    </AnimatePresence>
                )}
            </div>
        </>
    );
}