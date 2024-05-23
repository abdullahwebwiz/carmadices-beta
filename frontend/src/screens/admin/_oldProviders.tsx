import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import AdminSidebar from '../../components/admin/Sidebar';
import axios from 'axios';
import ProviderCalendar from '../../components/admin/ProviderCalendar'; // Import the ProviderCalendar component

const ProvidersPage = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [providers, setProviders] = useState([]);

    useEffect(() => {
        const checkAdminStatus = async () => {
            if (!user || !user.isAdmin) {
                console.log('User is not an admin or not logged in. Redirecting to login...');
                navigate('/login');
            }
        };

        checkAdminStatus();
    }, [user, navigate]);

    // Fetch providers
    useEffect(() => {
        const fetchProviders = async () => {
            try {
                const { data } = await axios.get('https://www.carmadices-beta-11pk.vercel.app/user/providers', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
                });
                if (data.status === 'SUCCESS') {
                    setProviders(data.providers);
                } else {
                    console.error('Failed to fetch providers');
                }
            } catch (error) {
                console.error('Error fetching providers:', error);
            }
        };

        fetchProviders();
    }, []);

    // Function to clear time slots for a provider
    const handleClearTimeSlots = async (providerId) => {
        const confirmClear = window.confirm('Are you sure you want to clear all time slots for this provider?');
        if (!confirmClear) {
            return; // If user cancels, do nothing
        }

        try {
            const response = await axios.delete(`https://www.carmadices-beta-11pk.vercel.app/admin/${providerId}/clear-time-slots`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
            });

            if (response.status === 200) {
                // Update providers after clearing time slots
                setProviders(prevProviders =>
                    prevProviders.map(provider =>
                        provider._id === providerId ? { ...provider, timeSlots: [] } : provider
                    )
                );
                console.log('Time slots cleared successfully');
            } else {
                console.error('Failed to clear time slots');
            }
        } catch (error) {
            console.error('Error clearing time slots:', error);
        }
    };

    return (
        <div className="flex h-full">
            <AdminSidebar logout={logout} />
            <div className="bg-blue/25 flex-1 overflow-y-auto">
            <h1 className="p-8 lg:text-5xl text-4xl font-black bg-gray-800 text-white text-center lg:text-left">Providers</h1>
                <div className="p-8">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {providers.map((provider) => (
                            <div key={provider._id} className="bg-white p-4 rounded-lg shadow">
                                <p className="font-bold">Name: {provider.name}</p>
                                <p>Email: {provider.email}</p>
                                <p>Phone: {provider.phone}</p>
                                <p>First Name: {provider.firstName}</p>
                                <p>ID: {provider._id}</p>
                                <p>Cash: {provider.cash}</p>
                                <div className="w-fit">
                                <ProviderCalendar provider={provider} /> {/* Render the ProviderCalendar for each provider */}
                                </div>
                                <button
                                    onClick={() => handleClearTimeSlots(provider._id)}
                                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg mt-2"
                                >
                                    Clear Time Slots
                                </button>
                                {/* You can display more information about the provider here */}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProvidersPage;
