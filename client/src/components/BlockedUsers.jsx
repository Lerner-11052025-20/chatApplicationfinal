import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, UserX, Shield, User, Search, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from "../config";


const BlockedUsers = () => {
    const [blockedList, setBlockedList] = useState([]);
    const [reportedList, setReportedList] = useState([]);
    const [activityList, setActivityList] = useState([]);
    const [activeTab, setActiveTab] = useState('blocked');
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [isGlobalView, setIsGlobalView] = useState(false);
    const navigate = useNavigate();

    const fetchBlockedUsers = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get(`${API_BASE_URL}/api/user/blocked`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBlockedList(res.data.blockedUsers || []);
        } catch (err) {
            console.error("Fetch blocked failed:", err);
            setBlockedList([]);
        }
    };

    const fetchReportedUsers = async () => {
        const token = localStorage.getItem('token');
        try {
            // Support global view for admins
            const endpoint = isGlobalView ? `${API_BASE_URL}/api/admin/reports` : `${API_BASE_URL}/api/report`;
            const res = await axios.get(endpoint, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReportedList(res.data.reports || res.data.allReports || []);
        } catch (err) {
            console.error("Fetch reports failed:", err);
            setReportedList([]);
        }
    };

    const fetchActivityLogs = async () => {
        const token = localStorage.getItem('token');
        try {
            const endpoint = isGlobalView ? `${API_BASE_URL}/api/admin/audit` : `${API_BASE_URL}/api/user/activity`;
            const res = await axios.get(endpoint, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setActivityList(res.data.logs || []);
        } catch (err) {
            console.error("Fetch activity failed:", err);
            setActivityList([]);
        }
    };

    const checkAdmin = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get(`${API_BASE_URL}/api/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsAdmin(res.data.role === 'admin');
        } catch (err) {
            console.error("Check admin failed:", err);
        }
    };

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            await Promise.all([fetchBlockedUsers(), fetchReportedUsers(), fetchActivityLogs(), checkAdmin()]);
            setLoading(false);
        };
        init();
    }, [isGlobalView]);

    const handleUnblock = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await axios.post(`${API_BASE_URL}/api/user/unblock`, { targetUserId: id }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchBlockedUsers();
            fetchActivityLogs();
        } catch (err) {
            alert("Failed to unblock");
        }
    };

    const filteredBlocked = blockedList.filter(u =>
        (u?.username || "").toLowerCase().includes(search.toLowerCase()) ||
        (u?.email || "").toLowerCase().includes(search.toLowerCase())
    );

    const filteredReported = reportedList.filter(r =>
        (r?.reportedUser?.username || "").toLowerCase().includes(search.toLowerCase()) ||
        (r?.reason || "").toLowerCase().includes(search.toLowerCase()) ||
        (r?.reporter?.username || "").toLowerCase().includes(search.toLowerCase())
    );

    const filteredActivity = activityList.filter(l =>
        (l?.admin?.username || "").toLowerCase().includes(search.toLowerCase()) ||
        (l?.targetUser?.username || "").toLowerCase().includes(search.toLowerCase()) ||
        (l?.action || "").toLowerCase().includes(search.toLowerCase())
    );

    const items = activeTab === 'blocked' ? filteredBlocked : activeTab === 'reported' ? filteredReported : filteredActivity;

    return (
        <div className="min-h-screen bg-dark-bg text-white p-6 md:p-12 font-sans overflow-hidden relative">
            {/* Gradient Background Blobs */}
            <div className="absolute top-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-blue-500/10 rounded-full blur-[120px] -z-10 animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[35rem] h-[35rem] bg-indigo-500/10 rounded-full blur-[120px] -z-10" />

            <div className="max-w-4xl mx-auto relative">
                <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                    <div className="flex items-center gap-6">
                        <motion.button
                            whileHover={{ x: -5 }}
                            onClick={() => navigate('/dashboard')}
                            className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-gray-400 hover:text-white"
                        >
                            <ArrowLeft size={24} />
                        </motion.button>
                        <div>
                            <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-4">
                                {isGlobalView ? "Admin Protocol" : "Privacy Hub"}
                                <span className={`text-xs ${isGlobalView ? 'bg-purple-600' : 'bg-red-500'} text-white px-3 py-1 rounded-full font-black uppercase tracking-widest shadow-lg shadow-red-500/20`}>
                                    {isGlobalView ? 'Global' : 'Security'}
                                </span>
                            </h1>
                            <p className="text-gray-500 font-medium mt-1">
                                {isGlobalView ? "Monitoring protocol logs and network security." : "Manage restricted accounts and visibility controls."}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {isAdmin && (activeTab === 'reported' || activeTab === 'activity') && (
                            <button
                                onClick={() => setIsGlobalView(!isGlobalView)}
                                className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${isGlobalView ? 'bg-purple-600/20 border-purple-500 text-purple-400' : 'glass border-white/10 text-gray-500 hover:text-white'}`}
                            >
                                {isGlobalView ? 'Personal View' : 'Global View (Admin)'}
                            </button>
                        )}
                        <div className="flex p-1.5 bg-white/5 border border-white/10 rounded-2xl">
                            <button
                                onClick={() => { setActiveTab('blocked'); setIsGlobalView(false); }}
                                className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'blocked' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                            >
                                Blocked
                            </button>
                            <button
                                onClick={() => setActiveTab('reported')}
                                className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'reported' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                            >
                                Reports
                            </button>
                            <button
                                onClick={() => setActiveTab('activity')}
                                className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'activity' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                            >
                                Activity
                            </button>
                        </div>
                    </div>
                </header>

                <div className="relative mb-8 group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder={activeTab === 'blocked' ? "Search blocked contacts..." : activeTab === 'reported' ? "Search reporting history..." : "Search action logs..."}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white/5 border border-white/5 rounded-[2rem] py-5 pl-16 pr-8 text-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all text-lg font-medium placeholder:text-gray-600 shadow-2xl"
                    />
                </div>

                <div className="glass rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl min-h-[400px]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-[400px] gap-4">
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                                <Loader2 size={40} className="text-blue-500" />
                            </motion.div>
                            <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Accessing Secure Directory...</p>
                        </div>
                    ) : items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[400px] gap-6 text-center px-12">
                            <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center text-gray-700">
                                <Shield size={40} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">No Restrictions Found</h3>
                                <p className="text-gray-500 max-w-sm mx-auto">
                                    {isGlobalView ? "The network is clean. No global logs found." : `Your list is clean. No activity found.`}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="divide-y divide-white/5">
                            <AnimatePresence mode='wait'>
                                <motion.div
                                    key={`${activeTab}-${isGlobalView}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="divide-y divide-white/5"
                                >
                                    {activeTab === 'activity' ? (
                                        items.map((log) => (
                                            <div key={log._id} className="p-8 hover:bg-white/[0.02] transition-colors group flex items-center justify-between border-b border-white/5 last:border-b-0">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-gray-800 to-gray-900 border border-white/10 flex items-center justify-center text-blue-500/60 shadow-lg">
                                                        {log.action.includes('BAN') ? <Shield size={20} className="text-red-500" /> : <User size={20} />}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-black text-white text-lg">{log.admin?.username || "Unknown"}</span>
                                                            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">PERFORMED</span>
                                                            <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg ${log.action.includes('BAN') ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'}`}>
                                                                {log.action.replace('_', ' ')}
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-500 text-sm font-medium">
                                                            Target: <span className="text-gray-300 font-bold">{log.targetUser?.username || "System/Unknown"}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-white font-bold text-xs">{new Date(log.createdAt).toLocaleDateString()}</p>
                                                    <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest mt-1">{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        items.map((item) => {
                                            const u = activeTab === 'blocked' ? item : item.reportedUser;
                                            if (!u) return null;

                                            return (
                                                <div
                                                    key={item._id}
                                                    className="flex items-center justify-between p-8 hover:bg-white/[0.02] transition-colors group"
                                                >
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-gray-800 to-gray-900 border border-white/10 flex items-center justify-center shadow-lg group-hover:border-blue-500/30 transition-all overflow-hidden">
                                                            {u.profilePic ? (
                                                                <img src={u.profilePic} className="w-full h-full object-cover" alt="" />
                                                            ) : (
                                                                <div className="text-gray-600 font-black text-xl">{u.username?.[0]?.toUpperCase()}</div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-white text-lg flex items-center gap-2">
                                                                {u.username}
                                                                {isGlobalView && <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded border border-white/5">SUBJECT</span>}
                                                            </h4>
                                                            <p className="text-gray-500 text-sm">
                                                                {activeTab === 'blocked' ? u.email : (
                                                                    <span className="flex flex-col gap-1">
                                                                        <span className="flex items-center gap-2">
                                                                            <span className="px-2 py-0.5 rounded-md bg-red-500/10 text-red-400 text-[10px] font-black uppercase tracking-widest">{item.reason}</span>
                                                                            <span>•</span>
                                                                            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                                                        </span>
                                                                        {isGlobalView && (
                                                                            <span className="text-[10px] text-gray-600">Reported by: <span className="text-blue-400/80">{item.reporter?.username}</span></span>
                                                                        )}
                                                                    </span>
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {activeTab === 'blocked' ? (
                                                        <motion.button
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => handleUnblock(u._id)}
                                                            className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all shadow-xl"
                                                        >
                                                            Unblock Subject
                                                        </motion.button>
                                                    ) : (
                                                        <div className={`px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${item.status === 'pending' ? 'text-yellow-500' : 'text-emerald-500'}`}>
                                                            {item.status}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                <p className="mt-8 text-center text-gray-600 text-[10px] font-black uppercase tracking-[0.2em]">
                    End-to-End Privacy Controls • Active Session Verified
                </p>
            </div>
        </div>
    );
};

export default BlockedUsers;
