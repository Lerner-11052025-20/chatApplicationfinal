import React, { useEffect, useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
    AreaChart, Area, LineChart, Line
} from 'recharts';
import { Users, Flame, TrendingUp, Zap, Activity, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../../config';

/* Enhanced Custom Tooltip */
const CustomTooltip = ({ active, payload, label, color = '#3b82f6' }) => {
    if (!active || !payload?.length) return null;
    const data = payload[0];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{
                background: 'rgba(5,3,22,0.98)',
                border: `1.5px solid ${color}40`,
                borderRadius: 16,
                padding: '12px 16px',
                backdropFilter: 'blur(20px)',
                boxShadow: `0 16px 32px rgba(0,0,0,0.4), 0 0 20px ${color}20`,
            }}
        >
            <p style={{
                color: '#9ca3af',
                fontSize: 11,
                marginBottom: 6,
                fontWeight: 600,
                textTransform: 'capitalize'
            }}>
                {label ?? data.payload?.username}
            </p>
            <p style={{
                color,
                fontWeight: 900,
                fontSize: 16,
                textShadow: `0 0 8px ${color}40`,
            }}>
                {data.value?.toLocaleString?.() ?? data.value}
            </p>
        </motion.div>
    );
};

const TOP_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#ef4444', '#f59e0b', '#10b981'];

