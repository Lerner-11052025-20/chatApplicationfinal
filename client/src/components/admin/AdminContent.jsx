import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, ShieldAlert, MessageCircle, AlertCircle, Flag, UserX, CheckCircle, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminContent = () => {
    const [messages, setMessages] = useState([]);
    const [reports, setReports] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('messages'); // 'messages' or 'reports'

    const fetchContent = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            if (activeTab === 'messages') {
                const res = await axios.get(`http://localhost:3334/api/admin/messages?filter=${filter}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessages(res.data.messages);
            } else {
                const res = await axios.get(`http://localhost:3334/api/admin/reports`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setReports(res.data.reports);
            }
        } catch (err) {
            console.error("Fetch content failed:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContent();
    }, [filter, activeTab]);

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this message for security/moderation purposes?")) return;
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:3334/api/admin/messages/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchContent();
        } catch (err) {
            alert("Delete failed");
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Content Moderation</h1>
                    <p className="text-gray-500 text-sm font-medium">Verify conversations and remove violations.</p>
                </div>

                <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5 w-fit">
                    {['messages', 'reports'].map((t) => (
                        <button
                            key={t}
                            onClick={() => setActiveTab(t)}
                            className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all uppercase tracking-widest ${activeTab === t ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-500 hover:text-white'}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'messages' ? (
                    <motion.div
                        key="messages-panel"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-1 gap-4"
                    >
                        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5 w-fit mb-4">
                            {['all', 'pinned', 'deleted'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest ${filter === f ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-gray-500'}`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>

                        {loading ? (
                            <div className="glass p-12 rounded-[2rem] text-center text-gray-500 font-bold animate-pulse">Scanning database...</div>
                        ) : messages.length === 0 ? (
                            <div className="glass p-12 rounded-[2rem] text-center text-gray-500 font-bold italic">No message flags reported. System is nominal.</div>
                        ) : (
                            messages.map((msg) => (
                                <div key={msg._id} className="glass p-6 rounded-3xl border border-white/5 hover:border-red-500/20 transition-all group flex items-start gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0">
                                        <MessageCircle size={24} className="text-gray-400 group-hover:text-red-400 transition-colors" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="font-black text-white text-sm">{msg.sender?.username || 'Unknown'}</span>
                                                <span className="text-[10px] font-black text-gray-600 uppercase bg-white/5 px-2 py-0.5 rounded-lg border border-white/5">
                                                    {msg.sender?.email}
                                                </span>
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-500">{new Date(msg.createdAt).toLocaleString()}</span>
                                        </div>
                                        <p className={`text-sm leading-relaxed ${msg.isDeleted ? 'text-gray-600 italic font-medium' : 'text-gray-300'}`}>
                                            {msg.content}
                                        </p>
                                        <div className="mt-4 flex items-center gap-4">
                                            {msg.isPinned && (
                                                <span className="flex items-center gap-1.5 text-[9px] font-black text-blue-500 uppercase tracking-widest">
                                                    <AlertCircle size={10} /> Pinned Content
                                                </span>
                                            )}
                                            {msg.isDeleted && (
                                                <span className="flex items-center gap-1.5 text-[10px] font-black text-red-500 uppercase tracking-widest">
                                                    <ShieldAlert size={10} /> Redacted
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        disabled={msg.isDeleted}
                                        onClick={() => handleDelete(msg._id)}
                                        className={`p-3 rounded-2xl border border-white/5 transition-all self-center ${msg.isDeleted ? 'opacity-20 cursor-not-allowed' : 'text-red-400 hover:bg-red-500/10 hover:border-red-500/20'}`}
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            ))
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        key="reports-panel"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-1 gap-4"
                    >
                        {loading ? (
                            <div className="glass p-12 rounded-[2rem] text-center text-gray-500 font-bold animate-pulse">Fetching incident reports...</div>
                        ) : reports.length === 0 ? (
                            <div className="glass p-12 rounded-[2rem] text-center text-gray-500 font-bold italic">Clean slate. No pending reports found.</div>
                        ) : (
                            reports.map((report) => (
                                <div key={report._id} className="glass p-6 rounded-3xl border border-white/5 hover:border-yellow-500/20 transition-all group">
                                    <div className="flex items-start justify-between gap-6 mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500">
                                                <Flag size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white text-base">{report.reason}</h4>
                                                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-0.5">
                                                    Reported by: <span className="text-white">{report.reporter?.username}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-600">{new Date(report.createdAt).toLocaleString()}</span>
                                    </div>

                                    <div className="bg-white/3 border border-white/5 rounded-2xl p-4 mb-6">
                                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest text-[9px] mb-2">Reported Subject</p>
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center font-bold text-blue-400 text-xs text-uppercase">
                                                {report.reportedUser?.username?.[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white">{report.reportedUser?.username}</p>
                                                <p className="text-[10px] text-gray-500">{report.reportedUser?.email}</p>
                                            </div>
                                            {report.reportedUser?.isBanned && (
                                                <span className="ml-auto px-2 py-0.5 bg-red-500/10 border border-red-500/20 text-red-500 text-[8px] font-black rounded uppercase">Banned</span>
                                            )}
                                        </div>
                                        <div className="h-px bg-white/5 w-full my-3" />
                                        <p className="text-sm text-gray-300 italic leading-relaxed">
                                            "{report.description || "No additional description provided."}"
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-end gap-3">
                                        <button
                                            onClick={() => {/* Mark Reviewed */ }}
                                            className="px-4 py-2 rounded-xl border border-white/5 text-xs font-black text-gray-400 hover:text-white transition-all uppercase"
                                        >
                                            Mark Reviewed
                                        </button>
                                        <button
                                            disabled={report.reportedUser?.isBanned}
                                            onClick={() => {/* Trigger Ban */ }}
                                            className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-black hover:bg-red-500 hover:text-white transition-all uppercase"
                                        >
                                            Take Action
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminContent;
