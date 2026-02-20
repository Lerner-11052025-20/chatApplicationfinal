import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, label, value, color }) => {
    const colors = {
        blue: 'from-blue-500/20 to-blue-600/20 text-blue-400 border-blue-500/20 shadow-blue-500/10',
        green: 'from-green-500/20 to-green-600/20 text-green-400 border-green-500/20 shadow-green-500/10',
        red: 'from-red-500/20 to-red-600/20 text-red-400 border-red-500/20 shadow-red-500/10',
        purple: 'from-purple-500/20 to-purple-600/20 text-purple-400 border-purple-500/20 shadow-purple-500/10',
        orange: 'from-orange-500/20 to-orange-600/20 text-orange-400 border-orange-500/20 shadow-orange-500/10',
        indigo: 'from-indigo-500/20 to-indigo-600/20 text-indigo-400 border-indigo-500/20 shadow-indigo-500/10',
    };

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className={`glass p-6 rounded-3xl border flex items-center gap-5 transition-all shadow-lg ${colors[color] || colors.blue}`}
        >
            <div className={`p-4 rounded-2xl bg-white/5 border border-white/5`}>
                <Icon size={28} />
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{label}</p>
                <h3 className="text-2xl font-black text-white">{value}</h3>
            </div>
        </motion.div>
    );
};

export default StatCard;
