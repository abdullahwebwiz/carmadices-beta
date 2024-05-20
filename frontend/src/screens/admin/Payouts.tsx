import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import AdminSidebar from '../../components/admin/Sidebar'; // Import the AdminSidebar component

const PayoutsPage = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const checkAdminStatus = async () => {
            if (!user || !user.isAdmin) {
                console.log('User is not an admin or not logged in. Redirecting to login...');
                navigate('/login');
            }
        };

        checkAdminStatus();
    }, [user, navigate]);

    return (
        <div className="flex h-full">
            {/* Sidebar */}
            <AdminSidebar logout={logout} />
            {/* Content Area */}
            <div className="bg-blue/25 flex-1 overflow-y-auto">
            <h1 className="p-8 lg:text-5xl text-4xl font-black bg-gray-800 text-white text-center lg:text-left">Payouts</h1>
                <div className="p-8">
                </div>
            </div>
        </div>
    );
};

export default PayoutsPage;
