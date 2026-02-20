import React, { useState, useEffect, useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();

    // Performance: Memoize background gradient to prevent re-renders
    const backgroundOrbs = useMemo(() => [
        { top: '0', left: '0', size: 600, color: 'rgba(239,68,68,0.08)', delay: '0s', duration: '15s' },
        { bottom: '0', right: '0', size: 500, color: 'rgba(99,102,241,0.06)', delay: '5s', duration: '20s' },
        { top: '50%', left: '50%', size: 400, color: 'rgba(245,158,11,0.05)', delay: '10s', duration: '25s' },
        { top: '10%', right: '20%', size: 350, color: 'rgba(34,197,94,0.05)', delay: '2s', duration: '18s' },
    ], []);

    const handleScroll = (e) => {
        setIsScrolled(e.target.scrollTop > 20);
    };

    return (
        <div className="flex h-screen bg-gradient-to-br from-slate-950 via-[#030014] to-black text-white overflow-hidden font-sans relative">
            {/* Animated background orbs - GPU accelerated */}
            <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
                {backgroundOrbs.map((orb, idx) => (
                    <motion.div
                        key={idx}
                        className="absolute rounded-full blur-[120px] will-change-transform"
                        style={{
                            top: orb.top !== '0' && orb.top !== '50%' ? orb.top : orb.top === '50%' ? '50%' : undefined,
                            left: orb.left !== '0' && orb.left !== '50%' ? orb.left : orb.left === '50%' ? '50%' : undefined,
                            right: orb.right ? orb.right : undefined,
                            bottom: orb.bottom ? orb.bottom : undefined,
                            width: orb.size,
                            height: orb.size,
                            background: `radial-gradient(circle, ${orb.color}, transparent)`,
                            x: orb.left === '50%' ? '-50%' : undefined,
                            y: orb.top === '50%' ? '-50%' : undefined,
                        }}
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{
                            duration: parseInt(orb.duration),
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: parseInt(orb.delay),
                        }}
                    />
                ))}
            </div>

            {/* Animated gradient overlay */}
            <motion.div
                className="pointer-events-none fixed inset-0 z-[5] opacity-0 mix-blend-overlay"
                style={{
                    background: 'radial-gradient(circle at 50% 0%, rgba(139,92,246,0.1), transparent 50%)',
                }}
                animate={{ opacity: [0, 0.05, 0] }}
                transition={{ duration: 20, repeat: Infinity }}
            />

            {/* Sidebar */}
            <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            {/* Main content with optimized scrolling */}
            <main
                className="flex-1 overflow-y-auto relative z-10 transition-all duration-300"
                style={{
                    background: 'rgba(3,0,14,0.3)',
                    scrollBehavior: 'smooth',
                    scrollPaddingTop: '20px',
                }}
                onScroll={handleScroll}
            >
                {/* Scroll indicator bar */}
                <motion.div
                    className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 z-50"
                    initial={{ width: '0%' }}
                    animate={{ 
                        width: isScrolled ? '100%' : '0%',
                        opacity: isScrolled ? 0.7 : 0
                    }}
                    transition={{ duration: 0.3 }}
                />

                <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="p-4 sm:p-6 lg:p-8 xl:p-10 max-w-7xl mx-auto"
                >
                    <Outlet />
                </motion.div>
            </main>

            {/* Mobile overlay when sidebar is open */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        className="fixed inset-0 bg-black/50 z-[15] lg:hidden backdrop-blur-sm pointer-events-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
