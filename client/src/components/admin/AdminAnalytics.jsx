import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
    ScatterChart, Scatter, ZAxis
} from 'recharts';
import { TrendingUp, Activity, Users, Flame } from 'lucide-react';

const AdminAnalytics = () => {
    const [heatmap, setHeatmap] = useState([]);
    const [topUsers, setTopUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            try {
                const [h, tu] = await Promise.all([
                    axios.get('http://localhost:3334/api/admin/analytics/heatmap', { headers }),
                    axios.get('http://localhost:3334/api/admin/analytics/most-active-users', { headers }),
                ]);
                setHeatmap(h.data);
                setTopUsers(tu.data);
            } catch (err) {
                console.error("Fetch analytics failed:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    const formatHeatmap = (data) => {
        // Group by hour
        const hours = Array.from({ length: 24 }, (_, i) => ({ hour: i, count: 0 }));
        data.forEach(d => {
            const hourObj = hours.find(h => h.hour === d._id.hour);
            if (hourObj) hourObj.count += d.count;
        });
        return hours;
    };

    const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#ef4444', '#f59e0b', '#10b981'];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-black text-white tracking-tight">Intelligence & Patterns</h1>
                <p className="text-gray-500 text-sm font-medium">Deep behavioral analysis and usage heatmaps.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Most Active Users */}
                <div className="glass p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 shadow-lg shadow-blue-500/20">
                            <Users size={20} className="text-blue-500" />
                        </div>
                        <h3 className="text-xl font-black text-white">Power Users</h3>
                    </div>

                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topUsers} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                                <XAxis type="number" stroke="#4b5563" fontSize={10} hide />
                                <YAxis dataKey="username" type="category" stroke="#9ca3af" fontSize={10} width={100} tickLine={false} axisLine={false} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                    contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px' }}
                                />
                                <Bar dataKey="count" radius={[0, 10, 10, 0]}>
                                    {topUsers.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.8} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Heatmap Simulation */}
                <div className="glass p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 shadow-lg shadow-orange-500/10">
                            <Flame size={20} className="text-orange-500" />
                        </div>
                        <h3 className="text-xl font-black text-white">Active Hours (UTC)</h3>
                    </div>

                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={formatHeatmap(heatmap)}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="hour" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px' }}
                                />
                                <Bar dataKey="count">
                                    {formatHeatmap(heatmap).map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.count > 50 ? '#ef4444' : entry.count > 20 ? '#f59e0b' : '#3b82f6'}
                                            fillOpacity={0.6}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
