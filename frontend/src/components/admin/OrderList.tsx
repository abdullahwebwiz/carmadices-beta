import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faUser, faMoneyBill, faArrowLeft, faXmark, faMapPin, faMap } from '@fortawesome/free-solid-svg-icons';
import OrderModal from './OrderModal'; // Import the OrderModal component
import axios from 'axios'; // Don't forget to import axios

interface Order {
    _id: string;
    userId: string;
    // Add other properties as needed
}

const OrderList: React.FC<{ orders: Order[] }> = ({ orders }) => {
    const [sortedOrders, setSortedOrders] = useState([]);
    const [sortBy, setSortBy] = useState('createdAt');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('All'); // 'all' indicates no filter is applied
    const [selectedOrder, setSelectedOrder] = useState(null); // State to store the selected order for the modal
    const [modalIsOpen, setModalIsOpen] = useState(false); // State to manage modal open/close

    const sortOrders = (criteria) => {
        const sorted = [...orders].sort((a, b) => {
            if (criteria === 'createdAt') {
                return new Date(b[sortBy]) - new Date(a[sortBy]);
            } else {
                return a[criteria].localeCompare(b[criteria]);
            }
        });
        setSortedOrders(sorted);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const year = date.getFullYear();
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // Handle midnight (0 hours)
        const minutesString = minutes < 10 ? '0' + minutes : minutes;
        return `${month}/${day}/${year} ${hours}:${minutesString} ${ampm}`;
    };

    useEffect(() => {
        sortOrders(sortBy);
    }, [orders, sortBy]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    // Search query
    const filteredOrders = sortedOrders.filter(order => {
        // Check if the order matches the search query
        const matchesSearchQuery = order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.serviceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.totalPrice.toString().includes(searchQuery) ||
            order.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.paymentStatus.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.timeSlot.serviceProvider.toLowerCase().includes(searchQuery.toLowerCase());

        // Check if the order matches the selected status (if a specific status is selected)
        const matchesStatus = filterStatus === 'All' || order.status === filterStatus;

        return matchesSearchQuery && matchesStatus;
    });

    // Order status update
    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        try {
            const authToken = localStorage.getItem('authToken'); // Fetch your auth token from local storage or wherever it's stored
            if (!authToken) {
                console.error('Authorization token not found.');
                // Handle the case where the auth token is missing
                return;
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${authToken}`, // Include the token in the request headers
                },
            };

            const response = await axios.put(`/admin/orders/${orderId}/approve`, null, config);
            if (response.status === 200) {
                // If the API request is successful, update the local order state or perform necessary actions
                console.log('Order status updated successfully:', response.data);
                // Optionally update the local order state or perform other actions
                setSelectedOrder(null); // Close the modal after update
                setModalIsOpen(false); // Close the modal after update
            }
        } catch (error) {
            console.error('Error approving order:', error);
            // Handle error, show message to user, etc.
        }
    };


    // Function to handle opening the modal
    const handleOpenModal = (orderId) => {
        const selected = orders.find(order => order._id === orderId);
        setSelectedOrder(selected);
        setModalIsOpen(true);
    };

    // Function to handle closing the modal
    const handleCloseModal = () => {
        setSelectedOrder(null);
        setModalIsOpen(false);
    };

    return (
        <div className="flex flex-col mx-auto">
            <div className="flex lg:flex-row lg:items-center flex-col mb-4 bg-white p-4 rounded-lg border border-gray-300">

                {/* Sort by */}
                <div>
                    <label htmlFor="sort" className="mr-2 lg:inline hidden text-sm">Sort By:</label>
                    <select id="sort" className="p-2 lg:inline hidden border border-gray-300 rounded-md" onChange={(e) => setSortBy(e.target.value)}>
                        <option value="createdAt">Date</option>
                    </select>

                    {/* Divider */}
                    <p className="lg:inline px-4 hidden text-gray-300">|</p>

                    <div className="flex flex-col lg:inline gap-2 rounded-lg mb-2">
                        <label htmlFor="statusFilter" className="mr-2">Filter by status:</label>
                        <select
                            id="statusFilter"
                            className="border lg:h-auto h-11 py-2 border-gray-300 bg-white rounded-md"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="All">All</option>
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            {/* Add more status options as needed */}
                        </select>
                    </div>

                </div>

                {/* Divider */}
                <p className="lg:inline px-4 hidden text-gray-300">|</p>

                {/* Search orders */}
                <div className="lg:flex items-center w-full flex-1">
                    <label htmlFor="sort" className="lg:inline hidden mr-2 text-sm">Search:</label>
                    <input type="text" placeholder="Search orders..." value={searchQuery} onChange={handleSearch} className="p-2 border border-gray-300 rounded-md lg:w-fit w-full" />
                </div>
            </div>

            <ul className="grid grid-cols-2 gap-8">
                {filteredOrders.map(order => (

                    <li key={order._id} className="bg-white border border-gray-300 rounded-md p-4">

                        {/* ID's and DATE */}
                        <div className="flex justify-between">
                            <div className="flex w-full lg:flex-row flex-col lg:gap-4 gap-2">
                                <p><span className="font-bold">Order ID:</span> {order._id}</p>
                                <p><span className="font-bold">User ID:</span> {order.userId}</p>
                                <p><span className="font-bold">Created At:</span> {formatDate(order.createdAt)}</p>
                                <p><span className="font-bold">Status:</span> {order.status}</p>
                                <div className="lg:hidden flex w-full flex-col lg:flex-row gap-2 rounded-lg">
                                    <label htmlFor={`status-${order._id}`}><p className="font-bold">Update Status:</p></label>
                                    <select
                                        id={`status-${order._id}`}
                                        value={order.status}
                                        onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)} // Fix: Correct function name
                                        className="border border-gray-300 bg-white h-11 lg:h-auto rounded-md">
                                        <option value="Pending">Pending</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                        {/* Add more status options as needed */}
                                    </select>
                                </div>
                            </div>
                            <div className="w-fit">
                                {/* Status */}
                                <div className="lg:flex hidden flex-col lg:flex-row gap-2 lg:items-center rounded-lg">
                                    <label htmlFor={`status-${order._id}`}>Update Status:</label>
                                    <select
                                        id={`status-${order._id}`}
                                        value={order.status}
                                        onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)} // Fix: Correct function name
                                        className="border border-gray-300 bg-white rounded-md">
                                        <option value="Pending">Pending</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                        {/* Add more status options as needed */}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="flex">
                            {/* Customer Data */}
                            <div className="flex w-full lg:flex-row flex-col lg:gap-4">
                                <div className="flex flex-col border p-4 mt-4 rounded-lg">
                                    <p className="text-lg font-black">Customer</p>
                                    <p><span className="font-bold"><FontAwesomeIcon icon={faUser} className="w-3 mr-2" /></span>{order.customerName}</p>
                                    <p><span className="font-bold"><FontAwesomeIcon icon={faEnvelope} className="w-3 mr-2" /></span>{order.customerEmail}</p>
                                    <p><span className="font-bold"><FontAwesomeIcon icon={faPhone} className="w-3 mr-2" /></span>{order.customerPhone}</p>
                                </div>

                                {/* Order Data */}
                                <div className="flex flex-col border my-auto p-4 mt-4 rounded-lg">
                                    <p className="text-lg font-black">Order</p>
                                    <p><span className="font-bold">Service:</span> {order.serviceType}</p>
                                    <p>
                                        <span className="font-bold">Headlight Tint: </span>
                                        {order.isTint ? 'Yes' : 'No'}
                                    </p>
                                    {order.isTint && (
                                        <p><span className="font-bold">Tint Color:</span> {order.tintColor}</p>
                                    )}
                                    <p><span className="font-bold">Total Price:</span> ${parseFloat(order.totalPrice).toFixed(2)}</p>
                                    <p><span className="font-bold">Payment Status:</span> {order.paymentStatus}</p>
                                </div>

                                {/* Provider Data */}
                                <div className="flex flex-col border my-auto p-4 mt-4 rounded-lg">
                                    <p className="text-lg font-black">Provider</p>
                                    <p><span className="font-bold">Assigned to</span> {order.timeSlot.serviceProvider}</p>
                                    <p><span className="font-bold">Scheduled</span> {formatDate(order.timeSlot.scheduledDate)}</p>
                                </div>
                                <div>
                                </div>

                            </div>

                        </div>
                        <p className="p-4 border border-gray-200 rounded-xl mt-4"><span className="font-bold"><FontAwesomeIcon icon={faMapPin} className="w-3 mr-2" /></span>{order.shippingAddress}</p>

                        {/* Open Order Modal */}
                        <button onClick={() => handleOpenModal(order._id)} className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md">
                            View Details
                        </button>
                        
                        {/* Mark as Approved Button */}
                        <button onClick={() => handleUpdateOrderStatus(order._id, 'Approved')} className="mt-4 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md">
                            Mark as Approved
                        </button>

                    </li>
                ))}
            </ul>

            {/* Render OrderModal if selectedOrder is not null */}
            {selectedOrder && (
                <OrderModal
                    isOpen={modalIsOpen}
                    onClose={handleCloseModal}
                    order={selectedOrder}
                    placeholderImage={placeholderImage}
                    onUpdateOrderStatus={handleUpdateOrderStatus}
                />
            )}
        </div>
    );
};

export default OrderList;
