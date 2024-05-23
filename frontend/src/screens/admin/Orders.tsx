import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import AdminSidebar from '../../components/admin/Sidebar';
import axios from 'axios';
import { ThreeDots } from 'react-loader-spinner';
import OrderModal from '../../components/admin/OrderModal';

const OrdersPage = () => {
    const { user, logout, isAdmin } = useAuth();
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
    const [paginationButtons, setPaginationButtons] = useState([]);
    const placeholderImage = '../src/assets/300x300-placeholder.jpg';

    // Function to handle search input changes
    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    // Function to format date as MM/DD/YYYY hh:mm am/pm
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        };
        return date.toLocaleString('en-US', options);
    };

    // Function to get current orders for display
    const getCurrentOrders = () => {
        const start = (currentPage - 1) * ordersPerPage;
        const end = start + ordersPerPage;
        return filteredOrders.slice(start, end);
    };

    // Modal control functions
    const openModal = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedOrder(null);
        setIsModalOpen(false);
    };

    const approveOrder = async (orderId) => {
        try {
            const response = await axios.put(`https://carmadices-beta-11pk.vercel.app/admin/order/${orderId}/approve`, {
                adminCheck: true
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
            });
            console.log('Order approved:', response.data);
    
            // Update local state to reflect the change
            const updatedOrders = orders.map(order => {
                if (order._id === orderId) {
                    return { ...order, adminCheck: true };
                }
                return order;
            });
            setOrders(updatedOrders);
            setFilteredOrders(updatedOrders.filter(order => 
                (statusFilter === 'All' ||
                (statusFilter === 'Completed' && order.status === 'Completed' && order.adminCheck === false) ||
                (statusFilter === 'Approved' && order.status === 'Completed' && order.adminCheck === true) ||
                (statusFilter !== 'All' && statusFilter !== 'Completed' && statusFilter !== 'Approved' && order.status === statusFilter))));
        } catch (error) {
            console.error('Error approving order:', error);
            // Optionally handle error, such as showing an alert or notification
        }
    };

    const undoApproveOrder = async (orderId) => {
        try {
            const response = await axios.put(`https://carmadices-beta-11pk.vercel.app/admin/order/${orderId}/undo-approve`, {
                adminCheck: false
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
            });
            console.log('Order approval undone:', response.data);
    
            // Update local state to reflect the change
            const updatedOrders = orders.map(order => {
                if (order._id === orderId) {
                    return { ...order, adminCheck: false };
                }
                return order;
            });
            setOrders(updatedOrders);
            setFilteredOrders(updatedOrders.filter(order => 
                (statusFilter === 'All' ||
                (statusFilter === 'Completed' && order.status === 'Completed' && order.adminCheck === false) ||
                (statusFilter === 'Approved' && order.status === 'Completed' && order.adminCheck === true) ||
                (statusFilter !== 'All' && statusFilter !== 'Completed' && statusFilter !== 'Approved' && order.status === statusFilter))));
        } catch (error) {
            console.error('Error undoing order approval:', error);
            // Optionally handle error, such as showing an alert or notification
        }
    };

    const handleChangeProviderForOrder = async (orderId, providerId) => {
        try {
            const accessToken = localStorage.getItem('userToken');
            const response = await fetch(`https://carmadices-beta-11pk.vercel.app/user/order/${orderId}/change-provider`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ providerId }),
            });
            if (response.ok) {
                console.log('Provider changed successfully');
                // Optionally, you can update the order state or fetch updated data
            } else {
                console.error('Failed to change provider for order:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error changing provider for order:', error);
        }
    };    

    // Fetch all orders once on component mount
    useEffect(() => {
            const fetchOrders = async () => {
                setLoading(true);
                try {
                    const response = await axios.get('https://carmadices-beta-11pk.vercel.app/admin/orders', {
                        headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
                    });
                    setOrders(response.data.orders || []);
                    setLoading(false);
                } catch (error) {
                    console.error('Failed to fetch orders:', error);
                    setLoading(false);
                }
            };
    
            if (isAdmin) {
                fetchOrders();
            } else {
                navigate('/login');
            }
    }, [isAdmin, navigate]);
    
    // Filter orders based on search term and status filter
    useEffect(() => {
            const filtered = orders.filter(order => {
                const matchesStatus = (statusFilter === 'All' || 
                                      (statusFilter === 'Completed' && order.status === 'Completed' && order.adminCheck === false) ||
                                      (statusFilter === 'Approved' && order.status === 'Completed' && order.adminCheck === true) ||
                                      (statusFilter !== 'All' && statusFilter !== 'Completed' && statusFilter !== 'Approved' && order.status === statusFilter));
                const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                      order.customerPhone.toLowerCase().includes(searchTerm.toLowerCase());
                return matchesStatus && matchesSearch;
            });
            setFilteredOrders(filtered);
            setCurrentPage(1); // Reset to first page on filter change
    }, [orders, searchTerm, statusFilter]);
        
    // Pagination button generation
    useEffect(() => {
            const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
            const buttons = Array.from({ length: totalPages }, (_, index) => (
                <button key={index} onClick={() => setCurrentPage(index + 1)}
                        className={`px-3 py-1 mx-1 rounded-lg border ${currentPage === index + 1 ? 'bg-blue text-white' : 'bg-white text-black'} hover:bg-blue hover:text-white`}>
                    {index + 1}
                </button>
            ));
            setPaginationButtons(buttons);
    }, [currentPage, filteredOrders.length, ordersPerPage]);

    return (
        <div className="flex h-full">
            <AdminSidebar logout={logout} />
            <div className="bg-blue/25 flex-1 overflow-y-auto">
                <h1 className="p-8 lg:text-5xl text-4xl font-black bg-gray-800 text-white text-center lg:text-left">Orders</h1>
                <div className="lg:p-8 p-4">
                    <div className="grid grid-cols-2 lg:grid-cols-4 mb-4 gap-4">
                        {['All', 'Pending', 'Completed', 'Approved'].map(status => (
                            <button key={status} className={`p-4 rounded-md transition-colors duration-300 ${statusFilter === status ? 'bg-blue text-white' : 'bg-gray-800 text-white'} hover:bg-blue hover:text-white`}
                                    onClick={() => setStatusFilter(status)}>
                                {status}
                            </button>
                        ))}
                    </div>
                    <input type="text" placeholder="Search orders..." className="border rounded-lg p-4 w-full mb-4" value={searchTerm} onChange={handleSearch} />
                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="flex w-full items-center justify-center">
                                <ThreeDots visible={true} height="30" width="40" color="#0072DC" radius="9" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClass="" />
                            </div>
                        ) : (
                            <table className="min-w-full text-xs lg:text-base divide-y divide-gray-200 rounded-lg overflow-hidden">
                                <thead className="bg-blue">
                                    <tr className="h-14">
                                        <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider hidden lg:table-cell">Order ID</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">Created At</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider hidden lg:table-cell">Customer</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider hidden lg:table-cell">Type</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">Price</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider hidden lg:table-cell">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {getCurrentOrders().map(order => (
                                        <tr key={order._id} className="hover:bg-blue/10" onClick={() => openModal(order)}>
                                            <td className="px-4 py-2 text-xs whitespace-nowrap hidden lg:table-cell">{order._id}</td>
                                            <td className="px-4 py-2 whitespace-nowrap">{formatDate(order.createdAt)}</td>
                                            <td className="px-4 py-2 whitespace-nowrap hidden lg:table-cell">
                                                <div className="text-sm">
                                                    <div className="font-bold text-blue">{order.customerName}</div>
                                                    <div>{order.customerEmail}</div>
                                                    <div>{order.customerPhone}</div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap hidden lg:table-cell">{order.serviceType}</td>
                                            <td className="px-4 py-2 whitespace-nowrap">${Number(order.totalPrice).toFixed(2)}</td>
                                            <td className="px-4 py-2 whitespace-nowrap hidden lg:table-cell">{order.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        {filteredOrders.length > ordersPerPage && (
                            <div className="flex justify-center mt-4">
                                {paginationButtons}
                            </div>
                        )}
                    </div>
                </div>
                
                <OrderModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    order={selectedOrder}
                    placeholderImage={placeholderImage}
                    onUpdateOrderStatus={approveOrder}
                    onUndoApprove={undoApproveOrder}
                    onChangeProviderForOrder={handleChangeProviderForOrder}
                />
            </div>
        </div>
    );
};

export default OrdersPage;
