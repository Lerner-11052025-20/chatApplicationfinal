import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, User, MessageCircle, ChevronDown, Search } from 'lucide-react';
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
                className={`flex items-center justify-between border border-white/5 shadow-2xl pointer-events-auto`}
            >
                {/* Brand */}
                <div
                    onClick={() => navigate('/')}
                    className="flex items-center gap-3 cursor-pointer group"
                >
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-blue via-brand-indigo to-brand-cyan flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                        <MessageCircle size={22} className="text-white fill-white/20" />
                    </div>
                    <span className={`text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/40 tracking-tighter`}>
                        ChatWave<span className="text-brand-blue">.</span>
                    </span>
                </div>

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
                                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-brand-blue to-brand-indigo text-white text-[13.5px] font-bold shadow-lg shadow-brand-blue/20 hover:scale-105 active:scale-95 transition-all"
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
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-blue to-brand-indigo flex items-center justify-center text-[10px] font-black shadow-inner">
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
                                        {/* Background Decor */}
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />

                                        <div className="relative z-10">
                                            <div className="px-4 py-4 mb-3 rounded-2xl bg-white/5 border border-white/5">
                                                <p className="text-[9px] uppercase tracking-[0.2em] text-brand-cyan font-black mb-2 flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse" />
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
                                                    <MessageCircle size={18} className="text-brand-blue group-hover/item:scale-110 transition-transform text-brand-blue" />
                                                    <span>Terminal</span>
                                                </button>
                                                <button
                                                    onClick={() => { navigate('/profile'); setDropdownOpen(false); }}
                                                    className="w-full flex items-center gap-4 px-4 py-3.5 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all group/item"
                                                >
                                                    <User size={18} className="text-brand-indigo group-hover/item:scale-110 transition-transform text-brand-indigo" />
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
                        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="absolute top-24 left-4 right-4 lg:hidden p-8 rounded-[2.5rem] border border-white/10 bg-[#060312]/95 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[99] overflow-hidden"
                    >
                        {/* Background Decor */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/10 blur-[80px] rounded-full" />

                        <div className="relative z-10 space-y-6">
                            <div className="grid grid-cols-2 gap-3">
                                {navLinks.map((link) => (
                                    <a
                                        key={link.name}
                                        href={link.path}
                                        onClick={(e) => handleNavClick(e, link.path)}
                                        className="flex items-center justify-center py-4 rounded-2xl bg-white/5 border border-white/5 text-[13px] font-bold text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                                    >
                                        {link.name}
                                    </a>
                                ))}
                            </div>

                            <div className="h-px bg-white/5" />

                            {!user ? (
                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}
                                        className="py-4 rounded-2xl border border-white/10 text-[13.5px] font-bold text-white transition-all bg-white/5 hover:bg-white/10"
                                    >
                                        Existing Account
                                    </button>
                                    <button
                                        onClick={() => { navigate('/signup'); setMobileMenuOpen(false); }}
                                        className="py-4 rounded-2xl bg-gradient-to-r from-brand-blue to-brand-indigo text-[13.5px] font-bold text-white transition-all shadow-lg shadow-brand-blue/20"
                                    >
                                        Initialize Protocol
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => { navigate('/dashboard'); setMobileMenuOpen(false); }}
                                    className="w-full py-4 rounded-2xl bg-brand-blue text-[11px] font-black uppercase tracking-widest text-white transition-all"
                                >
                                    Enter Dashboard
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;
