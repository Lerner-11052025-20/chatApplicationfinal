import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import {
    History, ShieldAlert, MessageCircle, RefreshCw, CheckCircle2,
    User, Clock, Zap, ScrollText, Calendar, Filter,
    Activity, Shield, Trash2, CheckCircle, ChevronDown,
    MoreHorizontal, Search, ArrowUpRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE_URL } from "../../config";

/* ─── Shared Utilities ────────────────────────────────────────── */

const getActionStyle = (action = "") => {
    const act = action?.toUpperCase() || "";
    if (act.includes("BAN")) return {
        bg: "rgba(239, 68, 68, 0.1)",
        border: "rgba(239, 68, 68, 0.2)",
        text: "#ef4444",
        glow: "rgba(239, 68, 68, 0.4)",
        icon: ShieldAlert
    };
    if (act.includes("DELETE")) return {
        bg: "rgba(245, 158, 11, 0.1)",
        border: "rgba(245, 158, 11, 0.2)",
        text: "#f59e0b",
        glow: "rgba(245, 158, 11, 0.4)",
        icon: Trash2
    };
    if (act.includes("VERIFY")) return {
        bg: "rgba(59, 130, 246, 0.1)",
        border: "rgba(59, 130, 246, 0.2)",
        text: "#3b82f6",
        glow: "rgba(59, 130, 246, 0.4)",
        icon: CheckCircle
    };
    return {
        bg: "rgba(16, 185, 129, 0.1)",
        border: "rgba(16, 185, 129, 0.2)",
        text: "#10b981",
        glow: "rgba(16, 185, 129, 0.4)",
        icon: History
    };
};

const formatDateGroup = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.setHours(0, 0, 0, 0) - date.setHours(0, 0, 0, 0);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return date.toLocaleDateString('en-US', { weekday: 'long' });
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

const timeAgo = (iso) => {
    try {
        const diff = Date.now() - new Date(iso).getTime();
        const m = Math.floor(diff / 60000);
        if (m < 1) return "just now";
        if (m < 60) return `${m}m ago`;
        const h = Math.floor(m / 60);
        if (h < 24) return `${h}h ago`;
        return `${Math.floor(h / 24)}d ago`;
    } catch { return ""; }
};

/* ─── Components ─────────────────────────────────────────────── */

const StatMiniCard = ({ label, value, icon: Icon, color }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 min-w-[140px] bg-white/3 border border-white/6 rounded-2xl p-4 relative overflow-hidden group"
    >
        <div className="absolute top-0 right-0 w-16 h-16 blur-2xl opacity-10 group-hover:opacity-20 transition-opacity rounded-full" style={{ background: color }} />
        <div className="flex items-center gap-3 mb-1">
            <div className="p-1.5 rounded-lg bg-white/5 text-gray-400 group-hover:text-white transition-colors">
                <Icon size={14} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{label}</span>
        </div>
        <div className="text-xl font-black text-white">{value.toLocaleString()}</div>
    </motion.div>
);

