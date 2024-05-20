import React, { useState, useRef, useEffect } from 'react';
import { Autocomplete } from '@react-google-maps/api';

const libraries = ['places'];

const MapComponent = ({ setAddress, setCalculatedPrice, serviceLocation }) => {
  const [customerAddress, setCustomerAddress] = useState('');
  const [distance, setDistance] = useState(0);
  const [price, setPrice] = useState(0);
  const [travelTime, setTravelTime] = useState(0);
  const autocompleteRef = useRef(null);
  const officeAddress = '3901 NE 5th Terrace SUITE 4, Oakland Park, Florida';

  // Function to calculate distance, time, and price
  const calculateDistanceAndTime = async (address) => {
    try {
      const response = await fetch(`https://mycarmedics.com:8080/calculate-distance?origin=${encodeURIComponent(officeAddress)}&destination=${encodeURIComponent(address)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const calculatedDistance = parseFloat(data.distance);
      const calculatedTime = data.duration; // Assuming the server returns the travel duration in minutes

      // Calculate price based on the distance and price per mile
      const calculatedPrice = calculatedDistance * 0.95; // $0.95 per mile

      setDistance(calculatedDistance);
      setPrice(calculatedPrice);
      setCalculatedPrice(calculatedPrice, calculatedDistance, calculatedTime); // Pass travel time to the parent component
      setTravelTime(calculatedTime); // Set the received travel time
    } catch (error) {
      console.error('Error calculating distance, time, and price:', error);
    }
  };

  // Handles the selection of a place from the autocomplete dropdown
  const handlePlaceSelect = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();

      if (place && place.address_components) {
        let formattedAddress = '';
        place.address_components.forEach(component => {
          formattedAddress += component.long_name + ', ';
        });
        formattedAddress = formattedAddress.slice(0, -2); // Remove the last comma and space
        setCustomerAddress(formattedAddress);

        if (serviceLocation === 'CustomerLocation') {
          calculateDistanceAndTime(formattedAddress);
        } else {
          // If service location is garage, reset distance, time, and price
          setPrice(0);
          setDistance(0);
          setTravelTime(0);
          setCalculatedPrice(0, 0, 0);
        }

        setAddress(formattedAddress);
      } else {
        console.error("No details available for input: '" + place?.name + "'");
      }
    }
  };

  // Watch for changes in serviceLocation prop
  useEffect(() => {
    if (serviceLocation === 'CustomerLocation' || serviceLocation === 'Garage') {
      handlePlaceSelect();
    }
  }, [serviceLocation]); 

  // Watch for changes in customerAddress and calculate distance, time, and price
  useEffect(() => {
    if (serviceLocation === 'CustomerLocation' && customerAddress) {
      calculateDistanceAndTime(customerAddress);
    }
  }, [customerAddress]); 

  return (
    <div className="w-full">
      <Autocomplete
        onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
        onPlaceChanged={handlePlaceSelect}
        options={{
          componentRestrictions: { country: 'us' } // Restricted to United States
        }}>
        <input
          type="text"
          placeholder="Enter your address"
          className="w-full py-2 px-4 rounded-lg border text-center"
          value={customerAddress}
          onChange={(e) => setCustomerAddress(e.target.value)}
        />
      </Autocomplete>
    </div>
  );
};

export default MapComponent;
