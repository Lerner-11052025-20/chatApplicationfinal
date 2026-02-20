import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, UserX, Shield, User, Search, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BlockedUsers = () => {
    const [blockedList, setBlockedList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    const fetchBlockedUsers = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get("http://localhost:3334/api/user/blocked", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBlockedList(res.data.blockedUsers || []);
        } catch (err) {
            console.error("Fetch blocked failed:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlockedUsers();
    }, []);

    const handleUnblock = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await axios.post("http://localhost:3334/api/user/unblock", { targetUserId: id }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchBlockedUsers();
        } catch (err) {
            alert("Failed to unblock");
        }
    };

    const filtered = blockedList.filter(u =>
        u.username.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-dark-bg text-white p-6 md:p-12 font-sans overflow-hidden relative">
            {/* Gradient Background Blobs */}
            <div className="absolute top-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-blue-500/10 rounded-full blur-[120px] -z-10 animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[35rem] h-[35rem] bg-indigo-500/10 rounded-full blur-[120px] -z-10" />

            <div className="max-w-4xl mx-auto relative">
                <header className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-6">
                        <motion.button
                            whileHover={{ x: -5 }}
                            onClick={() => navigate('/profile')}
                            className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-gray-400 hover:text-white"
                        >
                            <ArrowLeft size={24} />
                        </motion.button>
                        <div>
                            <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-4">
                                Blocked Users
                                <span className="text-xs bg-red-500 text-white px-3 py-1 rounded-full font-black uppercase tracking-widest shadow-lg shadow-red-500/20">
                                    Privacy
                                </span>
                            </h1>
                            <p className="text-gray-500 font-medium mt-1">Manage restricted accounts and visibility controls.</p>
                        </div>
                    </div>
                </header>

                <div className="relative mb-8 group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search blocked contacts..."
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
                            <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Encrypting Directory...</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[400px] gap-6 text-center px-12">
                            <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center text-gray-700">
                                <Shield size={40} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">No Restrictions Found</h3>
                                <p className="text-gray-500 max-w-sm mx-auto">Your list is clean. You haven't blocked any users yet. All contacts can reach you.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="divide-y divide-white/5">
                            <AnimatePresence>
                                {filtered.map((u) => (
                                    <motion.div
                                        key={u._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="flex items-center justify-between p-8 hover:bg-white/[0.02] transition-colors group"
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-gray-800 to-gray-900 border border-white/10 flex items-center justify-center shadow-lg group-hover:border-blue-500/30 transition-all">
                                                {u.profilePic ? (
                                                    <img src={u.profilePic} className="w-full h-full object-cover rounded-2xl" />
                                                ) : (
                                                    <User size={28} className="text-gray-600" />
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white text-lg">{u.username}</h4>
                                                <p className="text-gray-500 text-sm">{u.email}</p>
                                            </div>
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleUnblock(u._id)}
                                            className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all shadow-xl"
                                        >
                                            Unblock Subject
                                        </motion.button>
                                    </motion.div>
                                ))}
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
