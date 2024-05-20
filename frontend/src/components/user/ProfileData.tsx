import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/authContext'; // Adjust path as necessary
import { Autocomplete } from '@react-google-maps/api'; // Import Autocomplete

const ProfileData: React.FC = () => {
  const { user, fetchProfileData, updateProfileData, loginError } = useAuth();
  const [editedProfileData, setEditedProfileData] = useState(user);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchProfileData();
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
      }
    };

    if (!user) {
      fetchData();
    }
  }, [user, fetchProfileData]);

  const handlePlaceSelect = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place && place.address_components) {
        const formattedAddress = place.formatted_address;
        setEditedProfileData(prevState => ({
          ...prevState,
          shippingAddress: formattedAddress,
        }));
      }
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEditedProfileData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateProfileData = (data) => {
    let errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email regex for demonstration
    const phoneRegex = /^[0-9]{10,}$/; // Basic regex, adjust according to your requirements
  
    if (!data.firstName.match(/^[a-zA-Z ]+$/)) {
      errors.firstName = "Name must contain only letters.";
    }
    if (!emailRegex.test(data.email)) {
      errors.email = "Invalid email format.";
    }
    if (!phoneRegex.test(data.phone)) {
      errors.phone = "Invalid phone number. Must be at least 10 digits.";
    }
  
    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Validate editedProfileData before submission
    const newErrors = validateProfileData(editedProfileData);
    setValidationErrors(newErrors);
  
    // Only proceed if there are no validation errors
    if (Object.keys(newErrors).length === 0) {
      const response = await updateProfileData(editedProfileData);
      if (response.success) {
        setSavedMessage(response.message);
        setErrorMessage(null);
      } else {
        setSavedMessage(null);
        setErrorMessage(response.message || loginError);
      }
    } else {
      setSavedMessage(null);
    }
  };
  

  if (!editedProfileData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col bg-white p-4 w-full rounded-xl">

      <h2 className="lg:text-5xl text-4xl font-black mb-0">Profile</h2>
      <p className="mb-4">Your account informations</p>
      <input type="text" name="firstName" value={editedProfileData?.firstName || ''} onChange={handleInputChange}
        className="bg-white border rounded-lg px-4 py-2 font-semibold mb-2" />
      {validationErrors.firstName && <div className="error px-4 mb-2 text-red-600 text-xs font-semibold">{validationErrors.firstName}</div>}

      <input type="email" name="email" value={editedProfileData?.email || ''} onChange={handleInputChange}
        className="bg-white border rounded-lg px-4 py-2 font-semibold mb-2" />
      {validationErrors.email && <div className="error px-4 mb-2 text-red-600 text-xs font-semibold">{validationErrors.email}</div>}

      <input type="tel" name="phone" value={editedProfileData?.phone || ''} onChange={handleInputChange}
        className="bg-white border rounded-lg px-4 py-2 font-semibold mb-2" />

      {validationErrors.phone && <div className="error px-4 mb-2 text-red-600 text-xs font-semibold">{validationErrors.phone}</div>}

      <Autocomplete 
      onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
      onPlaceChanged={handlePlaceSelect}
      options={{
        componentRestrictions: { country: 'us',} // Restricted to United States
      }} 
      >
  <input
    type="text"
    name="shippingAddress"
    value={editedProfileData?.shippingAddress || ''}
    onChange={handleInputChange}
    className="bg-white border rounded-lg px-4 py-2 font-semibold mb-2 w-full h-auto resize-y"
    placeholder="Enter your shipping address"
  />
</Autocomplete>



      <button onClick={handleSubmit}
        className="bg-blue py-2 rounded-lg text-white font-semibold">
        Save Changes</button>
      {savedMessage && <div className="text-xs text-center text-green-600 mt-2">{savedMessage}</div>}
      {errorMessage && <div className="text-xs text-center text-green-600 mt-2">{errorMessage}</div>}
    </div>
  );
};

export default ProfileData;