const AuditEntry = React.memo(({ log, idx }) => {
    const style = getActionStyle(log.action);
    const Icon = style.icon;

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.02 }}
            className="group relative flex gap-4 pl-6"
        >
            {/* Timeline Line & Dot */}
            <div className="absolute left-[7px] top-0 bottom-0 w-[2px] bg-white/5 group-last:bottom-auto group-last:h-5" />
            <div className="absolute left-0 top-5 w-[16px] h-[16px] rounded-full bg-[#0a0a0b] border-2 border-white/10 flex items-center justify-center z-10">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: style.text, boxShadow: `0 0 8px ${style.glow}` }} />
            </div>

            {/* Content Card */}
            <div className="flex-1 bg-white/3 border border-white/6 hover:border-white/12 hover:bg-white/5 rounded-2xl p-4 transition-all duration-300 mb-4 group/card">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white uppercase shadow-lg">
                                {log.admin?.username?.[0] || 'S'}
                            </div>
                            <span className="text-sm font-black text-white">{log.admin?.username || "System"}</span>
                            <span className="text-gray-600 text-xs font-medium">performed</span>
                            <span
                                className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border"
                                style={{ background: style.bg, borderColor: style.border, color: style.text }}
                            >
                                {log.action?.replace(/_/g, " ")}
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="px-3 py-2 rounded-xl bg-white/3 border border-white/6 flex items-center gap-3 group-hover/card:border-white/12 transition-colors">
                                <div className="p-1.5 rounded-lg bg-black/40 text-gray-400">
                                    <User size={12} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-tighter leading-none mb-1">Target</span>
                                    <span className="text-xs font-bold text-gray-200 truncate max-w-[150px]">
                                        {log.targetUser?.username || log.targetMessage?.slice(0, 30) || "System Resource"}
                                    </span>
                                </div>
                            </div>

                            {log.meta?.reason && (
                                <div className="text-xs text-amber-500/80 font-medium italic truncate max-w-[200px]">
                                    "{log.meta.reason}"
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="text-right flex flex-col items-end gap-1 shrink-0">
                        <div className="flex items-center gap-1.5 text-gray-500 font-bold text-[10px] uppercase">
                            <Clock size={10} />
                            {timeAgo(log.createdAt)}
                        </div>
                        <div className="text-[10px] text-gray-600 font-medium">
                            {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.1, color: '#fff' }}
                            className="mt-2 p-1.5 rounded-lg bg-white/2 text-gray-600 hover:bg-white/5 transition-colors"
                        >
                            <MoreHorizontal size={14} />
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
});

const SkeletonLoader = () => (
    <div className="space-y-6">
        {[1, 2, 3].map(i => (
            <div key={i} className="space-y-4">
                <div className="h-4 w-24 bg-white/5 rounded-md animate-pulse ml-6" />
                {[1, 2].map(j => (
                    <div key={j} className="relative flex gap-4 pl-6">
                        <div className="absolute left-[7px] top-0 bottom-0 w-[2px] bg-white/5" />
                        <div className="absolute left-0 top-5 w-[16px] h-[16px] rounded-full bg-white/5 border-2 border-white/10 animate-pulse" />
                        <div className="flex-1 h-24 bg-white/3 border border-white/6 rounded-2xl animate-pulse" />
                    </div>
                ))}
            </div>
        ))}
    </div>
);

/* ─── Main Component ────────────────────────────────────────── */

