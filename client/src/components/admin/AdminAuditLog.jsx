import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { History, ShieldAlert, User, MessageCircle, AlertTriangle } from 'lucide-react';
import { API_URL } from "../../config/api";


const AdminAuditLog = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLogs = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get(`${API_URL}/api/admin/audit`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLogs(res.data.logs);
        } catch (err) {
            console.error("Fetch audit failed:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const getIcon = (action) => {
        if (action.includes('BAN')) return <ShieldAlert size={18} className="text-red-500" />;
        if (action.includes('USER')) return <User size={18} className="text-blue-500" />;
        if (action.includes('MESSAGE')) return <MessageCircle size={18} className="text-orange-500" />;
        return <History size={18} className="text-gray-500" />;
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-black text-white tracking-tight">Audit Trail</h1>
                <p className="text-gray-500 text-sm font-medium">Chronological record of all administrative operations.</p>
            </div>

            <div className="glass rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl bg-dark-bg/40">
                <div className="divide-y divide-white/5">
                    {loading ? (
                        <div className="p-12 text-center text-gray-500 font-bold animate-pulse">Reading black box...</div>
                    ) : logs.length === 0 ? (
                        <div className="p-12 text-center text-gray-500 font-bold italic">No administrative records found.</div>
                    ) : (
                        logs.map((log) => (
                            <div key={log._id} className="p-6 hover:bg-white/5 transition-colors flex items-center gap-6">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0">
                                    {getIcon(log.action)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-black text-white text-sm">{log.admin?.username || 'System'}</span>
                                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">performed</span>
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border ${log.action.includes('BAN') ? 'text-red-500 border-red-500/20 bg-red-500/10' :
                                            log.action.includes('DELETE') ? 'text-orange-500 border-orange-500/20 bg-orange-500/10' :
                                                'text-blue-500 border-blue-500/20 bg-blue-500/10'
                                            }`}>
                                            {log.action.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-400 font-medium truncate">
                                        Target: <span className="text-gray-300 font-bold">{log.targetUser?.username || log.targetMessage || 'N/A'}</span>
                                        {log.meta?.reason && <span className="ml-3 text-red-400">Reason: {log.meta.reason}</span>}
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <div className="text-[10px] font-black text-gray-500 uppercase">{new Date(log.createdAt).toLocaleDateString()}</div>
                                    <div className="text-[10px] font-bold text-gray-600">{new Date(log.createdAt).toLocaleTimeString()}</div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminAuditLog;
