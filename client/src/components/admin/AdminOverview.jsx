import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Users,
    MessageSquare,
    ShieldCheck,
    Ghost,
    TrendingUp,
    Clock,
    UserX
} from 'lucide-react';
import StatCard from './StatCard';
import {
    LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar,
    PieChart, Pie, Cell
} from 'recharts';
import { API_URL } from "../../config/api";


const AdminOverview = () => {
    const [stats, setStats] = useState(null);
    const [msgData, setMsgData] = useState([]);
    const [userData, setUserData] = useState([]);
    const [activeTab, setActiveTab] = useState('messages');

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            try {
                const [s, m, u] = await Promise.all([
                    axios.get(`${API_URL}/api/admin/stats`, { headers }),
                    axios.get(`${API_URL}/api/admin/analytics/messages-per-day`, { headers }),
                    axios.get(`${API_URL}/api/admin/analytics/users-per-week`, { headers }),
                ]);
                setStats(s.data);
                setMsgData(m.data);
                setUserData(u.data);
            } catch (err) {
                console.error("Fetch stats failed:", err);
            }
        };
        fetchData();
    }, []);

    if (!stats) return <div className="text-gray-500 animate-pulse">Loading dashboard hardware...</div>;

    const COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b'];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-4xl font-black text-white mb-2 tracking-tight">System Overview</h1>
                <p className="text-gray-500 font-medium">Real-time platform metrics and growth tracking.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={Users} label="Total Users" value={stats.totalUsers} color="blue" />
                <StatCard icon={TrendingUp} label="Active Users (24h)" value={stats.activeUsers} color="green" />
                <StatCard icon={MessageSquare} label="Total Messages" value={stats.totalMessages} color="purple" />
                <StatCard icon={Clock} label="Messages Today" value={stats.messagesToday} color="orange" />
                <StatCard icon={ShieldCheck} label="Verified" value={stats.verifiedUsers} color="indigo" />
                <StatCard icon={UserX} label="Banned" value={stats.bannedUsers} color="red" />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Activity Chart */}
                <div className="lg:col-span-2 glass p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black text-white">Platform Activity</h3>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Global Message Volume</p>
                        </div>
                        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
                            <button
                                onClick={() => setActiveTab('messages')}
                                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${activeTab === 'messages' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'text-gray-500 hover:text-white'}`}
                            >
                                MESSAGES
                            </button>
                            <button
                                onClick={() => setActiveTab('users')}
                                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${activeTab === 'users' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'text-gray-500 hover:text-white'}`}
                            >
                                USERS
                            </button>
                        </div>
                    </div>

                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            {activeTab === 'messages' ? (
                                <AreaChart data={msgData}>
                                    <defs>
                                        <linearGradient id="colorMsg" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis dataKey="date" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px' }}
                                        itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
                                    />
                                    <Area type="monotone" dataKey="messages" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorMsg)" />
                                </AreaChart>
                            ) : (
                                <BarChart data={userData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis dataKey="week" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                        contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px' }}
                                    />
                                    <Bar dataKey="users" fill="#10b981" radius={[10, 10, 0, 0]} />
                                </BarChart>
                            )}
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Distribution Chart */}
                <div className="glass p-8 rounded-[2.5rem] border border-white/5 shadow-2xl flex flex-col items-center">
                    <div className="w-full mb-8">
                        <h3 className="text-xl font-black text-white">Trust Distribution</h3>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Banned vs Verified</p>
                    </div>

                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Banned', value: stats.bannedUsers || 0 },
                                        { name: 'Verified', value: stats.verifiedUsers || 0 },
                                        { name: 'Standard', value: stats.totalUsers - (stats.bannedUsers + stats.verifiedUsers) || 0 }
                                    ]}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {COLORS.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="w-full mt-4 space-y-4">
                        {[
                            { label: 'Banned Users', color: 'bg-red-500', value: stats.bannedUsers },
                            { label: 'Verified Users', color: 'bg-blue-500', value: stats.verifiedUsers },
                            { label: 'Unverified', color: 'bg-green-500', value: stats.totalUsers - (stats.bannedUsers + stats.verifiedUsers) },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                                    <span className="text-xs font-bold text-gray-400">{item.label}</span>
                                </div>
                                <span className="text-xs font-black text-white">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;
