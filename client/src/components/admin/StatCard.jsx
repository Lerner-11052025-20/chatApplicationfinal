import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, TrendingUp } from 'lucide-react';

const ACCENT_COLORS = {
    blue: '#3b82f6',
    green: '#10b981',
    red: '#ef4444',
    purple: '#8b5cf6',
    orange: '#f59e0b',
    indigo: '#6366f1',
    cyan: '#06b6d4',
    pink: '#ec4899',
    teal: '#14b8a6',
    lime: '#84cc16',
};

const StatCard = ({ icon: Icon, label, value, trend = null, color = 'blue', delay = 0, onClick = null }) => {
    const [isHovering, setIsHovering] = useState(false);
    const accent = useMemo(() => ACCENT_COLORS[color] ?? '#3b82f6', [color]);

    // Format large numbers
    const formattedValue = useMemo(() => {
        if (typeof value !== 'number') return value ?? '—';
        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
        if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
        return value.toLocaleString();
    }, [value]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35, delay, ease: 'easeOut' }}
            whileHover={{ scale: 1.03, y: -4 }}
            onHoverStart={() => setIsHovering(true)}
            onHoverEnd={() => setIsHovering(false)}
            onClick={onClick}
            className={`relative p-6 rounded-2xl border border-white/6 overflow-hidden group cursor-default transition-all ${
                onClick ? 'cursor-pointer' : ''
            }`}
            style={{
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(16px)',
                boxShadow: isHovering ? `0 12px 32px ${accent}15` : '0 4px 16px rgba(0,0,0,0.2)',
            }}
        >
            {/* Animated gradient glow on hover */}
            <motion.div
                className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `linear-gradient(135deg, ${accent}40, ${accent}00)` }}
                animate={isHovering ? { scale: 1.2 } : { scale: 1 }}
            />

            {/* Top section: Icon and trend */}
            <div className="flex items-start justify-between mb-5 relative z-10">
                <motion.div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                        background: `${accent}15`,
                        border: `1.5px solid ${accent}30`,
                        boxShadow: `0 6px 20px ${accent}20`,
                    }}
                    animate={isHovering ? { scale: 1.15, rotate: 12 } : { scale: 1, rotate: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Icon size={20} style={{ color: accent }} />
                </motion.div>

                {trend && (
                    <motion.div
                        className="flex items-center gap-1.5 px-2 py-1 rounded-lg"
                        style={{ background: trend.positive ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)' }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: delay + 0.1, duration: 0.3 }}
                    >
                        <TrendingUp
                            size={12}
                            style={{
                                color: trend.positive ? '#10b981' : '#ef4444',
                                transform: trend.positive ? 'none' : 'scaleY(-1)',
                            }}
                        />
                        <span
                            className="text-[10px] font-bold"
                            style={{ color: trend.positive ? '#10b981' : '#ef4444' }}
                        >
                            {trend.value}%
                        </span>
                    </motion.div>
                )}
            </div>

            {/* Value section */}
            <div className="relative z-10 mb-3">
                <motion.p
                    className="text-3xl font-black text-white leading-none mb-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: delay + 0.1, duration: 0.3 }}
                >
                    {formattedValue}
                </motion.p>
                <motion.p
                    className="text-[12px] text-gray-500 font-semibold uppercase tracking-wider"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: delay + 0.15, duration: 0.3 }}
                >
                    {label}
                </motion.p>
            </div>

            {/* Bottom decoration line */}
            <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5"
                style={{ background: `linear-gradient(90deg, ${accent}30, ${accent}00)` }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: delay + 0.2, duration: 0.4, ease: 'easeOut' }}
                origin="left"
            />

            {/* Corner accent */}
            <motion.div
                className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none"
                style={{ background: `${accent}40`, transform: 'translate(25%, -25%)' }}
            />
        </motion.div>
    );
};

export default StatCard;
