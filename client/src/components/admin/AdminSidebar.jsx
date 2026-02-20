import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    MessageSquare,
    BarChart3,
    ShieldAlert,
    LogOut,
    Home
} from 'lucide-react';

const AdminSidebar = () => {
    const navItems = [
        { icon: LayoutDashboard, label: 'Overview', path: '/admin' },
        { icon: Users, label: 'Users', path: '/admin/users' },
        { icon: MessageSquare, label: 'Content', path: '/admin/content' },
        { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
        { icon: ShieldAlert, label: 'Audit Log', path: '/admin/audit' },
    ];

    return (
        <aside className="w-64 bg-dark-bg/80 backdrop-blur-xl border-r border-white/5 flex flex-col h-full shrink-0">
            <div className="p-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-500 to-orange-600 flex items-center justify-center shadow-lg shadow-red-500/20">
                        <ShieldAlert size={24} className="text-white" />
                    </div>
                    <span className="text-xl font-black text-white tracking-tighter">
                        Admin<span className="text-red-500">.</span>
                    </span>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/admin'}
                        className={({ isActive }) => `
                            flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 font-bold text-sm
                            ${isActive
                                ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                                : 'text-gray-500 hover:text-white hover:bg-white/5'}
                        `}
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 space-y-2">
                <NavLink
                    to="/dashboard"
                    className="flex items-center gap-4 px-4 py-3 rounded-2xl font-bold text-sm text-gray-500 hover:text-white hover:bg-white/5 transition-all"
                >
                    <Home size={20} />
                    <span>Back to App</span>
                </NavLink>
                <button
                    onClick={() => {
                        localStorage.removeItem('token');
                        window.location.href = '/login';
                    }}
                    className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-bold text-sm text-red-400 hover:bg-red-400/10 transition-all"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
