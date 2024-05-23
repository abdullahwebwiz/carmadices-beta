import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import AdminSidebar from '../../components/provider/Sidebar';
import axios from 'axios';
import { ThreeDots } from 'react-loader-spinner';
import OrderModal from '../../components/provider/OrderModal';

const OrdersPage = () => {
    const { user, logout, isProvider } = useAuth(); // Change isAdmin to isProvider
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Completed');
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage] = useState(6);
    const placeholderImage = '../src/assets/300x300-placeholder.jpg';

    const loadOrders = async () => {
        // Fetch orders again
        try {
            const response = await axios.get('https://carmadices-beta-11pk.vercel.app/provider/assigned', {
                headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
            });
            console.log('Response:', response.data); // Log the entire response
            if (response.data.orders) {
                setOrders(response.data.orders);
                setFilteredOrders(response.data.orders);
            } else {
                console.error('Failed to fetch orders with user info:', response.data.error || 'Unknown error');
            }
        } catch (error) {
            console.error('Failed to fetch orders with user info:', error.response || error.message || error);
        }
    };

    // Function to get current orders for pagination
    const getCurrentOrders = () => {
        const filteredAndPaginatedOrders = filteredOrders.filter((order) =>
            order.status === statusFilter ||
            order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerPhone.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const indexOfLastOrder = currentPage * ordersPerPage;
        const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
        return filteredAndPaginatedOrders.slice(indexOfFirstOrder, indexOfLastOrder);
    };

    const handleSearch = (event) => {
        const searchTerm = event.target.value;
        setSearchTerm(searchTerm);

        const filtered = orders.filter((order) =>
            order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerPhone.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredOrders(filtered);
        setCurrentPage(1); // Reset page to 1 when search term changes
    };

    // Function to update order status in parent component
    const updateOrderStatus = (orderId, newStatus) => {
        // Update the status of the selected order in the parent component's state
        const updatedOrders = orders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
        );
        setOrders(updatedOrders);
    
        // Also update the filtered orders if necessary
        const updatedFilteredOrders = filteredOrders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
        );
        setFilteredOrders(updatedFilteredOrders);
    };    

    // Function to filter orders by status and adminCheck
    const filterOrdersByStatus = (status, showAdminChecked) => {
    let filtered = orders;

    if (status === 'Completed') {
        if (!showAdminChecked) {
            filtered = filtered.filter((order) => order.status === 'Completed' && order.adminCheck === false);
        } else {
            filtered = filtered.filter((order) => order.status === 'Completed');
        }
    } else if (status === 'Pending') {
        filtered = filtered.filter((order) => order.status === 'Pending');
    }

    if (showAdminChecked) {
        filtered = filtered.filter((order) => order.adminCheck === true);
    }

    setFilteredOrders(filtered);
    setCurrentPage(1); // Reset page to 1 when status filter changes
    };

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const openModal = (order) => {
        console.log('Selected Order:', order); // Log the selected order to check beforeImagePath and afterImagePath
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedOrder(null);
        setIsModalOpen(false);
    };

    // Function to format date as MM/DD/YYYY
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US');
    };

    useEffect(() => {
        const fetchOrdersWithUser = async () => {
            try {
                const response = await axios.get('https://carmadices-beta-11pk.vercel.app/provider/assigned', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
                });
                console.log('Response:', response.data); // Log the entire response
                if (response.data.orders) {
                    setOrders(response.data.orders);
                    setFilteredOrders(response.data.orders);
                } else {
                    console.error('Failed to fetch orders with user info:', response.data.error || 'Unknown error');
                }
            } catch (error) {
                console.error('Failed to fetch orders with user info:', error.response || error.message || error);
            } finally {
                setLoading(false); // Update loading state regardless of success or failure
            }
        };

        const checkProviderStatus = async () => { // Change the function name
            if (user && isProvider) { // Change isAdmin to isProvider
                fetchOrdersWithUser(); // Fetch orders with user information when component mounts
            } else {
                console.log('User is not a provider. Redirecting to login...'); // Change admin to provider
                navigate('/login');
            }
    };

    if (isProvider) { // Change isAdmin to isProvider
        checkProviderStatus(); // Change the function call
        }
    }, [user, isProvider, navigate]); // Change isAdmin to isProvider

    useEffect(() => {
        // Update filteredOrders whenever orders or statusFilter changes
        const filtered = orders.filter((order) => {
            if (statusFilter === 'Completed') {
                return order.status === 'Completed';
            } else if (statusFilter === 'Pending') {
                return order.status === 'Pending';
            } else {
                return true; // Show all orders when no specific filter is selected
            }
        });
        setFilteredOrders(filtered);
    }, [orders, statusFilter]);
    

    return (
        <div className="flex h-full">
            <AdminSidebar logout={logout} />
            <div className="bg-blue/25 flex-1 overflow-y-auto">
                <h1 className="p-8 lg:text-5xl text-4xl font-black bg-gray-800 text-white text-center lg:text-left">Orders</h1>
                <div className="lg:p-8 p-4">
                    <div className="grid grid-cols-2 lg:grid-cols-4 mb-4 gap-4">
                        <button
                            className={`p-4 rounded-md transition-colors duration-300 ${statusFilter === 'Completed' ? 'bg-blue text-white' : 'bg-gray-800 text-white'} hover:bg-blue hover:text-white`}
                            onClick={() => {
                                setStatusFilter('Completed');
                                filterOrdersByStatus('Completed'); // Update to call filterOrdersByStatus
                            }}
                        >
                            Completed
                        </button>
                        <button
                            className={`p-4 rounded-md transition-colors duration-300 ${statusFilter === 'Pending' ? 'bg-blue text-white' : 'bg-gray-800 text-white'} hover:bg-blue hover:text-white`}
                            onClick={() => {
                                setStatusFilter('Pending');
                                filterOrdersByStatus('Pending'); // Update to call filterOrdersByStatus
                            }}
                        >
                            Pending
                        </button>
                        <button
                            className={`p-4 rounded-md transition-colors duration-300 ${statusFilter === '' ? 'bg-blue text-white' : 'bg-gray-800 text-white'} hover:bg-blue hover:text-white`}
                            onClick={() => {
                                setStatusFilter('');
                                filterOrdersByStatus(''); // Update to call filterOrdersByStatus
                            }}
                        >
                            All
                        </button>
                        <button
                            className={`p-4 rounded-md transition-colors duration-300 ${statusFilter === 'Admin Checked' ? 'bg-blue text-white' : 'bg-gray-800 text-white'} hover:bg-blue hover:text-white`}
                            onClick={() => {
        setStatusFilter('AdminChecked');
        filterOrdersByStatus('AdminChecked', true); // Update to call filterOrdersByStatus with adminCheck filter
    }}
>
    Approved
</button>


                    </div>
                    <input
                        type="text"
                        placeholder="Search orders..."
                        className="border rounded-lg p-4 w-full mb-4"
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
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider hidden lg:table-cell">Order ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Order Created</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider hidden lg:table-cell">Customer</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider hidden lg:table-cell">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Price</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider hidden lg:table-cell">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider hidden lg:table-cell">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {getCurrentOrders().map((order) => (
                                        <tr key={order._id} className="hover:bg-gray-100" onClick={() => openModal(order)}>
                                            <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">{order._id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{formatDate(order.createdAt)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                                                <div>
                                                    <div>{order.customerEmail}</div>
                                                    <div>{order.customerPhone}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">{order.serviceType}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">${Number(order.totalPrice).toFixed(2)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">{order.status}</td>
                                            <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                                                <button className="text-blue-600 hover:text-blue-900">Edit</button>
                                                <button className="text-red-600 hover:text-red-900 ml-2">Cancel</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                    {/* Pagination */}
                    {filteredOrders.length > ordersPerPage && (
                        <div className="flex justify-center mt-4">
                            {Array.from({ length: Math.ceil(filteredOrders.length / ordersPerPage) }, (_, index) => (
                                <button
                                    key={index}
                                    className={`px-3 py-1 mx-1 rounded-lg border ${currentPage === index + 1 ? 'bg-blue text-white' : 'bg-white text-blue-500'} hover:bg-blue-500 hover:text-white`}
                                    onClick={() => paginate(index + 1)}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {/* Modal */}
            <OrderModal isOpen={isModalOpen} onClose={closeModal} order={selectedOrder} placeholderImage={placeholderImage} onUploadSuccess={loadOrders} onUpdateStatus={updateOrderStatus} authToken={sessionStorage.getItem('userToken')} />
        </div>
    );
};

export default OrdersPage;