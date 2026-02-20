import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

const AdminDashboard = () => {
    return (
        <div className="flex h-screen bg-dark-bg text-white overflow-hidden font-sans">
            <AdminSidebar />
            <main className="flex-1 overflow-y-auto custom-scrollbar bg-dark-bg/20">
                <div className="p-8 lg:p-12 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
