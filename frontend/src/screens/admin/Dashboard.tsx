import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import AdminSidebar from '../../components/admin/Sidebar';
import axios from 'axios';
import { ThreeDots } from 'react-loader-spinner';


const AdminDashboard = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        completedOrders: 0,
        providerPayout: 0,
        netProfit: 0,
        salesTax: 0,
        stripeFees: 0
    });
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('thisMonth'); // Default time range

    useEffect(() => {
        const checkAdminStatus = async () => {
            if (!user || !user.isAdmin) {
                console.log('User is not an admin or not logged in. Redirecting to login...');
                navigate('/login');
            } else {
                fetchDashboardData(timeRange);
            }
        };

        checkAdminStatus();
    }, [user, navigate, timeRange]);

    const fetchDashboardData = async (selectedTimeRange) => {
        setLoading(true);

        let startDate, endDate;

        // Calculate start and end dates based on selected time range
        switch (selectedTimeRange) {
            case 'thisMonth':
                startDate = getStartOfMonth();
                endDate = getEndOfMonth();
                break;
            case 'lastMonth':
                startDate = getStartOfLastMonth();
                endDate = getEndOfLastMonth();
                break;
            case 'thisWeek':
                startDate = getStartOfWeek();
                endDate = getEndOfWeek();
                break;
            case 'today':
                startDate = getStartOfToday();
                endDate = getEndOfToday();
                break;
            case 'yesterday':
                startDate = getStartOfYesterday();
                endDate = getEndOfYesterday();
                break;
            case 'thisYear':
                startDate = getStartOfYear();
                endDate = getEndOfYear();
                break;
            default:
                startDate = getStartOfMonth();
                endDate = getEndOfMonth();
                break;
        }

        try {
            const response = await axios.get('https://mycarmedics.com:8080/admin/dashboard-data', {
                params: { startDate, endDate },
                headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
            });

            const data = response.data.data;
            const calculatedData = calculateDashboardData(data);
            setDashboardData(calculatedData);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
            setLoading(false);
        }
    };

    const handleTimeRangeChange = (selectedTimeRange) => {
        setTimeRange(selectedTimeRange);
    };

    // Helper functions to get start and end dates for different time ranges
    const getStartOfMonth = () => {
        const today = new Date();
        return new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
    };

    const getEndOfMonth = () => {
        const today = new Date();
        return new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString();
    };

    const getStartOfLastMonth = () => {
        const today = new Date();
        return new Date(today.getFullYear(), today.getMonth() - 1, 1).toISOString();
    };

    const getEndOfLastMonth = () => {
        const today = new Date();
        return new Date(today.getFullYear(), today.getMonth(), 0).toISOString();
    };

    const getStartOfWeek = () => {
        const today = new Date();
        const diff = today.getDate() - today.getDay(); // Start of current week (Sunday)
        return new Date(today.setDate(diff)).toISOString();
    };

    const getEndOfWeek = () => {
        const today = new Date();
        const diff = today.getDate() - today.getDay() + 6; // End of current week (Saturday)
        return new Date(today.setDate(diff)).toISOString();
    };

    const getStartOfToday = () => {
        const today = new Date();
        return new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
    };

    const getEndOfToday = () => {
        const today = new Date();
        return new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999).toISOString();
    };

    const getStartOfYesterday = () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate()).toISOString();
    };

    const getEndOfYesterday = () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59, 999).toISOString();
    };

    const getStartOfYear = () => {
        const today = new Date();
        return new Date(today.getFullYear(), 0, 1).toISOString();
    };

    const getEndOfYear = () => {
        const today = new Date();
        return new Date(today.getFullYear(), 11, 31, 23, 59, 59, 999).toISOString();
    };

        // Function to calculate dashboard data
        const calculateDashboardData = (data) => {
            const { totalOrders, totalRevenue } = data;
    
            // Calculate Provider's Share
            const providerPayout = (totalRevenue * 0.70).toFixed(2);
    
            // Calculate Sales Tax (6.5% of total revenue)
            const salesTaxRate = 0.065;
            const salesTax = (totalRevenue * salesTaxRate).toFixed(2);
    
            // Calculate Stripe Fees (2.9% of total revenue + $0.30 per order)
            const stripeFeeRate = 0.029;
            const stripeFeePerOrder = 0.30;
            const stripeFees = ((totalRevenue * stripeFeeRate) + (totalOrders * stripeFeePerOrder)).toFixed(2);
    
            // Calculate Net Profit
            const netProfit = (totalRevenue - providerPayout - salesTax - stripeFees).toFixed(2);
    
            return {
                ...data,
                providerPayout,
                salesTax,
                stripeFees,
                netProfit
            };
        };

    return (
        <div className="flex h-full">
            <AdminSidebar logout={logout} />
            <div className="bg-blue/25 flex-1 overflow-y-auto">
            <h1 className="p-8 lg:text-5xl text-4xl font-black bg-gray-800 text-white text-center lg:text-left">Dashboard</h1>
                <div className="lg:p-8 p-4">
                    <div className="flex flex-col gap-4">
                        <div className="grid lg:grid-cols-6 grid-cols-2 gap-4">
                            <button
                                className={`p-4 rounded-md transition-colors duration-300 ${timeRange === 'thisMonth' ? 'bg-blue text-white' : 'bg-gray-800 text-white'} hover:bg-blue hover:text-white`}
                                onClick={() => handleTimeRangeChange('thisMonth')}
                            >
                                This Month
                            </button>
                            <button
                                className={`p-4 rounded-md transition-colors duration-300 ${timeRange === 'lastMonth' ? 'bg-blue text-white' : 'bg-gray-800 text-white'} hover:bg-blue hover:text-white`}
                                onClick={() => handleTimeRangeChange('lastMonth')}
                            >
                                Last Month
                            </button>
                            <button
                                className={`p-4 rounded-md transition-colors duration-300 ${timeRange === 'thisWeek' ? 'bg-blue text-white' : 'bg-gray-800 text-white'} hover:bg-blue hover:text-white`}
                                onClick={() => handleTimeRangeChange('thisWeek')}
                            >
                                This Week
                            </button>
                            <button
                                className={`p-4 rounded-md transition-colors duration-300 ${timeRange === 'today' ? 'bg-blue text-white' : 'bg-gray-800 text-white'} hover:bg-blue hover:text-white`}
                                onClick={() => handleTimeRangeChange('today')}
                            >
                                Today
                            </button>
                            <button
                                className={`p-4 rounded-md transition-colors duration-300 ${timeRange === 'yesterday' ? 'bg-blue text-white' : 'bg-gray-800 text-white'} hover:bg-blue hover:text-white`}
                                onClick={() => handleTimeRangeChange('yesterday')}
                            >
                                Yesterday
                            </button>
                            <button
                                className={`p-4 rounded-md transition-colors duration-300 ${timeRange === 'thisYear' ? 'bg-blue text-white' : 'bg-gray-800 text-white'} hover:bg-blue hover:text-white`}
                                onClick={() => handleTimeRangeChange('thisYear')}
                            >
                                This Year
                            </button>
                        </div>
                        {!loading ? (
                            <div className="grid lg:grid-cols-4 grid-cols-1 gap-4">
                                <div className="bg-white p-8 w-full rounded-lg border border-gray-300 items-center text-center flex flex-col gap-2">
                                    <p className="font-bold">Total Orders</p>
                                    <p className="text-4xl">{dashboardData.totalOrders}</p>
                                </div>
                                <div className="bg-white p-8 w-full rounded-lg border border-gray-300 items-center text-center flex flex-col gap-2">
                                    <p className="font-bold">Total Revenue</p>
                                    <p className="text-4xl">${dashboardData.totalRevenue}</p>
                                </div>
                                <div className="bg-red-100 p-8 w-full rounded-lg border border-gray-300 items-center text-center flex flex-col gap-2">
                                    <p className="font-bold">Providers Share</p>
                                    <p className="text-4xl">${dashboardData.providerPayout}</p>
                                </div>
                                <div className="bg-blue/25 p-8 w-full rounded-lg border border-blue/30 items-center text-center flex flex-col gap-2">
                                    <p className="font-bold">Net Profit</p>
                                    <p className="text-4xl">${dashboardData.netProfit}</p>
                                </div>
                                <div className="bg-white p-8 w-full rounded-lg border border-gray-300 items-center text-center flex flex-col gap-2">
                                    <p className="font-bold">Pending Orders</p>
                                    <p className="text-4xl">{dashboardData.pendingOrders}</p>
                                </div>
                                <div className="bg-white p-8 w-full rounded-lg border border-gray-300 items-center text-center flex flex-col gap-2">
                                    <p className="font-bold">Completed Orders</p>
                                    <p className="text-4xl">{dashboardData.completedOrders}</p>
                                </div>
                                <div className="bg-white p-8 w-full rounded-lg border border-gray-300 items-center text-center flex flex-col gap-2">
                                    <p className="font-bold">Sales Tax</p>
                                    <p className="text-4xl">${dashboardData.salesTax}</p>
                                </div>
                                <div className="bg-white p-8 w-full rounded-lg border border-gray-300 items-center text-center flex flex-col gap-2">
                                    <p className="font-bold">Stripe Fees</p>
                                    <p className="text-4xl">${dashboardData.stripeFees}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="grid lg:grid-cols-4 grid-cols-1 gap-4">
                                <div className="bg-white p-8 w-full rounded-lg border border-gray-300 items-center text-center flex flex-col gap-2">
                                    <p className="font-bold">Total Orders</p>
                                    <ThreeDots visible={true} height="30" width="40" color="#0072DC" radius="9" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClass=""/>
                                </div>
                                <div className="bg-white p-8 w-full rounded-lg border border-gray-300 items-center text-center flex flex-col gap-2">
                                    <p className="font-bold">Total Revenue</p>
                                    <ThreeDots visible={true} height="30" width="40" color="#0072DC" radius="9" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClass=""/>
                                </div>
                                <div className="bg-red-100 p-8 w-full rounded-lg border border-gray-300 items-center text-center flex flex-col gap-2">
                                    <p className="font-bold">Providers Share</p>
                                    <ThreeDots visible={true} height="30" width="40" color="#0072DC" radius="9" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClass=""/>
                                </div>
                                <div className="bg-blue/25 p-8 w-full rounded-lg border border-blue/30 items-center text-center flex flex-col gap-2">
                                    <p className="font-bold">Net Profit</p>
                                    <ThreeDots visible={true} height="30" width="40" color="#0072DC" radius="9" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClass=""/>
                                </div>
                                <div className="bg-white p-8 w-full rounded-lg border border-gray-300 items-center text-center flex flex-col gap-2">
                                    <p className="font-bold">Pending Orders</p>
                                    <ThreeDots visible={true} height="30" width="40" color="#0072DC" radius="9" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClass=""/>
                                </div>
                                <div className="bg-white p-8 w-full rounded-lg border border-gray-300 items-center text-center flex flex-col gap-2">
                                    <p className="font-bold">Completed Orders</p>
                                    <ThreeDots visible={true} height="30" width="40" color="#0072DC" radius="9" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClass=""/>
                                </div>
                                <div className="bg-white p-8 w-full rounded-lg border border-gray-300 items-center text-center flex flex-col gap-2">
                                    <p className="font-bold">Sales Tax</p>
                                    <ThreeDots visible={true} height="30" width="40" color="#0072DC" radius="9" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClass=""/>
                                </div>
                                <div className="bg-white p-8 w-full rounded-lg border border-gray-300 items-center text-center flex flex-col gap-2">
                                    <p className="font-bold">Stripe Fees</p>
                                    <ThreeDots visible={true} height="30" width="40" color="#0072DC" radius="9" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClass=""/>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
