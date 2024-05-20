import React, { useState } from 'react';

const SingleOrderModal = ({ isOpen, onClose, order, placeholderImage }) => {
    if (!isOpen || !order) return null;

    // Function to format date as MM/DD/YYYY hh:mm AM/PM
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true // Use 12-hour format
        };
        return date.toLocaleString('en-US', options);
    };

    const [showLargeImage, setShowLargeImage] = useState(false);
    const [largeImageUrl, setLargeImageUrl] = useState(null);

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
    
            {/* Main Content */}
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
                            <p><strong>Order Created:</strong> {formatDate(order.createdAt)}</p>
                            <p><strong>Scheduled Date:</strong> {formatDate(order.timeSlot.scheduledDate)}</p>
                            <p><strong>Provider:</strong> {order.timeSlot.serviceProvider}</p>
                            <p><strong>Type:</strong> {order.serviceType}</p>
                            {order.isTint && <p><span className="font-bold">Tint Color:</span> {order.tintColor}</p>}
                            <p><strong>Price:</strong> ${Number(order.totalPrice).toFixed(2)}</p>
                            <p><strong>Order Status:</strong> {order.status}</p>
                            <p><strong>Address:</strong> {order.shippingAddress}</p>
                            <div className="grid grid-cols-2 gap-2 lg:flex-row flex-col rounded-lg mt-4 bg-gray-100 p-2 border border-gray-200" style={{ rowGap: '1rem' }}>
                                {/* Render beforeImages */}
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
                </div>
            </div>
        </div>
    );    
};

export default SingleOrderModal;
