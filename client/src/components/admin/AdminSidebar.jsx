import React, { useState, useMemo } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Users,
    MessageSquare,
    BarChart3,
    ShieldAlert,
    LogOut,
    Home,
    ChevronRight,
    Zap,
    Menu,
    X,
} from 'lucide-react';

const navItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/admin', color: '#ef4444' },
    { icon: Users, label: 'Users', path: '/admin/users', color: '#3b82f6' },
    { icon: MessageSquare, label: 'Content', path: '/admin/content', color: '#8b5cf6' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics', color: '#f59e0b' },
    { icon: ShieldAlert, label: 'Audit Log', path: '/admin/audit', color: '#10b981' },
];

const AdminSidebar = ({ isOpen, setIsOpen }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [expandedMenu, setExpandedMenu] = useState(null);

    const containerVariants = {
        hidden: { x: -280 },
        visible: {
            x: 0,
            transition: {
                duration: 0.3,
                ease: 'easeOut',
            },
        },
        exit: {
            x: -280,
            transition: {
                duration: 0.2,
                ease: 'easeIn',
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: (i) => ({
            opacity: 1,
            x: 0,
            transition: {
                delay: i * 0.05,
                duration: 0.3,
                ease: 'easeOut',
            },
        }),
    };

    // Memoize nav items rendering
    const memoizedNavItems = useMemo(() => navItems, []);

    const handleNavigation = (path) => {
        navigate(path);
        // Close sidebar on mobile
        if (window.innerWidth < 1024) {
            setIsOpen(false);
        }
    };

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
        }
    };

    return (
        <>
            {/* Mobile menu button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 left-4 z-40 lg:hidden p-2 rounded-lg bg-white/8 border border-white/12 hover:bg-white/12 transition-all"
                aria-label="Toggle menu"
            >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Sidebar */}
            <motion.aside
                variants={containerVariants}
                initial="hidden"
                animate={isOpen ? "visible" : "hidden"}
                exit="exit"
                className="fixed lg:relative w-64 flex flex-col h-full shrink-0 z-25 lg:z-20 border-r border-white/5 lg:translate-x-0"
                style={{
                    background: 'linear-gradient(180deg, rgba(3,0,20,0.95) 0%, rgba(3,0,20,0.8) 100%)',
                    backdropFilter: 'blur(30px)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                }}
            >
                {/* Close button for mobile */}
                <div className="absolute top-4 right-4 lg:hidden">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-1 hover:bg-white/10 rounded-lg transition-all"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Logo Section */}
                <motion.div
                    className="px-6 py-8 border-b border-white/5"
                    variants={itemVariants}
                    custom={0}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() => navigate('/admin')}
                        whileHover={{ scale: 1.05 }}
                    >
                        <motion.div
                            className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-xl shrink-0"
                            style={{
                                background: 'linear-gradient(135deg, #ef4444, #f97316)',
                                boxShadow: '0 12px 32px rgba(239,68,68,0.4)',
                            }}
                            whileHover={{
                                boxShadow: '0 16px 40px rgba(239,68,68,0.6)',
                                scale: 1.1,
                            }}
                        >
                            <ShieldAlert size={22} className="text-white" />
                        </motion.div>
                        <div className="overflow-hidden">
                            <motion.h1
                                className="text-lg font-black text-white tracking-tight leading-none"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.1 }}
                            >
                                Admin<span className="text-red-500">.</span>
                            </motion.h1>
                            <motion.p
                                className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-1"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.15 }}
                            >
                                Control Panel
                            </motion.p>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Navigation Section */}
                <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto custom-scrollbar">
                    <motion.p
                        className="text-[8px] font-black text-gray-700 uppercase tracking-[0.3em] px-3 mb-4 opacity-60"
                        variants={itemVariants}
                        custom={1}
                        initial="hidden"
                        animate="visible"
                    >
                        Navigation
                    </motion.p>

                    {memoizedNavItems.map((item, idx) => {
                        const isActive = location.pathname === item.path || (item.path === '/admin' && location.pathname === '/admin');

                        return (
                            <motion.div
                                key={item.path}
                                variants={itemVariants}
                                custom={idx + 2}
                                initial="hidden"
                                animate="visible"
                            >
                                <motion.button
                                    onClick={() => handleNavigation(item.path)}
                                    className={`w-full group relative flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-300 font-semibold text-sm ${
                                        isActive
                                            ? 'text-white border border-white/12'
                                            : 'text-gray-500 hover:text-white border border-transparent hover:border-white/8'
                                    }`}
                                    style={
                                        isActive
                                            ? {
                                                  background: `${item.color}12`,
                                                  boxShadow: `inset 0 0 16px ${item.color}08`,
                                              }
                                            : {}
                                    }
                                    whileHover={{
                                        scale: 1.02,
                                        backgroundColor: isActive ? `${item.color}15` : 'rgba(255,255,255,0.05)',
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {/* Active left pill */}
                                    <AnimatePresence>
                                        {isActive && (
                                            <motion.div
                                                layoutId="adminPill"
                                                className="absolute left-0 w-1 h-6 rounded-r-lg"
                                                style={{
                                                    background: item.color,
                                                    boxShadow: `0 0 12px ${item.color}80`,
                                                }}
                                                initial={{ opacity: 0, x: -4 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -4 }}
                                            />
                                        )}
                                    </AnimatePresence>

                                    {/* Icon */}
                                    <motion.div
                                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                                            isActive ? 'shadow-lg' : ''
                                        }`}
                                        style={
                                            isActive
                                                ? {
                                                      background: `${item.color}20`,
                                                      color: item.color,
                                                      boxShadow: `0 6px 16px ${item.color}25`,
                                                  }
                                                : {}
                                        }
                                        whileHover={{
                                            scale: 1.1,
                                        }}
                                    >
                                        <item.icon size={18} />
                                    </motion.div>

                                    {/* Label */}
                                    <span className="flex-1 text-left">{item.label}</span>

                                    {/* Active indicator */}
                                    <AnimatePresence>
                                        {isActive && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0 }}
                                            >
                                                <ChevronRight
                                                    size={16}
                                                    className="opacity-60"
                                                    style={{ color: item.color }}
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.button>
                            </motion.div>
                        );
                    })}
                </nav>

                {/* Bottom actions section */}
                <motion.div
                    className="px-3 py-4 border-t border-white/5 space-y-2"
                    variants={itemVariants}
                    custom={memoizedNavItems.length + 2}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.button
                        onClick={() => handleNavigation('/dashboard')}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-gray-400 hover:text-white text-sm font-semibold border border-white/6 hover:border-white/12 bg-white/3 hover:bg-white/6 transition-all"
                        whileHover={{ scale: 1.02, x: 2 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Home size={16} />
                        <span>Back to Home</span>
                    </motion.button>

                    <motion.button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-red-400 hover:text-red-300 text-sm font-semibold border border-red-500/20 hover:border-red-500/40 bg-red-500/5 hover:bg-red-500/10 transition-all"
                        whileHover={{ scale: 1.02, x: 2 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <LogOut size={16} />
                        <span>Logout</span>
                    </motion.button>
                </motion.div>
            </motion.aside>
        </>
    );
};

export default AdminSidebar;
