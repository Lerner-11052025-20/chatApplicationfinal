import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from "../../config/api";


const AdminRoute = () => {
    const [isAdmin, setIsAdmin] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const verifyAdmin = async () => {
            if (!token) {
                setIsAdmin(false);
                return;
            }
            try {
                // We'll use the stats endpoint as a check since it's AdminOnly
                await axios.get(`${API_URL}/api/admin/stats`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setIsAdmin(true);
            } catch (err) {
                console.error("Admin verification failed:", err);
                setIsAdmin(false);
            }
        };
        verifyAdmin();
    }, [token]);

    if (isAdmin === null) return (
        <div className="h-screen w-screen flex items-center justify-center bg-dark-bg text-blue-500">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    return isAdmin ? <Outlet /> : <Navigate to="/dashboard" />;
};

export default AdminRoute;
