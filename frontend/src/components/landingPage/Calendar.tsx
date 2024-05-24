import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios'; // Assuming you are using Axios for HTTP requests

interface CalendarProps {
  providerId: string;
  onTimeSlotSelect: (timeSlot: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({ providerId, onTimeSlotSelect }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);

  useEffect(() => {
    if (selectedDate) {
      fetchTimeSlots();
    }
  }, [selectedDate]);

  const fetchTimeSlots = async () => {
    try {
      const response = await axios.get(`/api/providers/${providerId}/time-slots`, {
        params: {
          date: selectedDate.toISOString().split('T')[0] // Send selected date in ISO format (YYYY-MM-DD)
        }
      });
      setTimeSlots(response.data.timeSlots);
    } catch (error) {
      console.error('Error fetching time slots:', error);
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleTimeSlotClick = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot);
    onTimeSlotSelect(timeSlot);
  };

  return (
    <div className="bg-blue/50 flex items-center justify-center">
      {/* Date picker */}
      <div>
        <div className="mb-4">
          <DatePicker
            selected={selectedDate}
            onChange={(date: Date) => handleDateSelect(date)}
            dateFormat="MMMM d, yyyy"
            className="p-4 rounded-lg flex"
          />
        </div>

        {/* Time slots selection */}
        <div className="grid grid-cols-4 w-fit mx-auto gap-1">
          {timeSlots.map((timeSlot, index) => (
            <button
              key={index}
              className={`py-2 px-4 border rounded ${selectedTimeSlot === timeSlot ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
              onClick={() => handleTimeSlotClick(timeSlot)}
            >
              {timeSlot}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
