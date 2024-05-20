import React, { useState, useRef } from 'react';
import { Autocomplete } from '@react-google-maps/api';

const libraries = ['places'];

const MapComponent = ({ setAddress, setCalculatedPrice }) => {
  const [customerAddress, setCustomerAddress] = useState('');
  const officeAddress = '3901 NE 5th Terrace SUITE 4, Oakland Park, Florida';
  const [distance, setDistance] = useState(null);
  const [price, setPrice] = useState(null);
  const [error, setError] = useState(null); // State to handle error messages
  const autocompleteRef = useRef(null);

  // Function to calculate distance and price
  const calculateDistanceAndPrice = async (selectedAddress) => {
    try {
      const response = await fetch(`https://mycarmedics.com:8080/calculate-distance?origin=${encodeURIComponent(officeAddress)}&destination=${encodeURIComponent(selectedAddress)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // Extract the numeric part of the distance string and convert to number
      const distanceKm = parseFloat(data.distance.split(' ')[0]);
      // Convert kilometers to miles
      const distanceMiles = distanceKm * 0.621371;
      // Assuming $1 per mile pricing model
      const calculatedPrice = distanceMiles * 1;

      setDistance(distanceMiles.toFixed(2));
      setPrice(calculatedPrice.toFixed(2));
      setError(null); // Reset error state on successful calculation
      setAddress(selectedAddress); // Update customer address in parent component
      setCalculatedPrice(calculatedPrice); // Update calculated price in parent component
    } catch (error) {
      console.error("Error calculating distance: ", error.message);
      setError("Looks like this address is wrong, please try again");
      setDistance(null);
      setPrice(null);
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
        calculateDistanceAndPrice(formattedAddress);
        setAddress(formattedAddress);
      } else {
        console.error("No details available for input: '" + place?.name + "'");
        setError("Looks like this address is wrong, please try again");
      }
    }
  };

  return (
      <div className="w-full">
        <p className="text-center mb-1">Where we should come?</p>
        <Autocomplete onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)} onPlaceChanged={handlePlaceSelect}
        options={{
          componentRestrictions: { country: 'us',} // Restricted to United States
        }}>
        <input
          type="text"
          placeholder="Enter your address"
          className="w-full py-2 px-4 rounded-lg border text-center"
          value={customerAddress}
          onChange={(e) => setCustomerAddress(e.target.value)}
        />
      </Autocomplete>
        {error && <p className="mt-2 text-red-500 text-center">{error}</p>}
        {distance && price && (
          <div className="mt-2 text-center">
            <p>Distance: {distance} miles</p>
            <p>Price: ${price}</p>
          </div>
        )}
      </div>
  );
};

export default MapComponent;
