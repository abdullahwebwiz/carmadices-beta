import React, { useState, useRef } from 'react';
import axios from 'axios';
import imageCompression from 'browser-image-compression'; // Import image compression library

const OrderList = ({ orders, setOrders }:any) => {
    const [formData, setFormData]:any = useState({});
    const [imagePreviews, setImagePreviews] :any= useState({});
    const fileInputRefs :any= useRef({});
    const serverBaseURL = 'https://www.carmadices-beta-11pk.vercel.app/';
    const placeholderImage = '/home/carmedic/htdocs/www.mycarmedics.com/carmedics/frontend/src/assets/300x300-placeholder.jpg';
    const [statusFilter, setStatusFilter] = useState('All'); // Filter state

        // Function to resize and compress images
        const resizeAndCompressImage = async (file:any) => {
            const options = {
                maxSizeMB: 1, // Maximum size in MB
                maxWidthOrHeight: 800, // Maximum width or height
            };
            try {
                const compressedFile = await imageCompression(file, options);
                return compressedFile;
            } catch (error) {
                console.error('Image compression failed:', error);
                return file; // Return original file if compression fails
            }
        };

            // Function to handle status filter change
    const handleStatusFilterChange = (e:any) => {
        setStatusFilter(e.target.value);
    };

    const formatDate = (dateString:any) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', hour12: true
        }).format(date);
    };

    const calculateProviderShare = (totalPrice:any) => {
        return (0.70 * totalPrice).toFixed(2);
    };

    const updateOrderStatus = async (orderId:any, newStatus:any) => {
        if (window.confirm(`Are you sure you want to update status to: ${newStatus}?`)) {
            try {
                const response = await axios.put(`${serverBaseURL}order/${orderId}/status`, { status: newStatus }, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
                });
                if (response.status === 200) {
                    setOrders(orders.map((order:any) => 
                        order._id === orderId ? { ...order, status: newStatus } : order
                    ));
                    alert('Status updated successfully!');
                } else {
                    alert('Failed to update status.');
                }
            } catch (error) {
                alert('Failed to update status.');
                console.error('Failed to update status:', error);
            }
        }
    };

    const handleFileChange = async (e:any, orderId:any, imageType:any) => {
        const file = e.target.files[0];
        if (file) {
            // Resize and compress image before setting formData and imagePreviews
            const compressedFile = await resizeAndCompressImage(file);
            setFormData({ ...formData, [imageType]: compressedFile, orderId });
            setImagePreviews({ ...imagePreviews, [`${orderId}-${imageType}`]: URL.createObjectURL(compressedFile) });
        }
    };

    const handleImageClick = (orderId:any, imageType:any) => {
        fileInputRefs.current[`${orderId}-${imageType}`].click();
    };

    const uploadFiles = async (e:any) => {
        e.preventDefault();
        const uploadFormData = new FormData();
        uploadFormData.append('beforeImage', formData.beforeImage);
        uploadFormData.append('afterImage', formData.afterImage);
        uploadFormData.append('orderId', formData.orderId);

        try {
            await axios.post(`${serverBaseURL}order/${formData.orderId}/images`, uploadFormData, {
                headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${localStorage.getItem('userToken')}` }
            });
            alert('Images uploaded successfully!');
        } catch (error) {
            alert('Failed to upload images.');
            console.error('Upload failed', error);
        }
    };

        // Filter orders based on the selected status
        const filteredOrders = orders.filter((order:any) => {
            if (statusFilter === 'All') {
                return true;
            } else {
                return order.status === statusFilter;
            }
        });

    return (


              <div className="flex">
                <div className="">
            <div className="flex mb-4 lg:w-fit w-full">
                {/* Filter dropdown */}
                <p className="place-self-center lg:flex hidden w-full">Filter orders:</p>
                <select
                    value={statusFilter}
                    onChange={handleStatusFilterChange}
                    className="border border-gray-300 w-full h-14 bg-white rounded-lg p-2"
                >
                    <option value="All">All</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                    {/* Add more status options as needed */}
                </select>
            </div>
            <ul>
            {filteredOrders.map((order:any) => (
                    <li key={order._id} className="bg-white border border-gray-300 rounded-xl p-4 mb-4">
                        <div className="flex lg:flex-row flex-col gap-4">
                        <div className="flex my-auto flex-col gap-2 p-4 border border-gray-200 rounded-xl">
                                    <div className="flex my-auto flex-col justify-center items-center p-4 border border-green-400 bg-green-300 rounded-xl">
                                        <strong>Your income:&nbsp;</strong>
                                        <span className="text-3xl font-bold">${calculateProviderShare(order.totalPrice)}</span>
                                    </div>
                                    <div className="flex flex-col my-auto text-center lg:text-left">
                                        <p><strong>Customer Name:</strong> {order.customerName}</p>
                                        <p><strong>Email:</strong> {order.customerEmail}</p>
                                        <p><strong>Phone:</strong> {order.customerPhone}</p>
                                        <div className="w-fit">
                                            {/* Status */}
                                            <div className="lg:flex hidden flex-col lg:flex-row gap-2 lg:items-center rounded-lg">
                                                <label htmlFor={`status-${order._id}`}>Update Status:</label>
                                                <select
                                                    id={`status-${order._id}`}
                                                    value={order.status}
                                                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                                    className="border border-gray-300 bg-white rounded-md">
                                                    <option value="Pending">Pending</option>
                                                    <option value="In Progress">In Progress</option>
                                                    <option value="Completed">Completed</option>
                                                    <option value="cancelled">Cancelled</option>
                                                    {/* Add more status options as needed */}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1 border border-gray rounded-xl p-4 my-auto text-center lg:text-left">
                                    <p><strong>Order ID:</strong> {order._id}</p>
                                    <p><strong>Service:</strong> {order.serviceType}</p>
                                    <p><span className="font-bold">Headlight Tint:</span> {order.isTint ? 'Yes' : 'No'}</p>
                                    {order.isTint && <p><span className="font-bold">Tint Color:</span> {order.tintColor}</p>}
                                    <p><strong>Created At:</strong> {formatDate(order.createdAt)}</p>
                                    <p><strong>Scheduled:</strong> {formatDate(order.timeSlot.scheduledDate)}</p>
                                    <p className="p-4 border border-green-400 bg-green-300 rounded-xl mt-1"><strong>Status:</strong> {order.status}</p>
                                </div>
                            <div className="flex lg:flex-col flex-col p-4 border border-gray-200 rounded-xl justify-between gap-2">
                                <div className="flex lg:flex-row flex-col rounded-lg justify-between items-center">
                                    <div className="flex flex-col">
                                    <p className="text-center lg:text-sm text-xl font-bold mb-2">Before</p>
                                    <img 
                                        className="lg:h-[150px] lg:w-[150px] w-[200px] h-[200px] rounded-lg border border-blue/30 cursor-pointer object-cover"
                                        src={imagePreviews[`${order._id}-beforeImage`] || (order.beforeImagePath ? `${serverBaseURL}${order.beforeImagePath}` : placeholderImage)}
                                        alt="Before Service"
                                        onClick={() => handleImageClick(order._id, 'beforeImage')}
                                    />
                                    </div>
                                    <div className="flex flex-col">
                                    <p className="text-center lg:text-sm text-xl font-bold mb-2 mt-2 lg:mt-0">After</p>
                                    <img 
                                        className="lg:h-[150px] lg:w-[150px] w-[200px] h-[200px] lg:ml-2 rounded-lg border border-blue/30 cursor-pointer object-cover"
                                        src={imagePreviews[`${order._id}-afterImage`] || (order.afterImagePath ? `${serverBaseURL}${order.afterImagePath}` : placeholderImage)}
                                        alt="After Service"
                                        onClick={() => handleImageClick(order._id, 'afterImage')}
                                    />
                                    </div>
                                    <input type="file" ref={el => fileInputRefs.current[`${order._id}-beforeImage`] = el}
                                        onChange={(e) => handleFileChange(e, order._id, 'beforeImage')}
                                        style={{ display: 'none' }} accept="image/*" />
                                    <input type="file" ref={el => fileInputRefs.current[`${order._id}-afterImage`] = el}
                                        onChange={(e) => handleFileChange(e, order._id, 'afterImage')}
                                        style={{ display: 'none' }} accept="image/*" />
                                </div>
                                <div>
                                    <button onClick={uploadFiles} className="mt-2 lg:mt-0 bg-blue h-fit w-full place-self-center text-white px-4 py-4 rounded-lg">Upload Photos</button>
                                </div>
                            </div>
                        </div>
                        <p className="border border-gray-200 rounded-lg p-2 mt-4 w-fit text-center lg:text-left"><strong>Address:</strong> {order.shippingAddress}</p>
                    </li>
                ))}
            </ul></div>
        </div>
    );
};

export default OrderList;
