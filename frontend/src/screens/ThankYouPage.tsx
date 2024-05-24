// ThankYouPage.js
// import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import HeaderMenu from '../components/HeaderMenu';
import Footer from '../components/Footer';


const ThankYouPage = () => {
    const location = useLocation();
    const orderDetails = location.state ? location.state.orderDetails : null;

    if (!orderDetails) {
        return <div>No order details available.</div>;
    }

    const serviceAddress = orderDetails.serviceLocation === 'Garage'
        ? '3901 NE 5th Terrace SUITE 4, Oakland Park, FL 33334'
        : orderDetails.shippingAddress;

    return (
        <>

            <div className="flex flex-col h-full justify-between">
                <HeaderMenu />
                <div className="flex w-full px-2 py-9">
                    <div className="flex flex-col gap-8 w-full items-center">
                        <div className="flex lg:flex-row lg:px-20 lg:min-h-[500px] lg:max-h-[500px] h-full flex-col gap-8 px-8">
                            <div className="flex w-full items-center h-fit">
                                <div className="lg:text-left text-center">
                                    <h2 className="lg:text-7xl text-6xl font-black mb-4 text-center">Thank you for <span className="text-blue">your order!</span></h2>
                                    <p className="lg:mb-8 mb-6 text-lg text-center">Your order is now paid and sent to provider that will contact with you shortly if needed.</p>
                                    <div className="flex flex-col bg-blue/25 rounded-lg p-4 border border-blue/10 text-center">
                                        <p className="text-3xl font-bold mb-2">Your order summary:</p>
                                        <p>Order ID: {orderDetails._id}</p>
                                        <p>Your service: {orderDetails.serviceType}</p>
                                        <p className="p-4 bg-green-400 rounded-lg w-fit place-self-center mt-2 font-bold">Total Paid: ${orderDetails.totalPrice.toFixed(2)}</p>
                                        <p className="text-3xl font-bold mt-2 mb-2">Service summary:</p>
                                        <p>Scheduled Date: {new Date(orderDetails.timeSlot.scheduledDate).toLocaleString('en-US', {
                                            month: 'short',
                                            day: '2-digit',
                                            year: 'numeric',
                                            hour: 'numeric',
                                            minute: 'numeric',
                                            hour12: true
                                        })}</p>

                                        <p className="">Service will be done at: <br></br><strong>{serviceAddress}</strong></p>
                                    </div>
                                    <p className="mt-4 text-center font-bold">You can now visit
                                        <Link to="/profile"><button className="bg-blue text-white px-4 py-1 mx-1 rounded-full">Profile</button></Link> to see your order history including this order.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
};

export default ThankYouPage;