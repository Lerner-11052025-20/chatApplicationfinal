import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, User, MessageCircle, MessageSquare, ChevronDown, Search, LayoutGrid } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('hero');
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setDropdownOpen(false);
        navigate('/login');
    };

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '-80px 0px -40% 0px', // Adjusted to trigger when section is near the top
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, options);

        const sections = ['hero', 'stats', 'features', 'pricing', 'testimonials', 'team', 'faq', 'contact'];
        sections.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    function parseJwt(token) {
        if (!token) return null;
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
            );
            return JSON.parse(jsonPayload);
        } catch (e) { return null; }
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return setUser(null);
        const decoded = parseJwt(token);
        if (decoded) setUser({ _id: decoded.id, username: decoded.username, email: decoded.email });
    }, []);

    const navLinks = [
        { name: 'Home', path: '#hero' },
        { name: 'Stats', path: '#stats' },
        { name: 'Features', path: '#features' },
        { name: 'Pricing', path: '#pricing' },
        { name: 'Testimonials', path: '#testimonials' },
        { name: 'Team', path: '#team' },
        { name: 'FAQ', path: '#faq' },
        { name: 'Contact', path: '#contact' },
    ];

    const handleNavClick = (e, path) => {
        if (path.startsWith('#')) {
            e.preventDefault();
            if (location.pathname !== '/') {
                navigate('/' + path);
            } else {
                const element = document.querySelector(path);
                if (element) {
                    const offset = 80;
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
            setMobileMenuOpen(false);
        }
    };

    const isActive = (path) => {
        if (path.startsWith('#')) {
            const sectionId = path.substring(1);
            return activeSection === sectionId;
        }
        return location.pathname === path;
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-[100] flex justify-center items-center py-4 px-4 pointer-events-none">
            <motion.nav
                initial={false}
                animate={{
                    backgroundColor: scrolled ? 'rgba(6, 3, 18, 0.85)' : 'rgba(6, 3, 18, 0.4)',
                }}
                transition={{ duration: 0.3 }}
                style={{ width: '95%', maxWidth: '1400px', padding: '12px 32px', borderRadius: '24px' }}
                className={`flex items-center justify-between border border-white/5 shadow-2xl pointer-events-auto ${scrolled ? 'backdrop-blur-xl' : ''}`}
            >
                {/* Brand */}
                <div
                    onClick={() => navigate('/')}
                    className="flex items-center gap-3 cursor-pointer group"
                >
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#3b82f6] via-[#6366f1] to-[#0ea5e9] flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                        <MessageCircle size={22} className="text-white fill-white/20" />
                    </div>
                    <span className={`text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/40 tracking-tighter`}>
                        ChatWave<span className="text-[#3b82f6]">.</span>
                    </span>
                </div>

                {/* Quick Access Buttons */}
                {user && (
                    <div className="flex items-center gap-2 ml-4 mr-auto">
                        <motion.button
                            whileHover={{ scale: 1.05, backgroundColor: 'rgba(59, 130, 246, 0.2)' }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/dashboard')}
                            className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-all group"
                        >
                            <MessageSquare size={18} className="group-hover:scale-110 transition-transform" />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05, backgroundColor: 'rgba(99, 102, 241, 0.2)' }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/profile')}
                            className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-all group"
                        >
                            <User size={18} className="group-hover:scale-110 transition-transform" />
                        </motion.button>
                    </div>
                )}

                {/* Desktop Menu */}
                <div className="hidden lg:flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-white/5 rounded-full p-1.5 border border-white/5">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.path}
                                onClick={(e) => handleNavClick(e, link.path)}
                                className={`px-5 py-2.5 text-[13.5px] font-bold rounded-full transition-all duration-300 ${isActive(link.path)
                                    ? 'text-white bg-white/10'
                                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>

                    <div className="w-px h-6 bg-white/10 mx-3" />

                    {!user ? (
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate('/login')}
                                className="text-[13.5px] font-bold text-gray-400 hover:text-white transition-colors px-4"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => navigate('/signup')}
                                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#3b82f6] to-[#6366f1] text-white text-[13.5px] font-bold shadow-lg shadow-brand-blue/20 hover:scale-105 active:scale-95 transition-all"
                            >
                                Join
                            </button>
                        </div>
                    ) : (
                        <div
                            className="relative"
                            onMouseEnter={() => setDropdownOpen(true)}
                            onMouseLeave={() => setDropdownOpen(false)}
                        >
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-white/10 transition-all border border-white/10 bg-white/5 active:scale-95"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#3b82f6] to-[#6366f1] flex items-center justify-center text-[10px] font-black shadow-inner">
                                    {user.username?.[0].toUpperCase()}
                                </div>
                                <ChevronDown size={14} className={`text-gray-400 transition-transform duration-500 ${dropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {dropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                                        className="absolute right-0 mt-3 w-72 rounded-[2rem] p-4 shadow-2xl origin-top-right border border-white/10 bg-[#0a051d] z-[100] backdrop-blur-3xl overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />

                                        <div className="relative z-10">
                                            <div className="px-4 py-4 mb-3 rounded-2xl bg-white/5 border border-white/5">
                                                <p className="text-[9px] uppercase tracking-[0.2em] text-[#0ea5e9] font-black mb-2 flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-[#0ea5e9] animate-pulse" />
                                                    Authorized Operative
                                                </p>
                                                <p className="text-lg font-black truncate text-white tracking-tight">{user.username}</p>
                                                <p className="text-[10px] text-gray-500 truncate font-bold uppercase tracking-widest">{user.email}</p>
                                            </div>

                                            <div className="space-y-1">
                                                <button
                                                    onClick={() => { navigate('/dashboard'); setDropdownOpen(false); }}
                                                    className="w-full flex items-center gap-4 px-4 py-3.5 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all group/item"
                                                >
                                                    <MessageCircle size={18} className="text-[#3b82f6] group-hover/item:scale-110 transition-transform" />
                                                    <span>Messenger</span>
                                                </button>
                                                <button
                                                    onClick={() => { navigate('/profile'); setDropdownOpen(false); }}
                                                    className="w-full flex items-center gap-4 px-4 py-3.5 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all group/item"
                                                >
                                                    <User size={18} className="text-[#6366f1] group-hover/item:scale-110 transition-transform" />
                                                    <span>Profile</span>
                                                </button>
                                            </div>

                                            <div className="h-px bg-white/5 my-3 mx-2" />

                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-4 px-4 py-3.5 text-xs font-black uppercase tracking-widest text-red-400 hover:bg-red-500/10 rounded-xl transition-all group/logout"
                                            >
                                                <LogOut size={18} className="group-hover/logout:-translate-x-1 transition-transform" />
                                                <span>Disconnect</span>
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <div className="lg:hidden flex items-center gap-2">
                    <button
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${mobileMenuOpen ? 'bg-white/10 text-white rotate-90' : 'bg-white/5 text-gray-400'}`}
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <Menu size={20} />
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                        animate={{ opacity: 1, backdropFilter: 'blur(16px)' }}
                        exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                        className="fixed inset-0 z-[110] bg-black/60 pointer-events-auto flex items-center justify-center p-4"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.95 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-lg bg-[#0a051d] rounded-[2.5rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden relative"
                        >
                            {/* Background Effects */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full" />

                            <div className="relative z-10 p-6 md:p-8">
                                {/* Header in Menu */}
                                <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5 px-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#3b82f6] to-[#6366f1] flex items-center justify-center shadow-lg shadow-blue-500/20">
                                            <MessageCircle size={20} className="text-white fill-white/20" />
                                        </div>
                                        <span className="text-xl font-black text-white tracking-tight">ChatWave<span className="text-[#3b82f6]">.</span></span>
                                    </div>
                                    <button
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all active:scale-90"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Link Grid */}
                                <div className="grid grid-cols-2 gap-3 mb-8">
                                    {navLinks.map((link) => (
                                        <a
                                            key={link.name}
                                            href={link.path}
                                            onClick={(e) => handleNavClick(e, link.path)}
                                            className={`flex items-center justify-center py-4 rounded-3xl text-[14px] font-black uppercase tracking-widest transition-all duration-300 border ${isActive(link.path)
                                                ? 'bg-white/10 border-blue-500/50 text-white shadow-lg shadow-blue-500/10'
                                                : 'bg-white/2 border-white/5 text-gray-400 hover:bg-white/5 hover:text-white'
                                                }`}
                                        >
                                            {link.name}
                                        </a>
                                    ))}
                                </div>

                                {/* Action Button */}
                                <div className="pt-2">
                                    {!user ? (
                                        <div className="flex flex-col gap-3">
                                            <button
                                                onClick={() => { navigate('/signup'); setMobileMenuOpen(false); }}
                                                className="w-full py-5 rounded-[2rem] bg-[#3b82f6] text-[13px] font-black uppercase tracking-[0.2em] text-white transition-all shadow-xl shadow-blue-500/20 active:scale-[0.98] border border-blue-400/20"
                                            >
                                                Initialize Protocol
                                            </button>
                                            <button
                                                onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}
                                                className="w-full py-4 text-[12px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-all"
                                            >
                                                Already have access? Login
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => { navigate('/dashboard'); setMobileMenuOpen(false); }}
                                            className="w-full py-5 rounded-[2rem] bg-gradient-to-r from-[#3b82f6] to-[#6366f1] text-[13px] font-black uppercase tracking-[0.2em] text-white transition-all shadow-xl shadow-blue-500/20 active:scale-[0.98] border border-white/10"
                                        >
                                            Enter Dashboard
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;
