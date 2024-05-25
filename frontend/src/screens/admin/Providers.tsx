import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import AdminSidebar from '../../components/admin/Sidebar';
import axios from 'axios';
import { ThreeDots } from 'react-loader-spinner';
import ProviderModal from '../../components/admin/ProvidersModal';
import copy from 'copy-to-clipboard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faIdCard } from '@fortawesome/free-solid-svg-icons';

const ProvidersPage = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [providersWithOrders, setProvidersWithOrders] = useState([]);
    const [filteredProviders, setFilteredProviders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const placeholderImage = '../src/assets/300x300-placeholder.jpg';

    useEffect(() => {
        const fetchProviders = async () => {
            try {
                const response = await axios.get('https://www.mycarmedics.com:8080/user/providers', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
                });
                console.log('Response:', response.data);
                if (response.data.status === 'SUCCESS') {
                    const providers = response.data.providers;
                    const providersWithOrderCounts = await fetchOrderCounts(providers);
                    setProvidersWithOrders(providersWithOrderCounts);
                    setFilteredProviders(providersWithOrderCounts);
                } else {
                    console.error('Failed to fetch providers:', response.data.error || 'Unknown error');
                }
            } catch (error : any) {
                console.error('Failed to fetch providers:', error.response || error.message || error);
            } finally {
                setLoading(false);
            }
        };

        const checkAdminStatus = async () => {
            if (isAdmin) {
                fetchProviders();
            } else {
                console.log('User is not an admin. Redirecting to login...');
                navigate('/login');
            }
        };

        checkAdminStatus();
    }, [isAdmin, navigate]);

    const fetchOrderCounts = async (providers : any) => {
        try {
            const providersWithOrderCounts = await Promise.all(providers.map(async (provider : any) => {
                try {
                    const orderCountsResponse = await axios.get(`https://www.mycarmedics.com:8080/admin/order/count?providerId=${provider._id}`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
                    });

                    console.log('Provider ID:', provider._id);
                    console.log('Order Counts Response:', orderCountsResponse.data);

                    // Check if orderCounts exist in the response
                    if (orderCountsResponse.data.orderCounts !== undefined) {
                        const orderCounts = orderCountsResponse.data.orderCounts || { completed: 0, pending: 0 }; // Default values if not available
                        // Update the provider object with orderCounts
                        const updatedProvider = {
                            ...provider,
                            orderCounts: orderCounts
                        };
                        console.log('Updated Provider:', updatedProvider);
                        return updatedProvider;
                    } else {
                        console.error('Failed to fetch order counts for provider:', provider._id, orderCountsResponse.data.error || 'Unknown error');
                        // Return the provider with default orderCounts
                        return {
                            ...provider,
                            orderCounts: { completed: 0, pending: 0 }
                        };
                    }
                } catch (error : any) {
                    console.error('Error fetching order counts for provider:', provider._id, error.response || error.message || error);
                    // Return the provider with default orderCounts
                    return {
                        ...provider,
                        orderCounts: { completed: 0, pending: 0 }
                    };
                }
            }));

            console.log('Providers with Order Counts:', providersWithOrderCounts);
            return providersWithOrderCounts;
        } catch (error : any) {
            console.error('Failed to fetch order counts:', error.response || error.message || error);
            // Return the original providers with default orderCounts
            return providers.map((provider : any)=> ({
                ...provider,
                orderCounts: { completed: 0, pending: 0 }
            }));
        }
    };

    const handleSearch = (event : any) => {
        const searchTerm = event.target.value;
        setSearchTerm(searchTerm);

        const filtered = providersWithOrders.filter((provider : any) =>
            (provider.name && provider.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (provider.email && provider.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (provider.phone && provider.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (provider._id && provider._id.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredProviders(filtered);
    };

    const openModal = async (provider : any) => {
        console.log('Selected Provider:', provider);
        setSelectedProvider(provider);
        setIsModalOpen(true);

        const orders = await fetchOrders(provider._id);
        console.log('Orders for Provider:', orders);
    };

    const closeModal = () => {
        setSelectedProvider(null);
        setIsModalOpen(false);
    };

    const fetchOrders = async (providerId : any) => {
        try {
            const response = await axios.get(`https://www.mycarmedics.com:8080/admin/orders?providerId=${providerId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
            });
            console.log('Orders Response:', response.data);
            return response.data;
        } catch (error : any) {
            console.error('Failed to fetch orders:', error.response || error.message || error);
            return [];
        }
    };

    // Log providers and filteredProviders when they change
    useEffect(() => {
        console.log('Providers with Orders:', providersWithOrders);
    }, [providersWithOrders]);

    useEffect(() => {
        console.log('Filtered Providers:', filteredProviders);
    }, [filteredProviders]);

    return (
        <div className="flex h-full">
            <AdminSidebar logout={logout} />
            <div className="bg-blue/25 flex-1 overflow-y-auto">
                <h1 className="p-8 lg:text-5xl text-4xl font-black bg-gray-800 text-white text-center lg:text-left">Providers</h1>
                <div className="lg:p-8 p-4">
                    <input
                        type="text"
                        placeholder="Search providers..."
                        className="border rounded-lg p-2 w-full mb-4"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="flex w-full items-center justify-center">
                                <ThreeDots visible={true} height="30" width="40" color="#0072DC" radius="9" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClass="" />
                            </div>
                        ) : (
                            <table className="min-w-full text-xs lg:text-base divide-y divide-gray-200 rounded-lg overflow-hidden">
                                <thead className="bg-blue">
                                    <tr className="h-14">
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Phone</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">First Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Cash</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Orders (Pending/Completed)</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredProviders && filteredProviders.length > 0 ? (
                                        filteredProviders.map((provider : any) => (
                                            <tr key={provider._id} className="hover:bg-gray-100 cursor-pointer" onClick={() => openModal(provider)}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                    <FontAwesomeIcon icon={faEnvelope} className="mr-2 cursor-pointer" onClick={(e) => { e.stopPropagation(); copy(provider.email); alert('Email copied to clipboard!'); }} />
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">{provider.phone}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{provider.firstName}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                <FontAwesomeIcon icon={faIdCard} className="mr-2 cursor-pointer" onClick={(e) => { e.stopPropagation(); copy(provider._id); alert('Provider ID copied to clipboard!'); }} />
                                                    </div></td>
                                                <td className="px-6 py-4 whitespace-nowrap">${Number(provider.cash).toFixed(2)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {provider.orderCounts ? (
                                                        <>
                                                            <span className="text-green-600">{provider.orderCounts.completed || 0} Completed</span>
                                                            <span className="ml-2 text-yellow-600">{provider.orderCounts.pending || 0} Pending</span>
                                                        </>
                                                    ) : (
                                                        <span>No orders</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <button className="text-blue hover:text-blue-900">Edit</button>
                                                    <button className="text-red hover:text-red-900 ml-2">Delete</button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            {/* @ts-ignore */}
                                            <td colSpan ="7" className="px-6 py-4 text-center">No providers found.</td>
                                        </tr>
                                    )}
                                </tbody>

                            </table>
                        )}
                    </div>
                </div>
            </div>
            {/* Provider Modal */}
            <ProviderModal isOpen={isModalOpen} onClose={closeModal} provider={selectedProvider} placeholderImage={placeholderImage} />
        </div>
    );
};

export default ProvidersPage;
