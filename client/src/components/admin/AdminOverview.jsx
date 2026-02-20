import React, { useEffect, useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import {
    Users, MessageSquare, ShieldCheck, TrendingUp, Clock, UserX,
    ArrowUpRight, Activity, Zap, BarChart3, LineChart as LineChartIcon
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell, Legend, LineChart, Line, ComposedChart
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../../config';
import StatCard from './StatCard';

/* ── Enhanced Custom Tooltip ── */
const CustomTooltip = ({ active, payload, label, accentColor = '#3b82f6' }) => {
    if (!active || !payload?.length) return null;
    const data = payload[0];
    
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -8 }}
            style={{
                background: 'rgba(5,3,22,0.98)',
                border: `1.5px solid ${accentColor}40`,
                borderRadius: 16,
                padding: '12px 16px',
                backdropFilter: 'blur(20px)',
                boxShadow: `0 16px 32px rgba(0,0,0,0.4), 0 0 20px ${accentColor}20`,
            }}
        >
            <p style={{ color: '#9ca3af', fontSize: 11, marginBottom: 6, fontWeight: 600 }}>
                {label}
            </p>
            <p style={{
                color: accentColor,
                fontWeight: 900,
                fontSize: 16,
                textShadow: `0 0 8px ${accentColor}40`,
            }}>
                {data.value?.toLocaleString?.() ?? data.value}
            </p>
        </motion.div>
    );
};

