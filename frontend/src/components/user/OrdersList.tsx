import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/authContext';
import SingleOrderModal from './SingleOrderModal';

const OrdersList: React.FC = () => {
    const { orders, fetchOrders, ordersLoading, ordersError } = useAuth();
    const [initialFetchDone, setInitialFetchDone] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const ordersPerPage = 3;
    // Slice orders to display only the current page
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

    useEffect(() => {
        // Fetch orders only when they haven't been loaded yet and there are no loading or error states
        if (!initialFetchDone && !ordersLoading && !ordersError) {
            fetchOrders();
            setInitialFetchDone(true); // Set initial fetch as done
        }
    }, [initialFetchDone, ordersLoading, ordersError, fetchOrders]); 

    const formatDate = (dateTimeString: string) => {
        const dateTime = new Date(dateTimeString);
        const options = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        };
        return new Intl.DateTimeFormat('en-US', options).format(dateTime);
    };
    

    const getTypeBackgroundColor = (type: string) => {
        return type === 'Product' ? 'bg-blue' : 'bg-purple-500';
    };

    const getStatusBackgroundColor = (status: string) => {
        switch (status) {
            case 'Pending':
                return 'bg-green-500';
            case 'Shipped':
                return 'bg-yellow-500';
            case 'Completed':
                return 'bg-gray-500';
            case 'In Progress':
                return 'bg-dark-blue';
            default:
                return '';
        }
    };

    const capitalizeFirstLetter = (word: string) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    };

    if (!orders || !Array.isArray(orders)) {
        return <div>Loading...</div>;
    }

    if (ordersError) {
        return <div>Error: {ordersError}</div>;
    }

    return (
        <div>
            <div className="lg:grid hidden lg:grid-cols-4 grid-cols-3 mb-2 gap-2 min-h-10">
                <p className="bg-white rounded-lg flex items-center justify-center border font-bold">Date</p>
                <p className="bg-white rounded-lg flex items-center justify-center border font-bold">Total</p>
                <p className="bg-white rounded-lg flex items-center justify-center border font-bold">Description</p>
                <p className="bg-white rounded-lg flex items-center justify-center border font-bold">Status</p>
            </div>
            {orders.length === 0 ? (
                <div className="bg-white p-4 rounded-lg text-center">Your order history is empty.</div>
            ) : (
                <ul>
{currentOrders.map((order) => (
                        <li
                            key={order._id}
                            className="lg:grid flex flex-col border lg:grid-cols-4 gap-2 bg-white rounded-lg p-4 mb-2 items-center"
                            onClick={() => setSelectedOrder(order)}
                        >
                            <div>
                                <p className="w-full lg:text-left text-center">Created at {formatDate(order.createdAt)}</p>
                                {order.timeSlot.scheduledDate && <p className="w-full lg:text-left text-center">Scheduled for {formatDate(order.timeSlot.scheduledDate)}</p>}
                            </div>

                            <p className="flex flex-col font-bold w-fit place-self-center">
                                <span className="lg:hidden mr-1 text-center">Total price</span>
                                <span className="text-center">${order.totalPrice.toFixed(2)}</span>
                                <span className="text-center">Payment {order.paymentStatus}</span>
                            </p>
                            {order.orderType === 'Service' ? (
                                <p className="flex flex-col items-center justify-center">
                                    <span className="font-semibold lg:bg-transparent lg:text-black lg:px-0 lg:py-0 px-4 py-1 rounded-full bg-blue text-white">{order.serviceType}</span>
                                    {order.isTint && (
                                    <span className="lg:mt-0 mt-1">Tint color: {order.tintColor}</span>
                                    )}

                                </p>
                            ) : (
                                <ul className="flex flex-col items-center">
                                    {order.items.map((item, index) => (
                                        <li key={index} className="flex items-center gap-2">
                                            <p className="text-gray-500 text-xs"> x{item.quantity}</p>
                                            <p className="text-sm">{item.name}</p>
                                            <p className="text-gray-500 text-xs">${item.price}</p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <div className="flex flex-row lg:flex hidden w-full ml-4 gap-1 flex-col items-center">
                                <p
                                    className={`rounded-xl h-fit px-2 py-1 w-fit text-white text-xs ${getTypeBackgroundColor(
                                        order.orderType
                                    )}`}
                                >
                                    {capitalizeFirstLetter(order.orderType)}
                                </p>
                                <p
                                    className={`rounded-xl h-fit px-4 py-1 w-fit text-white text-xs ${getStatusBackgroundColor(
                                        order.status
                                    )}`}
                                >
                                    {capitalizeFirstLetter(order.status)}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            <div className="flex justify-center my-4">
                {Array.from({ length: Math.ceil(orders.length / ordersPerPage) }, (_, index) => (
                    <button
                        key={index}
                        className={`mx-1 px-3 py-1 rounded-lg border ${currentPage === index + 1 ? 'bg-blue text-white' : 'bg-white text-black'} hover:bg-blue hover:text-white`}
                        onClick={() => setCurrentPage(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
            <SingleOrderModal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} order={selectedOrder} placeholderImage='../../src/assets/300x300-placeholder.jpg' />
        </div>
    );
};

export default OrdersList;
