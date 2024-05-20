import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/authContext';

const OrderModal = ({ isOpen, onClose, order, placeholderImage, onUploadSuccess, onUpdateStatus }) => {
    const { userToken } = useAuth();
    const baseUrl = 'https://mycarmedics.com:8080/';

    const [imagePairs, setImagePairs] = useState([]);
    const [isLoadingUpload, setIsLoadingUpload] = useState(false); // Loading state for upload button
    const [isLoadingClean, setIsLoadingClean] = useState(false); // Loading state for clean button
    const [isLoadingMarkAsCompleted, setIsLoadingMarkAsCompleted] = useState(false); // Loading state for mark as completed button
    const [isCompleted, setIsCompleted] = useState(false); // New state to track completion status
    const [showConfirmation, setShowConfirmation] = useState(false); // State to track confirmation dialog visibility

    useEffect(() => {
        if (order) {
            const { beforeImages, afterImages } = order;
            const numImages = Math.max(beforeImages.length, afterImages.length, 1); // Ensure at least one row is shown
            const initialImagePairs = Array.from({ length: numImages }, (_, index) => ({
                beforeImage: beforeImages[index] ? `${baseUrl}${beforeImages[index]}` : null,
                afterImage: afterImages[index] ? `${baseUrl}${afterImages[index]}` : null,
                beforeFile: null,
                afterFile: null
            }));
            setImagePairs(initialImagePairs);
            setIsCompleted(order.status === 'Completed'); // Set completion status based on order status
        }
    }, [order]);

    const handleMarkAsCompleted = async () => {
        try {
            setIsLoadingMarkAsCompleted(true);
            const response = await axios.put(`https://mycarmedics.com:8080/order/${order._id}/status`, { status: 'Completed' }, {
                headers: { Authorization: `Bearer ${userToken}` }
            });
            console.log('Order marked as completed:', response.data);
            setIsCompleted(true);
            onUpdateStatus(order._id, 'Completed'); // Call the onUpdateStatus function with orderId and newStatus
        } catch (error) {
            console.error('Error marking order as completed:', error);
            alert('Failed to mark order as completed. Please try again.');
        } finally {
            setIsLoadingMarkAsCompleted(false);
        }
    };

    const handleUndoMarkAsCompleted = async () => {
        try {
            setIsLoadingMarkAsCompleted(true);
            const response = await axios.put(`https://mycarmedics.com:8080/order/${order._id}/status`, { status: 'Pending' }, {
                headers: { Authorization: `Bearer ${userToken}` }
            });
            console.log('Order completion undone:', response.data);
            setIsCompleted(false);
            onUpdateStatus(order._id, 'Pending'); // Call the onUpdateStatus function with orderId and newStatus
        } catch (error) {
            console.error('Error undoing order completion:', error);
            alert('Failed to undo order completion. Please try again.');
        } finally {
            setIsLoadingMarkAsCompleted(false);
        }
    };

    const confirmMarkAsCompleted = async () => {
        setShowConfirmation(false);
        try {
            setIsLoading(true);
            const response = await axios.put(`https://mycarmedics.com:8080/order/${order._id}/status`, { status: 'Completed' }, {
                headers: { Authorization: `Bearer ${userToken}` }
            });
            console.log('Order marked as completed:', response.data);
            setIsCompleted(true); // Update completion status in state
            onUpdateStatus('Completed'); // Update status in parent component
        } catch (error) {
            console.error('Error marking order as completed:', error);
            alert('Failed to mark order as completed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };



    const handleImageSelect = (index, type, event) => {
        const file = event.target.files[0];
        const updatedPairs = [...imagePairs];
        const currentPair = updatedPairs[index];

        if (type === 'before' && currentPair.beforeImage && currentPair.beforeFile && currentPair.beforeImage !== placeholderImage) {
            // If a before image already exists and it's not the placeholder image, replace it
            currentPair.beforeFile = file;
            currentPair.beforeImage = URL.createObjectURL(file);
        } else if (type === 'after' && currentPair.afterImage && currentPair.afterFile && currentPair.afterImage !== placeholderImage) {
            // If an after image already exists and it's not the placeholder image, replace it
            currentPair.afterFile = file;
            currentPair.afterImage = URL.createObjectURL(file);
        } else {
            // If no image exists or it's the placeholder image, set the new file
            updatedPairs[index] = {
                ...currentPair,
                [`${type}File`]: file,
                [`${type}Image`]: URL.createObjectURL(file)
            };
        }

        setImagePairs(updatedPairs);
    };

    const handleUploadAllImages = async () => {
        if (imagePairs.every(pair => !pair.beforeFile && !pair.afterFile)) {
            // No photos selected
            alert('No selected photos');
            return;
        }

        setIsLoadingUpload(true);
        const formData = new FormData();
        let imagesChanged = false;

        imagePairs.forEach((pair, index) => {
            // Check if the new image URLs are different from the original ones
            const beforeImageChanged = pair.beforeImage && pair.beforeImage !== `${baseUrl}${order.beforeImages[index]}`;
            const afterImageChanged = pair.afterImage && pair.afterImage !== `${baseUrl}${order.afterImages[index]}`;

            if (beforeImageChanged && pair.beforeFile) {
                formData.append(`beforeImages`, pair.beforeFile, `before-${index}.jpg`);
                imagesChanged = true;
            }
            if (afterImageChanged && pair.afterFile) {
                formData.append(`afterImages`, pair.afterFile, `after-${index}.jpg`);
                imagesChanged = true;
            }
        });

        if (imagesChanged) {
            try {
                const response = await axios.post(`https://mycarmedics.com:8080/order/${order._id}/images`, formData, {
                    headers: { Authorization: `Bearer ${userToken}` }
                });
                console.log('Images uploaded:', response.data);
                onUploadSuccess && onUploadSuccess(response.data);
            } catch (error) {
                console.error('Error uploading images:', error);
                alert('Failed to upload images. Please try again.');
            }
        } else {
            console.log('No changes to images. Skipping upload.');
        }

        setIsLoadingUpload(false);
    };

    const addMorePhotos = () => {
        if (imagePairs.length < 10) {
            setImagePairs([...imagePairs, { beforeImage: null, afterImage: null, beforeFile: null, afterFile: null }]);
        }
    };

    const cleanOrderImages = async () => {
        const confirmDelete = window.confirm('You will delete all photos, are you sure you want to do it?');
        if (!confirmDelete) {
            return;
        }

        setIsLoadingClean(true);
        try {
            const response = await axios.post(`https://mycarmedics.com:8080/order/${order._id}/cleanImages`, null, {
                headers: { Authorization: `Bearer ${userToken}` }
            });
            console.log('Order images cleaned:', response.data);
            // Reset imagePairs state to an empty array to reload the modal
            setImagePairs([]);
        } catch (error) {
            console.error('Error cleaning order images:', error);
            alert('Failed to clean order images. Please try again.');
        } finally {
            setIsLoadingClean(false);
        }
    };


    const renderImageInput = (index, type) => (
        <div className="flex-col" key={`${type}-${index}`}>
            <p className="text-center text-sm font-bold mb-1">{type.charAt(0).toUpperCase() + type.slice(1)} Image {index + 1}</p>
            {isCompleted ? (
                <img
                    className="rounded-lg border border-blue-300 object-cover"
                    src={imagePairs[index][`${type}Image`] || placeholderImage}
                    alt={`${type} Image ${index + 1}`}
                />
            ) : (
                <img
                    className="rounded-lg border border-blue-300 cursor-pointer object-cover"
                    src={imagePairs[index][`${type}Image`] || placeholderImage}
                    alt={`${type} Image ${index + 1}`}
                    onClick={() => document.getElementById(`${type}ImageInput-${index}`).click()}
                />
            )}
            {!isCompleted && (
                <input
                    id={`${type}ImageInput-${index}`}
                    type="file"
                    name={`${type}-${index}`}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageSelect(index, type, e)}
                />
            )}
        </div>
    );


    return (
        <div className={`fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 ${isOpen ? '' : 'hidden'}`}>
            <div className="flex justify-center items-center min-h-screen">
                <div className="bg-white w-full max-w-md lg:rounded-lg overflow-hidden shadow-lg">
                    <div className="bg-gray-100 p-4 flex justify-between items-center">
                        <p className="text-lg font-semibold">Order ID: {order ? order._id : ''}</p>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="p-4">

                        <p className="font-bold">Customer Info:</p>
                        <p>{order && order.customerName}</p>
                        <p>{order && order.customerPhone}</p>
                        <p>{order && order.customerEmail}</p>
                        <p>User ID: {order ? order.userId : ''}</p>
                        <br></br>
                        <p className="font-bold">Service Info:</p>
                        <p>Created at: {order ? order.createdAt : ''}</p>
                        <p>Scheduled for: {order && order.timeSlot && order.timeSlot.scheduledDate}</p>
                        <br></br>
                        <p>Service Type: {order && order.serviceType}</p>
                        <p>Service Location: {order && order.serviceLocation}</p>
                        <p>Address: {order && order.shippingAddress}</p>
                        <br></br>
                        <p>Service Status: <strong>{isCompleted ? 'Completed' : 'Pending'}</strong></p>
                        {!isCompleted && (
                            <p className="hidden"></p>
                        )}
                        {isCompleted && order && (
                            <p>Approved for payout: <strong>{order.adminCheck ? 'Yes' : 'No'}</strong></p>
                        )}


                        <br></br>
                        {imagePairs.map((pair, index) => (
                            <div key={index} className="grid grid-cols-2 gap-4 mb-4">
                                {['before', 'after'].map((type) => renderImageInput(index, type))}
                            </div>
                        ))}

                        {!isCompleted && (
                            <>
                                <div className="grid grid-cols-2 gap-2 items-center">
                                    <button onClick={addMorePhotos} className="bg-blue w-full text-white py-3 rounded-md hover:bg-blue/75">Add Photos</button>
                                    <button onClick={handleUploadAllImages} disabled={isLoadingUpload} className={`w-full py-3 text-white ${isLoadingUpload ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} rounded-lg p-2`}>
                                        {isLoadingUpload ? 'Uploading...' : 'Upload All Photos'}
                                    </button>
                                </div>
                                <button onClick={cleanOrderImages} className="bg-red-500 w-full mt-2 text-white px-4 py-2 rounded-md hover:bg-red-700">Clear All Images</button>
                            </>
                        )}
                       <button
    onClick={isCompleted ? handleUndoMarkAsCompleted : handleMarkAsCompleted}
    disabled={isLoadingMarkAsCompleted || (isCompleted && order && order.adminCheck)}
    className={`mt-2 w-full py-2 text-white ${((isCompleted && order && order.adminCheck) || isLoadingMarkAsCompleted) ? 'bg-gray-400 cursor-not-allowed' : (isCompleted ? 'bg-red-600 hover:bg-red-700' : 'bg-green-500 hover:bg-green-700')} rounded-lg p-2`}
>
    {isLoadingMarkAsCompleted ? 'Processing...' : isCompleted ? 'Undo Mark as Completed' : 'Mark as Completed'}
</button>


                        {showConfirmation && (
                            <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                                <div className="bg-white p-4 rounded-lg shadow-lg">
                                    <p className="mb-4">Make sure you uploaded all photos and completed service. Are you sure you want to mark as completed?</p>
                                    <div className="flex justify-center">
                                        <button onClick={confirmMarkAsCompleted} className="bg-green-600 text-white px-4 py-2 rounded-md mr-2">Yes</button>
                                        <button onClick={() => setShowConfirmation(false)} className="bg-red-500 text-white px-4 py-2 rounded-md ml-2">Cancel</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderModal;