const AdminOverview = () => {
    const [stats, setStats] = useState(null);
    const [msgData, setMsgData] = useState([]);
    const [userData, setUserData] = useState([]);
    const [activeTab, setActiveTab] = useState('messages');
    const [isLoading, setIsLoading] = useState(true);

    // Memoize chart data calculations
    const chartDisplayData = useMemo(() => {
        if (activeTab === 'messages') return msgData;
        return userData;
    }, [activeTab, msgData, userData]);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        try {
            const [s, m, u] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/admin/stats`, { headers }),
                axios.get(`${API_BASE_URL}/api/admin/analytics/messages-per-day`, { headers }),
                axios.get(`${API_BASE_URL}/api/admin/analytics/users-per-week`, { headers }),
            ]);
            setStats(s.data);
            setMsgData(m.data || []);
            setUserData(u.data || []);
        } catch (err) {
            console.error('Fetch stats failed:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (!stats || isLoading) {
        return (
            <div className="space-y-8">
                <motion.div
                    className="h-10 w-64 rounded-xl bg-gradient-to-r from-white/10 to-white/5 animate-pulse"
                />
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="h-32 rounded-2xl bg-gradient-to-br from-white/8 to-white/3 animate-pulse"
                            style={{ animationDelay: `${i * 50}ms` }}
                        />
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <motion.div className="lg:col-span-2 h-80 rounded-2xl bg-gradient-to-br from-white/8 to-white/3 animate-pulse" />
                    <motion.div className="h-80 rounded-2xl bg-gradient-to-br from-white/8 to-white/3 animate-pulse" />
                </div>
            </div>
        );
    }

    const statCards = [
        { icon: Users, label: 'Total Users', value: stats.totalUsers, accent: '#3b82f6', color: 'blue', trend: { value: '12', positive: true } },
        { icon: TrendingUp, label: 'Active (24h)', value: stats.activeUsers, accent: '#10b981', color: 'green', trend: { value: '8', positive: true } },
        { icon: MessageSquare, label: 'Total Messages', value: stats.totalMessages, accent: '#8b5cf6', color: 'purple', trend: { value: '23', positive: true } },
        { icon: Clock, label: 'Messages Today', value: stats.messagesToday, accent: '#f59e0b', color: 'orange', trend: { value: '5', positive: true } },
        { icon: ShieldCheck, label: 'Verified Users', value: stats.verifiedUsers, accent: '#06b6d4', color: 'cyan', trend: { value: '3', positive: true } },
        { icon: UserX, label: 'Banned Users', value: stats.bannedUsers, accent: '#ef4444', color: 'red', trend: { value: '-2', positive: false } },
    ];

    const pieData = [
        { name: 'Banned', value: stats.bannedUsers || 0 },
        { name: 'Verified', value: stats.verifiedUsers || 0 },
        { name: 'Standard', value: Math.max(0, stats.totalUsers - (stats.bannedUsers + stats.verifiedUsers)) },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
            >
                <div className="flex items-center gap-3 mb-2">
                    <motion.div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                        style={{
                            background: 'linear-gradient(135deg, #ef4444, #f59e0b)',
                            boxShadow: '0 8px 24px rgba(239,68,68,0.3)',
                        }}
                        whileHover={{ scale: 1.1 }}
                    >
                        <Activity size={18} className="text-white" />
                    </motion.div>
                    <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">System Overview</h1>
                </div>
                <p className="text-gray-400 text-sm md:text-base font-medium ml-14">
                    Real-time platform metrics, user activity, and growth analytics
                </p>
            </motion.div>

            {/* Stat Grid - High Performance */}
            <motion.div
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.05, delayChildren: 0.1 }}
            >
                {statCards.map((card, i) => (
                    <StatCard
                        key={card.label}
                        {...card}
                        delay={i * 0.08}
                    />
                ))}
            </motion.div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4, ease: 'easeOut' }}
                    className="lg:col-span-2 rounded-2xl border border-white/6 overflow-hidden shadow-2xl group"
                    style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.015) 100%)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.1)',
                    }}
                >
                    <div className="p-6 pb-4">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <motion.h3
                                    className="text-xl font-black text-white flex items-center gap-2"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.35 }}
                                >
                                    {activeTab === 'messages' ? (
                                        <>
                                            <LineChartIcon size={18} className="text-blue-400" />
                                            Message Analytics
                                        </>
                                    ) : (
                                        <>
                                            <BarChart3 size={18} className="text-green-400" />
                                            User Growth
                                        </>
                                    )}
                                </motion.h3>
                                <motion.p
                                    className="text-[12px] text-gray-500 uppercase tracking-wider font-bold mt-1"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    {activeTab === 'messages' ? 'Daily Message Volume' : 'Weekly User Registrations'}
                                </motion.p>
                            </div>

                            {/* Tab Toggle */}
                            <motion.div
                                className="flex p-1.5 rounded-xl gap-2"
                                style={{
                                    background: 'rgba(255,255,255,0.06)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.05)',
                                }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                {['messages', 'users'].map((tab) => (
                                    <motion.button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                                            activeTab === tab ? 'text-white' : 'text-gray-500 hover:text-gray-400'
                                        }`}
                                        style={activeTab === tab ? {
                                            background: tab === 'messages' ? '#3b82f6' : '#10b981',
                                            boxShadow: `0 6px 16px ${tab === 'messages' ? 'rgba(59,130,246,0.4)' : 'rgba(16,185,129,0.4)'}`,
                                        } : {}}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    </motion.button>
                                ))}
                            </motion.div>
                        </div>

                        {/* Chart Container */}
                        <div className="h-[320px] w-full -mx-6 px-6">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="h-full"
                                >
                                    <ResponsiveContainer width="100%" height="100%">
                                        {activeTab === 'messages' ? (
                                            <AreaChart data={chartDisplayData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                                                <defs>
                                                    <linearGradient id="msgGrad" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                                                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.02} />
                                                    </linearGradient>
                                                    <linearGradient id="msgGrad2" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.01} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    stroke="rgba(255,255,255,0.06)"
                                                    vertical={false}
                                                    strokeOpacity={0.8}
                                                />
                                                <XAxis
                                                    dataKey="date"
                                                    stroke="#6b7280"
                                                    fontSize={11}
                                                    tickLine={false}
                                                    axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                                                />
                                                <YAxis
                                                    stroke="#6b7280"
                                                    fontSize={11}
                                                    tickLine={false}
                                                    axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                                                    width={40}
                                                />
                                                <Tooltip content={<CustomTooltip accentColor="#3b82f6" />} />
                                                <Area
                                                    type="monotone"
                                                    dataKey="messages"
                                                    stroke="#3b82f6"
                                                    strokeWidth={3}
                                                    fill="url(#msgGrad)"
                                                    dot={false}
                                                    activeDot={{ r: 6, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                                                    isAnimationActive={true}
                                                />
                                            </AreaChart>
                                        ) : (
                                            <BarChart data={chartDisplayData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }} barSize={32}>
                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    stroke="rgba(255,255,255,0.06)"
                                                    vertical={false}
                                                    strokeOpacity={0.8}
                                                />
                                                <XAxis
                                                    dataKey="week"
                                                    stroke="#6b7280"
                                                    fontSize={11}
                                                    tickLine={false}
                                                    axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                                                />
                                                <YAxis
                                                    stroke="#6b7280"
                                                    fontSize={11}
                                                    tickLine={false}
                                                    axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                                                    width={40}
                                                />
                                                <Tooltip content={<CustomTooltip accentColor="#10b981" />} />
                                                <Bar
                                                    dataKey="users"
                                                    fill="#10b981"
                                                    radius={[10, 10, 4, 4]}
                                                    fillOpacity={0.8}
                                                    animationDuration={800}
                                                    animationEasing="ease-out"
                                                />
                                            </BarChart>
                                        )}
                                    </ResponsiveContainer>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>

                {/* User Distribution Pie Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.4, ease: 'easeOut' }}
                    className="rounded-2xl border border-white/6 overflow-hidden shadow-2xl group"
                    style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.015) 100%)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.1)',
                    }}
                >
                    <div className="p-6 pb-4 flex flex-col h-full">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                            <h3 className="text-lg font-black text-white mb-1">User Status Distribution</h3>
                            <p className="text-[11px] text-gray-500 uppercase tracking-wider font-bold">Trust & Verification Breakdown</p>
                        </motion.div>

                        <div className="flex-1 min-h-[220px] flex items-center justify-center -mx-6">
                            <ResponsiveContainer width="100%" height={220}>
                                <PieChart margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                                    <Pie
                                        data={pieData}
                                        dataKey="value"
                                        innerRadius="55%"
                                        outerRadius="85%"
                                        paddingAngle={2}
                                        strokeWidth={0}
                                        animationDuration={800}
                                        animationEasing="ease-out"
                                    >
                                        {pieData.map((_, i) => (
                                            <Cell
                                                key={i}
                                                fill={['#ef4444', '#3b82f6', '#10b981'][i]}
                                                fillOpacity={0.85}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <motion.div
                            className="space-y-3 mt-4"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.45 }}
                        >
                            {[
                                { label: 'Banned Users', color: '#ef4444', value: stats.bannedUsers },
                                { label: 'Verified Users', color: '#3b82f6', value: stats.verifiedUsers },
                                { label: 'Standard Users', color: '#10b981', value: Math.max(0, stats.totalUsers - (stats.bannedUsers + stats.verifiedUsers)) },
                            ].map((item, idx) => (
                                <motion.div
                                    key={item.label}
                                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-white/5 transition-colors"
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.45 + idx * 0.05 }}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <motion.div
                                            className="w-3 h-3 rounded-full"
                                            style={{ background: item.color }}
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 2, repeat: Infinity, delay: idx * 0.3 }}
                                        />
                                        <span className="text-xs font-semibold text-gray-400">{item.label}</span>
                                    </div>
                                    <motion.span
                                        className="text-sm font-black text-white"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 + idx * 0.05 }}
                                    >
                                        {item.value.toLocaleString()}
                                    </motion.span>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminOverview;