export default function AdminAuditLog() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState("all");
    const [refreshing, setRefreshing] = useState(false);

    const PER_PAGE = 15;

    const fetchLogs = useCallback(async (isSilent = false) => {
        if (!isSilent) setLoading(true);
        else setRefreshing(true);

        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${API_BASE_URL}/api/admin/audit`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLogs(res.data.logs || []);
            setPage(1);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    const filteredLogs = useMemo(() => {
        if (filter === "all") return logs;
        return logs.filter(l => l.action?.toLowerCase().includes(filter));
    }, [logs, filter]);

    const groupedLogs = useMemo(() => {
        const paged = filteredLogs.slice(0, page * PER_PAGE);
        const groups = {};
        paged.forEach(log => {
            const groupName = formatDateGroup(log.createdAt);
            if (!groups[groupName]) groups[groupName] = [];
            groups[groupName].push(log);
        });
        return groups;
    }, [filteredLogs, page]);

    const stats = useMemo(() => {
        const now = new Date();
        const last24h = new Date(now - 24 * 60 * 60 * 1000);
        return {
            total: logs.length,
            recent: logs.filter(l => new Date(l.createdAt) > last24h).length,
            bans: logs.filter(l => l.action?.includes("BAN")).length,
            deletes: logs.filter(l => l.action?.includes("DELETE")).length
        };
    }, [logs]);

    const hasMore = (page * PER_PAGE) < filteredLogs.length;

    const FILTER_OPTIONS = [
        { id: "all", label: "All Activity", icon: Activity },
        { id: "ban", label: "Bans", icon: Shield },
        { id: "delete", label: "Deletes", icon: Trash2 },
        { id: "verify", label: "Verifications", icon: CheckCircle },
    ];

    return (
        <div className="space-y-8 pb-10 max-w-5xl mx-auto">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-emerald-500/10 border border-emerald-500/20 shadow-xl shadow-emerald-500/5 transition-transform hover:scale-110">
                            <ScrollText size={22} className="text-emerald-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-white tracking-tight">Audit Trail</h1>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1 opacity-60">Complete history of administrative actions</p>
                        </div>
                    </div>
                </motion.div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => fetchLogs(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-gray-400 border border-white/6 hover:border-white/12 hover:text-white transition-all bg-white/2"
                    >
                        <motion.div animate={{ rotate: refreshing ? 360 : 0 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                            <RefreshCw size={14} />
                        </motion.div>
                        {refreshing ? 'Syncing...' : 'Refresh Logs'}
                    </button>
                </div>
            </div>

            {/* Stats Strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatMiniCard label="Total Events" value={stats.total} icon={History} color="#3b82f6" />
                <StatMiniCard label="Active (24h)" value={stats.recent} icon={Activity} color="#10b981" />
                <StatMiniCard label="Manual Bans" value={stats.bans} icon={Shield} color="#ef4444" />
                <StatMiniCard label="Cleanup Ops" value={stats.deletes} icon={Trash2} color="#f59e0b" />
            </div>

            {/* Filters */}
            <div className="flex items-center justify-between gap-4 py-2 border-y border-white/5">
                <div className="flex gap-1 overflow-x-auto no-scrollbar py-1">
                    {FILTER_OPTIONS.map((f) => {
                        const Icon = f.icon;
                        const active = filter === f.id;
                        return (
                            <button
                                key={f.id}
                                onClick={() => { setFilter(f.id); setPage(1); }}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all relative shrink-0 ${active ? "text-white" : "text-gray-500 hover:text-gray-300 hover:bg-white/2"
                                    }`}
                            >
                                <Icon size={14} />
                                {f.label}
                                {active && (
                                    <motion.div
                                        layoutId="audit-tab"
                                        className="absolute inset-0 bg-white/5 border border-white/10 rounded-xl -z-10 shadow-lg"
                                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
                <div className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase text-gray-600 tracking-tighter">
                    <Search size={12} />
                    Press <span className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5">/</span> to search
                </div>
            </div>

            {/* Timeline View */}
            <div className="relative mt-12">
                {loading ? (
                    <SkeletonLoader />
                ) : filteredLogs.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-20 text-center space-y-4"
                    >
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/2 border border-white/5 text-gray-700">
                            <Filter size={32} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-gray-400">No records found</h3>
                            <p className="text-sm text-gray-600 font-medium">Try adjusting your filters or refresh the trail</p>
                        </div>
                    </motion.div>
                ) : (
                    <div className="space-y-10">
                        {Object.entries(groupedLogs).map(([group, logList]) => (
                            <div key={group} className="space-y-6">
                                <div className="sticky top-0 z-20 flex items-center gap-4 bg-[#0a0a0b]/80 backdrop-blur-md py-2 -mx-4 px-4 rounded-xl">
                                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                                        <Calendar size={14} />
                                    </div>
                                    <h2 className="text-sm font-black text-white uppercase tracking-widest">{group}</h2>
                                    <div className="flex-1 h-[1px] bg-gradient-to-r from-white/10 to-transparent" />
                                    <span className="text-[10px] font-black text-gray-600 uppercase">{logList.length} actions</span>
                                </div>

                                <div className="space-y-1 relative">
                                    {logList.map((log, idx) => (
                                        <AuditEntry key={log._id} log={log} idx={idx} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Load More */}
            {hasMore && !loading && (
                <div className="flex justify-center pt-8 border-t border-white/5 mt-10">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setPage((p) => p + 1)}
                        className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/3 border border-white/10 hover:border-white/20 text-sm font-black text-white transition-all shadow-xl group"
                    >
                        Check Older Records
                        <div className="p-1.5 rounded-lg bg-white/5 text-gray-400 group-hover:text-white group-hover:bg-white/10 transition-colors">
                            <ChevronDown size={14} />
                        </div>
                    </motion.button>
                </div>
            )}
        </div>
    );
}