const AdminAnalytics = () => {
    const [heatmap, setHeatmap] = useState([]);
    const [topUsers, setTopUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAnalytics = useCallback(async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        try {
            const [h, tu] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/admin/analytics/heatmap`, { headers }),
                axios.get(`${API_BASE_URL}/api/admin/analytics/most-active-users`, { headers }),
            ]);
            setHeatmap(h.data || []);
            setTopUsers(tu.data || []);
        } catch (err) {
            console.error('Fetch analytics failed:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    /* Memoized heatmap formatting */
    const heatmapData = useMemo(() => {
        const hours = Array.from({ length: 24 }, (_, i) => ({
            hour: `${String(i).padStart(2, '0')}:00`,
            count: 0,
            raw: i
        }));

        heatmap.forEach((d) => {
            const obj = hours.find((h) => h.raw === d._id.hour);
            if (obj) obj.count += d.count;
        });

        return hours;
    }, [heatmap]);

    const peakHour = useMemo(() => {
        if (heatmapData.length === 0) return null;
        return heatmapData.reduce((peak, curr) =>
            curr.count > peak.count ? curr : peak,
            heatmapData[0]
        );
    }, [heatmapData]);

    const maxUserCount = useMemo(() => {
        return Math.max(...topUsers.map(u => u.count || 0), 1);
    }, [topUsers]);

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
                            background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                            boxShadow: '0 8px 24px rgba(245,158,11,0.3)',
                        }}
                        whileHover={{ scale: 1.1 }}
                    >
                        <TrendingUp size={18} className="text-white" />
                    </motion.div>
                    <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Advanced Analytics</h1>
                </div>
                <p className="text-gray-400 text-sm md:text-base font-medium ml-14">
                    Deep behavioral analysis, engagement patterns, and user insights
                </p>
            </motion.div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Power Users Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.4, ease: 'easeOut' }}
                    className="rounded-2xl border border-white/6 overflow-hidden shadow-2xl group"
                    style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.015) 100%)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                    }}
                >
                    <div className="p-6">
                        {/* Header */}
                        <motion.div
                            className="flex items-center gap-3 mb-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <motion.div
                                className="p-3 rounded-xl flex-shrink-0"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(99,102,241,0.1))',
                                    border: '1px solid rgba(59,130,246,0.3)',
                                    boxShadow: '0 4px 12px rgba(59,130,246,0.2)',
                                }}
                                animate={{ rotate: [0, 10, 0] }}
                                transition={{ duration: 4, repeat: Infinity }}
                            >
                                <Users size={18} className="text-blue-400" />
                            </motion.div>
                            <div>
                                <h3 className="text-lg font-black text-white">Power Users</h3>
                                <p className="text-[11px] text-gray-500 uppercase tracking-wider font-bold mt-0.5">
                                    Most Active Members
                                </p>
                            </div>
                        </motion.div>

                        {/* Chart */}
                        <div className="h-[340px] -mx-6 px-6">
                            {loading ? (
                                <motion.div
                                    className="h-full flex items-center justify-center"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <div className="space-y-3 w-full">
                                        {[...Array(5)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                className="h-8 rounded-lg bg-gradient-to-r from-white/8 to-white/3 animate-pulse"
                                                style={{ width: `${70 + Math.random() * 30}%`, animationDelay: `${i * 100}ms` }}
                                            />
                                        ))}
                                    </div>
                                </motion.div>
                            ) : topUsers.length === 0 ? (
                                <motion.div
                                    className="h-full flex items-center justify-center text-center"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <p className="text-gray-500">No user data available</p>
                                </motion.div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={topUsers}
                                        layout="vertical"
                                        margin={{ top: 5, right: 20, left: 100, bottom: 5 }}
                                    >
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="rgba(255,255,255,0.06)"
                                            horizontal={true}
                                            vertical={false}
                                        />
                                        <XAxis type="number" stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} />
                                        <YAxis
                                            dataKey="username"
                                            type="category"
                                            stroke="#6b7280"
                                            fontSize={11}
                                            tickLine={false}
                                            axisLine={false}
                                            width={95}
                                        />
                                        <Tooltip content={<CustomTooltip color="#3b82f6" />} />
                                        <Bar dataKey="count" radius={[0, 12, 12, 0]} animationDuration={800}>
                                            {topUsers.map((_, i) => (
                                                <Cell
                                                    key={i}
                                                    fill={TOP_COLORS[i % TOP_COLORS.length]}
                                                    fillOpacity={0.8}
                                                />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>

                        {/* Leaderboard Mini-list */}
                        {!loading && topUsers.length > 0 && (
                            <motion.div
                                className="mt-6 pt-6 border-t border-white/6 space-y-3"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                {topUsers.slice(0, 3).map((u, i) => (
                                    <motion.div
                                        key={u.username}
                                        className="flex items-center gap-3 group"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.35 + i * 0.05 }}
                                        whileHover={{ x: 4 }}
                                    >
                                        {/* Rank */}
                                        <motion.div
                                            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 font-black text-white text-xs"
                                            style={{
                                                background: `linear-gradient(135deg, ${TOP_COLORS[i]}, ${TOP_COLORS[(i + 1) % TOP_COLORS.length]})`,
                                                boxShadow: `0 4px 12px ${TOP_COLORS[i]}25`,
                                            }}
                                            whileHover={{ scale: 1.15, rotate: 10 }}
                                        >
                                            {i === 0 ? '👑' : i + 1}
                                        </motion.div>

                                        {/* Name */}
                                        <span className="text-xs font-bold text-gray-300 flex-1 truncate">
                                            {u.username}
                                        </span>

                                        {/* Progress bar */}
                                        <div
                                            className="h-2 rounded-full flex-1 overflow-hidden"
                                            style={{ background: 'rgba(255,255,255,0.08)' }}
                                        >
                                            <motion.div
                                                className="h-full rounded-full transition-all"
                                                style={{ background: TOP_COLORS[i] }}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(u.count / maxUserCount) * 100}%` }}
                                                transition={{ delay: 0.4 + i * 0.05, duration: 0.6, ease: 'easeOut' }}
                                            />
                                        </div>

                                        {/* Count */}
                                        <span className="text-xs font-black text-white w-10 text-right">
                                            {u.count}
                                        </span>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                {/* Heatmap (Active Hours) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
                    className="rounded-2xl border border-white/6 overflow-hidden shadow-2xl group"
                    style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.015) 100%)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                    }}
                >
                    <div className="p-6">
                        {/* Header */}
                        <motion.div
                            className="flex items-center gap-3 mb-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.25 }}
                        >
                            <motion.div
                                className="p-3 rounded-xl flex-shrink-0"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(245,158,11,0.1))',
                                    border: '1px solid rgba(239,68,68,0.3)',
                                    boxShadow: '0 4px 12px rgba(245,158,11,0.2)',
                                }}
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <Flame size={18} className="text-red-400" />
                            </motion.div>
                            <div>
                                <h3 className="text-lg font-black text-white">Activity Heatmap</h3>
                                <p className="text-[11px] text-gray-500 uppercase tracking-wider font-bold mt-0.5">
                                    Message Volume by Hour (UTC)
                                </p>
                            </div>
                        </motion.div>

                        {/* Chart */}
                        <div className="h-[340px] -mx-6 px-6">
                            {loading ? (
                                <motion.div className="h-full flex items-center justify-center">
                                    <div className="space-y-2 w-full">
                                        {[...Array(6)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                className="h-3 rounded-lg bg-gradient-to-r from-white/8 to-white/3 animate-pulse"
                                                style={{ animationDelay: `${i * 100}ms` }}
                                            />
                                        ))}
                                    </div>
                                </motion.div>
                            ) : heatmapData.length === 0 ? (
                                <motion.div className="h-full flex items-center justify-center text-center">
                                    <p className="text-gray-500">No heatmap data available</p>
                                </motion.div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart
                                        data={heatmapData}
                                        margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                                    >
                                        <defs>
                                            <linearGradient id="heatGrad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.5} />
                                                <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.05} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="rgba(255,255,255,0.06)"
                                            vertical={true}
                                        />
                                        <XAxis
                                            dataKey="hour"
                                            stroke="#6b7280"
                                            fontSize={10}
                                            tickLine={false}
                                            axisLine={false}
                                            interval={2}
                                        />
                                        <YAxis
                                            stroke="#6b7280"
                                            fontSize={10}
                                            tickLine={false}
                                            axisLine={false}
                                            width={40}
                                        />
                                        <Tooltip content={<CustomTooltip color="#ef4444" />} />
                                        <Area
                                            type="monotone"
                                            dataKey="count"
                                            stroke="#ef4444"
                                            strokeWidth={3}
                                            fill="url(#heatGrad)"
                                            dot={false}
                                            activeDot={{ r: 6, fill: '#ef4444', strokeWidth: 2, stroke: '#fff' }}
                                            animationDuration={800}
                                            animationEasing="ease-out"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            )}
                        </div>

                        {/* Peak Hour Badge */}
                        {!loading && peakHour && (
                            <motion.div
                                className="mt-6 pt-6 border-t border-white/6 flex items-center justify-between"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.35 }}
                            >
                                <div className="flex items-center gap-3 flex-1">
                                    <motion.div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                        style={{
                                            background: 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(245,158,11,0.2))',
                                            border: '1px solid rgba(239,68,68,0.3)',
                                        }}
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                                    >
                                        <Zap size={16} className="text-orange-400" />
                                    </motion.div>
                                    <div>
                                        <p className="text-[10px] text-gray-600 uppercase tracking-widest font-black">Peak Hour</p>
                                        <p className="text-sm font-black text-white">
                                            {peakHour.hour}
                                            <span className="text-gray-500 font-medium text-xs ml-2">•</span>
                                            <span className="text-gray-500 font-medium text-xs ml-2">{peakHour.count} messages</span>
                                        </p>
                                    </div>
                                </div>

                                <motion.div
                                    className="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase"
                                    style={{
                                        background: 'rgba(245,158,11,0.15)',
                                        border: '1px solid rgba(245,158,11,0.3)',
                                        color: '#f59e0b',
                                    }}
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    Hottest
                                </motion.div>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
