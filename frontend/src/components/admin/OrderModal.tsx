import React, { useState, useEffect, useRef } from 'react';

// Function to fetch available providers
const fetchAvailableProviders = async (orderId) => {
    try {
        const response = await fetch(`https://mycarmedics.com:8080/user/order/${orderId}/fetch-providers`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
        });
        const data = await response.json();
        return data.availableProviders;
    } catch (error) {
        console.error('Error fetching available providers:', error);
        return [];
    }
};

// Function to convert 24-hour time to 12-hour time
const formatTime = (hour) => {
    return hour >= 12 ? `${hour === 12 ? 12 : hour - 12} PM` : `${hour} AM`;
};

const OrderModal = ({ isOpen, onClose, order, placeholderImage, onUpdateOrderStatus, onUndoApprove, onChangeProviderForOrder }) => {
    if (!isOpen || !order) return null;

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

    const [isApproving, setIsApproving] = useState(false);
    const [isUndoingApproval, setIsUndoingApproval] = useState(false);
    const [isApproved, setIsApproved] = useState(order.adminCheck);
    const [selectedProviderId, setSelectedProviderId] = useState(order.timeSlot.providerId);
    const [availableProviders, setAvailableProviders] = useState([]);
    const [showLargeImage, setShowLargeImage] = useState(false);
    const [largeImageUrl, setLargeImageUrl] = useState(null);

    // Fetch available providers
    useEffect(() => {
        const fetchProviders = async () => {
            const providers = await fetchAvailableProviders(order._id);
            setAvailableProviders(providers);
        };
        fetchProviders();
    }, [order._id]);

    // Handle provider change
    const handleChangeProvider = async () => {
        try {
            const accessToken = localStorage.getItem('userToken');
            const requestBody = { providerId: selectedProviderId }; // Create the request body
            console.log('Request Body:', requestBody); // Log the request body
            const response = await fetch(`https://mycarmedics.com:8080/user/order/${order._id}/change-provider`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(requestBody), // Use selectedProviderId state here
            });
            if (response.ok) {
                // Update the order object in the parent component after changing the provider
                const providers = await fetchAvailableProviders(order._id); // Fetch the updated list of available providers
                setAvailableProviders(providers);
                console.log('Provider changed successfully');
                // Call the onChangeProviderForOrder function with the updated providerId
                onChangeProviderForOrder(order._id, selectedProviderId); // Pass orderId and selectedProviderId
            } else {
                console.error('Failed to change provider for order:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error changing provider for order:', error);
        }
    };

    // Function to show large image on click
    const handleShowLargeImage = (imageUrl) => {
        // Prepend the base URL to the imageUrl
        const fullImageUrl = `https://mycarmedics.com:8080/${imageUrl}`;
        setLargeImageUrl(fullImageUrl); // Set largeImageUrl to the full image URL
        setShowLargeImage(true);
    };

    // Function to hide large image
    const handleCloseLargeImage = () => {
        setShowLargeImage(false);
        setLargeImageUrl(null);
    };

    // Approve and Undo Approval Functions Adjusted for Integration
    const handleApproveOrder = async () => {
        if (typeof onUpdateOrderStatus !== 'function') {
            console.error('onUpdateOrderStatus is not a function', onUpdateOrderStatus);
            return;
        }
        setIsApproving(true);
        try {
            await onUpdateOrderStatus(order._id);
            setIsApproved(true);
        } catch (error) {
            console.error('Error approving order:', error);
        }
        setIsApproving(false);
    };

    const handleUndoApproval = async () => {
        setIsUndoingApproval(true);
        try {
            await onUndoApprove(order._id);  // Trigger the undo approval function
            setIsApproved(false); // Update local modal state to reflect undoing approval
        } catch (error) {
            console.error('Error undoing approval for order:', error);
        }
        setIsUndoingApproval(false);
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
            {/* Large Image Modal */}
            {showLargeImage && (
                <div className="fixed inset-0 z-50 flex justify-center items-center">
                    <div className="fixed inset-0 bg-black bg-opacity-50"></div>
                    <div className="max-w-full max-h-full cursor-pointer z-50 relative">
                        <button
                            className="absolute top-2 right-2 z-10 text-gray-500 hover:text-gray-800"
                            onClick={handleCloseLargeImage}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <img
                            className="max-w-full max-h-full"
                            src={largeImageUrl || placeholderImage}
                            alt="Large Service Image"
                        />
                    </div>
                </div>
            )}
            <div className="flex justify-center items-center min-h-screen">
                <div className="bg-white w-full max-w-md lg:rounded-lg overflow-hidden shadow-lg">
                    <div className="bg-gray-100 p-4 flex justify-between items-center">
                        <p className="text-lg font-semibold">Order ID: {order._id}</p>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="p-4">
                        <div>
                            <p><strong>Customer Name:</strong> {order.customerName}</p>
                            <p><strong>Phone:</strong> {order.customerPhone}</p>
                            <p><strong>Email:</strong> {order.customerEmail}</p>
                            <p><strong>Order Created:</strong> {formatDate(order.createdAt)}</p>
                            <p><strong>Scheduled Date:</strong> {formatDate(order.timeSlot.scheduledDate)} - {formatTime(order.timeSlot.endHour)}</p>
                            <p><strong>Provider:</strong> {order.timeSlot.serviceProvider}</p>
                            {/* Provider change section */}
                            {order.status === 'Pending' && (
                                <div className="">
                                    <label htmlFor="providerSelect" className="block font-semibold mb-1">Change Provider:</label>
                                    <select
                                        id="providerSelect"
                                        value={selectedProviderId}
                                        onChange={(e) => setSelectedProviderId(e.target.value)}
                                        className="w-full border border-gray-300 rounded-md p-2"
                                    >
                                        {availableProviders.map((provider) => (
                                            <option key={provider.providerId} value={provider.providerId}>
                                                {provider.providerName} - {provider.isAvailable ? 'Available' : 'Not Available'}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={handleChangeProvider}
                                        className="my-2 w-full bg-blue text-white font-bold py-2 px-4 rounded-md"
                                    >
                                        Change Provider
                                    </button>
                                </div>
                            )}
                            <p><strong>Type:</strong> {order.serviceType}</p>
                            {order.isTint && <p><strong>Tint Color:</strong> {order.tintColor}</p>}
                            <p><strong>Price:</strong> ${Number(order.totalPrice).toFixed(2)}</p>
                            <p><strong>Service Status:</strong> {order.status}</p>
                            <p><strong>Admin Approval:</strong> {isApproved ? 'Yes' : 'No'}</p>
                            <div className="grid grid-cols-2 gap-2 lg:flex-row flex-col rounded-lg mt-4 bg-gray-100 p-2 border border-gray-200" style={{ rowGap: '1rem' }}>

                                <div className="lg:col-span-1 grid gap-2">
                                    {order.beforeImages.length > 0 ? (
                                        order.beforeImages.map((beforeImage, index) => (
                                            <div key={`before-${index}`} className="relative">
                                                <img
                                                    className="w-full rounded-lg border border-blue/30 cursor-pointer object-cover"
                                                    src={beforeImage ? `https://mycarmedics.com:8080/${beforeImage}` : placeholderImage}
                                                    alt={`Before Service ${index + 1}`}
                                                    onClick={() => handleShowLargeImage(beforeImage)}
                                                />
                                                <span className="absolute top-2 left-2 bg-white px-2 py-1 text-xs font-semibold text-blue-600 rounded-md">Before</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-gray-500 text-center">No photo uploaded yet</div>
                                    )}
                                </div>


                                <div className="lg:col-span-1 grid gap-2">
                                    {order.afterImages.length > 0 ? (
                                        order.afterImages.map((afterImage, index) => (
                                            <div key={`after-${index}`} className="relative">
                                                <img
                                                    className="w-full rounded-lg border border-blue/30 cursor-pointer object-cover"
                                                    src={afterImage ? `https://mycarmedics.com:8080/${afterImage}` : placeholderImage}
                                                    alt={`After Service ${index + 1}`}
                                                    onClick={() => handleShowLargeImage(afterImage)}
                                                />
                                                <span className="absolute top-2 left-2 bg-white px-2 py-1 text-xs font-semibold text-blue-600 rounded-md">After</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-gray-500 text-center">No photo uploaded yet</div>
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="mb-4 px-4 flex justify-end">
                        {order.status === 'Completed' && !isApproved && (
                            isApproving ? (
                                <button className="bg-green-600 text-white font-bold w-full py-2 rounded-lg cursor-not-allowed opacity-50" disabled>
                                    Approving...
                                </button>
                            ) : (
                                <button onClick={handleApproveOrder} className="bg-green-600 text-white font-bold w-full py-2 rounded-lg">
                                    Approve For Payout
                                </button>
                            )
                        )}

                        {isApproved && (
                            isUndoingApproval ? (
                                <button className="bg-red-500 text-white font-bold w-full py-2 rounded-lg cursor-not-allowed opacity-50" disabled>
                                    Undoing Approval...
                                </button>
                            ) : (
                                <button onClick={handleUndoApproval} className="bg-red-500 text-white font-bold w-full py-2 rounded-lg">
                                    Undo Approval
                                </button>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderModal;
