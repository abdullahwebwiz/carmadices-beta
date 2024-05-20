import React, { useState } from 'react';

const LeadForm: React.FC = () => {
  // State to hold form data
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    headlights: '',
  });

  // Event handler for form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Send form data to backend API
      const response = await fetch('https://ecbf-2600-1006-a002-6ba3-cde8-2263-f0f3-6300.ngrok-free.app/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Handle response from the backend
      if (response.ok) {
        // Form submission successful
        console.log('Form submitted successfully!');
        // Reset form fields
        setFormData({
          fullName: '',
          email: '',
          phoneNumber: '',
          headlights: '',
        });
      } else {
        // Form submission failed
        console.error('Form submission failed!');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Event handler to update form data
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="flex flex-col w-full">
      <h2 className="text-5xl text-blue text-center font-black mb-2">Fill out this form</h2>
      <p className="text-white font-bold text-center text-2xl mb-6">We will send you a quote right away!</p>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="text"
            id="fullName"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            className="mt-1 p-3 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-full"
          />
        </div>
        <div className="mb-4">
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 p-3 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-full"
          />
        </div>
        <div className="mb-4">
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="mt-1 p-3 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-full"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            id="headlights"
            name="headlights"
            placeholder="Headlights To Restore"
            value={formData.headlights}
            onChange={handleChange}
            className="mt-1 p-3 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-full"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue py-3 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Get Quote Now
        </button>
      </form>
    </div>
  );
};

export default LeadForm;
