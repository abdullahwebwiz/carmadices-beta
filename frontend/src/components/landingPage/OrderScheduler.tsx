import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Modal from 'react-modal';
import './CustomCalendar.css'; // Import the custom CSS file for calendar styling
import axios from 'axios';

Modal.setAppElement('#root');

const customStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: '9999',
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '80%',
    maxHeight: '80%',
    overflow: 'auto',
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.3)',
  },
};

const OrderScheduler = ({ selectedProvider, headlightsCount, onTimeSlotSelect, setHeadlightsCount, selectedDateTimeSlot, setSelectedDateTimeSlot,  }) => {

  const [selectedTimeSlot, setSelectedTimeSlot] = useState(selectedDateTimeSlot?.timeSlot ?? null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [minBookableTime, setMinBookableTime] = useState(new Date());

  const closingHour = 19; // Define closing hour here so it's accessible to all functions

  // Handle initial date change and open modal for time slots
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  // After opening modal, render time slots
  const renderTimeSlots = () => {
    const minBookableTime = getMinimumBookableTime().getHours();
    const maxHour = 18;
    const today = new Date().getDate();
    const selectedDay = selectedDate.getDate();
    const slots = [];

    let slotsAvailable = false;

    for (let index = 9; index < maxHour; index++) {
      const hour = index;
      const isAvailable = availableSlots[index - 9] && checkSlotAvailability(hour, 1);

      if (isAvailable || (today === selectedDay && hour < minBookableTime)) {
        slotsAvailable = true;

        const hour12 = hour % 12 || 12;
        const ampm = hour < 12 ? 'AM' : 'PM';

        slots.push(
          <button
            key={hour}
            onClick={() => handleTimeSlotSelection(hour)}
            className={`py-2 px-4 m-1 rounded-lg ${isAvailable ? 'bg-green-600 text-white' : 'bg-red-500 text-white cursor-not-allowed'}`}
            disabled={!isAvailable}
          >
            {`${hour12}:00 ${ampm} - ${hour12 + 1}:00 ${ampm}`}
          </button>
        );
      } else {
        const hour12 = hour % 12 || 12;
        const ampm = hour < 12 ? 'AM' : 'PM';

        slots.push(
          <button
            key={hour}
            className="py-2 px-4 m-1 rounded-lg bg-red-500 text-white cursor-not-allowed"
            disabled
          >
            {`${hour12}:00 ${ampm} - ${hour12 + 1}:00 ${ampm}`}
          </button>
        );
      }
    }

    if (!slotsAvailable) {
      return <p className="font-bold">No available slots for this date.</p>;
    }

    return slots.length > 0 ? slots : <p className="font-bold">All slots are unavailable for this date.</p>;
  };

  // Handle logic after user select time slot, sets up selectedTimeSlot and close modal
  const handleTimeSlotSelection = (hour) => {
    const numberOfHours = calculateNumberOfHours(headlightsCount);
    const adjustedEndHour = hour + numberOfHours;

    if (adjustedEndHour > closingHour) {
      alert('Selected time exceeds business hours to make service done. Change number of headlights to restore, or choose another time slot.');
      return;
    }

    const nextSlotAvailable = checkSlotAvailability(adjustedEndHour, 1);
    const maxHeadlightsCount = nextSlotAvailable ? 7 : 3; // Maximum headlights based on next slot availability
    const newHeadlightsCount = Math.min(maxHeadlightsCount, headlightsCount);

    const newNumberOfHours = calculateNumberOfHours(newHeadlightsCount);
    const newAdjustedEndHour = hour + newNumberOfHours;

    const newEndTime = nextSlotAvailable ? newAdjustedEndHour : hour + numberOfHours;

    const updatedTimeSlot = { startTime: hour, endTime: newEndTime };
    setSelectedTimeSlot(updatedTimeSlot);
    setIsModalOpen(false);

    // Use setSelectedDateTimeSlot from props
    setSelectedDateTimeSlot({ date: selectedDate, timeSlot: updatedTimeSlot });

    // Update headlightsCount in parent component
    setHeadlightsCount(newHeadlightsCount);

    console.log(`Selected time slot starting at ${hour} for ${newNumberOfHours} hour(s)`);

    // Log whether the next slot is available or not
    console.log('Is next slot available:', checkNextSlotAvailability(adjustedEndHour));
  };


  useEffect(() => {
    const calculateNumberOfHours = (count) => {
      if (count <= 3) return 1;
      if (count <= 7) return 2;
      if (count <= 11) return 3;
      if (count <= 15) return 4;
      return 5; // for 16-20 headlights
    };

    const newNumberOfHours = calculateNumberOfHours(headlightsCount);

    if (selectedTimeSlot) {
      const newEndTime = selectedTimeSlot.startTime + newNumberOfHours;
      if (newEndTime <= closingHour && checkSlotAvailability(selectedTimeSlot.startTime, newNumberOfHours)) {
        const updatedTimeSlot = { ...selectedTimeSlot, endTime: newEndTime };
        setSelectedTimeSlot(updatedTimeSlot);
      } else {
        setSelectedTimeSlot(null);
      }
    }
  }, [headlightsCount]);

  const getMinimumBookableTime = () => {
    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours() + 2);
    return currentTime;
  };

  const canIncreaseHeadlights = () => {
    if (!selectedTimeSlot) {
      // No selected time slot, cannot increase
      return false;
    }

    const { startTime } = selectedTimeSlot;
    const numberOfHours = calculateNumberOfHours(headlightsCount);

    // Calculate the end time of the current time slot
    const adjustedEndHour = startTime + numberOfHours;

    // Check if the adjusted end hour exceeds the closing hour
    if (adjustedEndHour > closingHour) {
      return false;
    }

    // Check if the next time slot is available for the additional time needed
    const nextSlotAvailable = checkSlotAvailability(adjustedEndHour, 1);

    // Maximum headlights count based on next slot availability
    const maxHeadlightsCount = nextSlotAvailable ? 7 : 3;

    // Check if increasing the headlights count exceeds the maximum allowed
    if (headlightsCount >= maxHeadlightsCount) {
      return false;
    }

    return true;
  };

  useEffect(() => {
    setMinBookableTime(getMinimumBookableTime());
  }, [headlightsCount]);

  useEffect(() => {
    fetchAvailableSlots();
  }, [selectedDate, selectedProvider, headlightsCount]);

  useEffect(() => {
    if (selectedTimeSlot) {
      adjustTimeSlotBasedOnHeadlightsCount();
    }
  }, [headlightsCount]);

  useEffect(() => {
    setSelectedTimeSlot(selectedDateTimeSlot?.timeSlot ?? null);
  }, [selectedDateTimeSlot]);

  const fetchAvailableSlots = async () => {
    if (!selectedDate || !selectedProvider) return;
    const formattedDate = selectedDate.toISOString().slice(0, 10);
    try {
      const response = await axios.get(`https://mycarmedics.com:8080/user/availability`, {
        params: { providerId: selectedProvider, date: formattedDate, headlightsCount },
      });
      setAvailableSlots(response.data.availability);
    } catch (error) {
      console.error('Error fetching available slots:', error);
    }
  };

  const adjustTimeSlotBasedOnHeadlightsCount = () => {
    const numberOfHours = calculateNumberOfHours(headlightsCount);
    const endTime = selectedTimeSlot.startTime + numberOfHours;
    if (endTime <= 20 && checkSlotAvailability(selectedTimeSlot.startTime, numberOfHours)) {
      setSelectedTimeSlot({ ...selectedTimeSlot, endTime });
    } else {
      setSelectedTimeSlot(null);
      alert('Updated headlights count exceeds the available continuous time.');
    }
  };

  const calculateNumberOfHours = (count) => {
    if (count <= 3) return 1;
    if (count <= 7) return 2;
    if (count <= 11) return 3;
    if (count <= 15) return 4;
    return 5; // for 16 to 20 headlights
  };

  useEffect(() => {
    console.log("Current headlightsCount in OrderScheduler:", headlightsCount);
    fetchAvailableSlots();
  }, [headlightsCount, selectedDate, selectedProvider]);

  useEffect(() => {
    console.log("Selected Date:", selectedDate);
    console.log("Selected Time Slot:", selectedTimeSlot);
    if (selectedTimeSlot && selectedDate) {
      onTimeSlotSelect(selectedDate, selectedTimeSlot);
    }
  }, [selectedDate, selectedTimeSlot]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="custom-calendar">
        <Calendar onChange={handleDateChange} value={selectedDate} minDate={new Date()} />
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        style={customStyles}
        contentLabel="Available Time Slots"
      >
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-1 text-center">Time Slots</h2>
          <p className="mb-4 text-center">Selected date: <strong>{selectedDate ? selectedDate.toDateString() : 'None selected'}</strong></p>
          <div className="grid lg:grid-cols-1 gap-1">
            {renderTimeSlots()}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OrderScheduler;
