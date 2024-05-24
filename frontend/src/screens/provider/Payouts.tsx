import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import ProviderSidebar from '../../components/provider/Sidebar';
import axios from 'axios';

const ProviderPayouts = () => {
    const { user, logout, fetchProfileData } = useAuth();
    const navigate = useNavigate();
    const [cash, setCash] = useState(0);
    const [payoutAmount, setPayoutAmount] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user || !user.isProvider) {
            navigate('/login');
            return;
        }
    
        // Fetch user's cash when the component mounts
        const fetchUserCash = async () => {
            try {
                await fetchProfileData(); // Ensure user data is up-to-date
                // Check if user exists and has cash property before accessing
                if (user && user.cash !== undefined) {
                    setCash(user.cash);
                }
            } catch (error) {
                console.error('Error fetching user cash:', error);
                setError('Failed to fetch user cash. Please try again.');
            }
        };
    
        fetchUserCash();
    }, []); // Empty dependency array ensures useEffect runs only once when the component mounts
    

    const handlePayoutRequest = async () => {
        // Round the payout amount to 2 decimal places
        const roundedPayoutAmount = parseFloat(payoutAmount).toFixed(2);
        
        if (parseFloat(roundedPayoutAmount) > cash) {
            setError('Payout amount exceeds your available cash.');
            return;
        }
    
        try {
            // Make API call to request payout
            // Ensure to pass the userToken for authentication
            const response = await axios.post(
                '/api/payout/request',
                { amount: parseFloat(roundedPayoutAmount) },
                { headers: { Authorization: `Bearer ${userToken}` } }
            );
            console.log('Payout requested successfully:', response.data);
            // Optionally, you can update the UI or show a success message here
        } catch (error) {
            console.error('Error requesting payout:', error);
            setError('Failed to request payout. Please try again.');
        }
    };

    return (
        <div className="flex h-full">
            {/* Sidebar */}
            <ProviderSidebar logout={logout} />
            {/* Content Area */}
            <div className="bg-blue/25 flex-1 overflow-y-auto">
            <h1 className="p-8 lg:text-5xl text-4xl font-black bg-gray-800 text-white text-center lg:text-left">Payouts</h1>
                <div className="flex flex-col p-8">
                    <h1 className="text-2xl font-black mb-4">Payouts</h1>
                    <div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col w-fit">
                        <p className="text-xl mb-4">Your current balance: <strong>${cash.toFixed(2)}</strong></p>
                        <div className="flex flex-col gap-4">
                        <input
                            type="number"
                            placeholder="Enter payout amount"
                            value={payoutAmount}
                            className="border border-green-400 p-4 rounded-lg"
                            onChange={(e) => setPayoutAmount(e.target.value)}
                        />
                        <button
                        className="p-4 bg-blue rounded-lg text-white"
                        onClick={handlePayoutRequest}>Request Payout</button>
                        </div>
                        {error && <p className="text-red-500">{error}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProviderPayouts;
