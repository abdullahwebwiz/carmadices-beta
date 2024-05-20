import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import ProviderCalendar from './ProviderCalendar'; // Import the ProviderCalendar component

const ProviderModal = ({ isOpen, onClose, provider, placeholderImage }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(null);
    const [isTimeSlotAvailable, setIsTimeSlotAvailable] = useState(false);
    const modalRef = useRef(null);

    useEffect(() => {
        // Logic to check if the selected time slot is available
        const checkTimeSlotAvailability = () => {
            // Implement your logic here to check if the time slot is available
            // For demonstration, always assume the first time slot is available
            if (provider && provider.timeSlots && provider.timeSlots.length > 0) {
                setIsTimeSlotAvailable(true);
                setSelectedTime(provider.timeSlots[0]); // Select the first available time slot
            } else {
                setIsTimeSlotAvailable(false);
                setSelectedTime(null);
            }
        };

        checkTimeSlotAvailability();
    }, [provider]);

    // Function to handle date selection
    const handleDateChange = (date) => {
        setSelectedDate(date);
        // When the date changes, reset the selected time
        setSelectedTime(null);
    };

    // Function to handle time selection
    const handleTimeChange = (time) => {
        setSelectedTime(time);
    };

    // Function to handle booking
    const handleBooking = () => {
        // Implement your booking logic here
        if (selectedTime) {
            console.log('Booking:', selectedTime);
            // Example: Call a booking API or perform booking actions
            // You can add your booking logic here
        }
    };

    // Function to handle modal close
    const handleCloseModal = () => {
        onClose();
    };

    // Function to handle click outside modal
    const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            onClose();
        }
    };

    // Add event listener for click outside modal
    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className={`fixed inset-0 z-50 overflow-y-auto ${isOpen ? 'visible' : 'hidden'}`}>
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={handleCloseModal}></div>
            <div ref={modalRef} className="fixed top-0 left-0 w-full lg:h-full h-fit flex items-center justify-center">
                <div className="bg-white w-full max-w-md lg:rounded-lg overflow-hidden shadow-lg z-50">
                    <div className="sticky top-0 bg-white border-b border-gray-200 z-50">
                        <div className="flex justify-between items-center p-4">
                            <h2 className="text-2xl font-bold">Provider Details</h2>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-500 hover:text-gray-800"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div className="p-8 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 5rem)' }}>
                        {provider ? (
                            <div>
                                <p><strong>First Name:</strong> {provider.firstName}</p>
                                <p><strong>Phone:</strong> {provider.phone}</p>
                                <p><strong>Email:</strong> {provider.email}</p>
                                <p><strong>ID:</strong> {provider._id}</p>
                                <p><strong>Available Cash:</strong> ${Number(provider.cash).toFixed(2)}</p>
                                
                                {/* Display the order counts for Completed and Pending */}
                                {provider.orderCounts && (
                                    <div>
                                        <p><strong>Completed Orders:</strong> {provider.orderCounts.completed}</p>
                                        <p><strong>Pending Orders:</strong> {provider.orderCounts.pending}</p>
                                    </div>
                                )}

                                {/* Display the ProviderCalendar with date and time selection */}
                                <ProviderCalendar
                                    provider={provider}
                                    selectedDate={selectedDate}
                                    selectedTime={selectedTime}
                                    onDateChange={handleDateChange}
                                    onTimeChange={handleTimeChange}
                                />
                            </div>
                        ) : (
                            <p>Loading...</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

ProviderModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    provider: PropTypes.object, // The provider object
    placeholderImage: PropTypes.string.isRequired,
};

export default ProviderModal;
