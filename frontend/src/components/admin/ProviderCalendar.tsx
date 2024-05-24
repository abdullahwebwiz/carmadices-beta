import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';

const ProviderCalendar = ({ provider }) => {
    const [selectedDate, setSelectedDate] = useState(null); // No date selected by default
    const [timeSlots, setTimeSlots] = useState([]);

    useEffect(() => {
        if (!provider || !selectedDate) return; // Exit if no provider or date is selected

        const fetchTimeSlots = async () => {
            try {
                const response = await axios.get(`https://carmadices-beta-11pk.vercel.app/user/availability`, {
                    params: {
                        providerId: provider._id,
                        date: selectedDate.toISOString().slice(0, 10) // Format date as 'YYYY-MM-DD'
                    }
                });
                setTimeSlots(generateTimeSlots(response.data.availability)); // Assuming backend returns an object with 'availability' array
            } catch (error) {
                console.error('Error fetching time slots:', error);
            }
        };

        fetchTimeSlots();
    }, [selectedDate, provider]);

    const handleDateSelect = (date) => {
        setSelectedDate(date);
    };

    const generateTimeSlots = (availability) => {
        return availability.map((isAvailable, index) => ({
            startHour: 9 + index, // Assuming slots start at 9 AM
            endHour: 10 + index,
            isAvailable
        }));
    };

    const renderTimeSlots = () => {
        if (!timeSlots.length) {
            return <p className="text-center mt-2">Select a date to view available time slots.</p>;
        }

        return (
        <div className="flex flex-wrap">
            {timeSlots.map((slot, index) => (
                <button
                    key={index}
                    className={`py-2 px-4 m-1 rounded-lg ${slot.isAvailable ? 'bg-green-600 text-white' : 'bg-red-500 text-white'}`}
                    style={{ width: 'calc(50% - 8px)' }} // Grid with 2 columns
                    disabled={!slot.isAvailable}
                    onClick={() => handleTimeSlotSelect(slot.startHour, slot.endHour)}
                >
                    {`${slot.startHour}:00 - ${slot.endHour}:00`}
                </button>
            ))}
        </div>

        );
    };

    const handleTimeSlotSelect = (startHour, endHour) => {
        console.log('Selected time slot:', selectedDate.toISOString(), startHour, endHour);
        // Implement additional logic based on the slot selection
    };

    return (
        <div>
            <Calendar onChange={handleDateSelect} value={selectedDate} />
            {selectedDate && (
                <h3 className="mt-2 mb-2 text-center">Selected Date: {selectedDate.toDateString()}</h3>
            )}
            {renderTimeSlots()}
        </div>
    );
};

export default ProviderCalendar;
