import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Filter, Ban, RotateCcw, Trash2, ShieldCheck, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL } from "../../config/api";


const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchUsers = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get(`${API_URL}/api/admin/users?search=${search}&filter=${filter}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data.users);
        } catch (err) {
            console.error("Fetch users failed:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [search, filter]);

    const handleBanToggle = async (id, currentStatus) => {
        if (!window.confirm(`Are you sure you want to ${currentStatus ? 'unban' : 'ban'} this user?`)) return;
        const token = localStorage.getItem('token');
        try {
            await axios.put(`${API_URL}/api/admin/users/${id}/ban`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchUsers();
        } catch (err) {
            alert("Action failed: " + err.response?.data?.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("CRITICAL: Permanent delete user data. Proceed?")) return;
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`${API_URL}/api/admin/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchUsers();
        } catch (err) {
            alert("Delete failed");
        }
    };

    const handleVerifyToggle = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(`${API_URL}/api/admin/users/${id}/verify`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchUsers();
        } catch (err) {
            alert("Verification update failed");
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">User Management</h1>
                    <p className="text-gray-500 text-sm font-medium">Moderate directory and identity controls.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-white/5 border border-white/5 rounded-2xl py-3 pl-12 pr-6 text-sm text-white w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        />
                    </div>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="bg-white/5 border border-white/5 rounded-2xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="banned">Banned</option>
                        <option value="verified">Verified</option>
                    </select>
                </div>
            </div>

            <div className="glass rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                                <th className="px-8 py-6">Identity</th>
                                <th className="px-8 py-6">Joined</th>
                                <th className="px-8 py-6">Status</th>
                                <th className="px-8 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <AnimatePresence>
                                {users.map((user) => (
                                    <motion.tr
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        key={user._id}
                                        className="hover:bg-white/5 transition-colors group"
                                    >
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl overflow-hidden bg-gradient-to-tr from-blue-500/20 to-indigo-500/20 border border-white/10 flex items-center justify-center font-black text-blue-400">
                                                    {user.profilePic ? (
                                                        <img src={user.profilePic} className="w-full h-full object-cover" />
                                                    ) : (
                                                        user.username.charAt(0).toUpperCase()
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white flex items-center gap-2">
                                                        {user.username}
                                                        {user.isVerified && <ShieldCheck size={14} className="text-blue-500" />}
                                                    </div>
                                                    <div className="text-xs text-gray-500 font-medium">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="text-sm font-bold text-gray-400">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </div>
                                            <div className="text-[10px] text-gray-600 font-black uppercase">Standard Member</div>
                                        </td>
                                        <td className="px-8 py-5">
                                            {user.isBanned ? (
                                                <span className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black rounded-full uppercase">Banned</span>
                                            ) : (
                                                <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-black rounded-full uppercase">Active</span>
                                            )}
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleVerifyToggle(user._id)}
                                                    className={`p-2 rounded-xl border border-white/10 transition-all ${user.isVerified ? 'text-blue-500 bg-blue-500/10' : 'text-gray-400 hover:text-blue-400'}`}
                                                    title={user.isVerified ? "Remove Verification" : "Verify User"}
                                                >
                                                    <ShieldCheck size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleBanToggle(user._id, user.isBanned)}
                                                    className={`p-2 rounded-xl border border-white/10 transition-all ${user.isBanned ? 'text-green-500 hover:bg-green-500/10' : 'text-orange-400 hover:bg-orange-400/10'}`}
                                                    title={user.isBanned ? "Unban" : "Ban"}
                                                >
                                                    {user.isBanned ? <RotateCcw size={18} /> : <Ban size={18} />}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user._id)}
                                                    className="p-2 rounded-xl border border-white/10 text-red-500 hover:bg-red-500/10 transition-all"
                                                    title="Delete User"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                    {!loading && users.length === 0 && (
                        <div className="p-20 text-center text-gray-500 font-bold italic">No subjects found in current query.</div>
                    )}
                </div>
            </div>
        </div >
    );
};

export default AdminUsers;
