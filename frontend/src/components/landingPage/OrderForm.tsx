import React, { useState, useEffect } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axios from "axios";
import ReactPixel from "react-facebook-pixel";
import { useAuth } from "../../contexts/authContext";
import { useNavigate } from "react-router-dom";
import { validateInput } from "../../utils/validation";
import MapComponent from "./MapComponent";
import Calendar from "react-calendar";
import Modal from "react-modal";
import "./CustomCalendar.css"; // Import the custom CSS file for calendar styling
import Stripe from "../../assets/stripe.png";
import { loadStripe } from "@stripe/stripe-js";

Modal.setAppElement("#root");

// Calendar styles
const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: "9999",
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "80%",
    maxHeight: "80%",
    overflow: "auto",
    backgroundColor: "white",
    borderRadius: "0.5rem",
    boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.3)",
  },
};

ReactPixel.init("7582804658445660");

const API_BASE_URL = "https://www.carmadices-beta-11pk.vercel.app/";

const instance = axios.create({
  baseURL: API_BASE_URL,
});

const HeadlightRestorationForm = () => {
  const navigate = useNavigate();
  const { user, userToken } = useAuth();
  const stripe = useStripe();
  const elements = useElements();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const [headlightsCount, setHeadlightsCount] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    address: "",
    headlightsCount: 1,
    tintColor: "",
    isTint: false,
    ceramicGuard: false,
    scheduledDate: null,
    extrasPrice: 0,
    totalPrice: 79.99,
    orderType: "Service",
    paymentStatus: "",
    serviceProvider: "",
    serviceType: "Headlight Restoration",
    status: "Pending",
    userId: user ? user._id : "",
    startHour: null,
    endHour: null,
    serviceLocation: "Garage",
    providerId: "",
  });

  // Providers state
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState("");

  // Address and distance state
  const [serviceLocation, setServiceLocation] = useState("Garage");
  const [customerAddress, setCustomerAddress] = useState("");
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [unavailableSlots, setUnavailableSlots] = useState([]);

  useEffect(() => {
    console.log(formData.scheduledDate);
  }, [formData.scheduledDate]);
  // After opening modal, render time slots
  const checkSlotAvailability = (hour, duration) => {
    // Find the index of the next slot
    const nextSlotIndex = hour - 9; // Assuming the first slot starts at 9 AM

    // Check if the next slot exists and if it's within the available slots
    if (
      nextSlotIndex !== -1 &&
      nextSlotIndex + duration <= availableSlots.length
    ) {
      // Check if all slots within the duration are available
      for (let i = nextSlotIndex; i < nextSlotIndex + duration; i++) {
        if (!availableSlots[i]) {
          return false; // Slot is not available
        }
      }
      return true; // All slots are available
    }

    return false; // Next slot or duration is not within the available slots
  };

  const handleTimeSlotSelection = async (hour) => {
    const startHour = `${hour}:00`;
    let endHour = hour;

    // Calculate the end hour based on the number of headlights
    if (formData.headlightsCount <= 3) {
      endHour += 1; // 1-3 headlights can be done within the selected hour
    } else {
      const additionalHours = Math.ceil((formData.headlightsCount - 3) / 4); // Calculate additional hours needed
      endHour += 1 + additionalHours; // Add the initial hour and additional hours
    }

    endHour += ":00"; // Format the end hour

    setFormData((prevState) => ({
      ...prevState,
      startHour,
      endHour,
    }));
  };

  const fetchAvailableSlots = async () => {
    if (!selectedDate || !selectedProvider) return;
    const formattedDate = selectedDate.toISOString().slice(0, 10);
    try {
      const response = await axios.get(
        `https://carmadices-beta-11pk.vercel.app/user/availability`,
        {
          params: {
            providerId: selectedProvider,
            date: formattedDate,
            headlightsCount,
          },
        }
      );

      // Convert the availability data to an array of boolean values
      const availabilityArray = response.data.availability.map(
        (slot) => !!slot
      );

      // Store the available slots in state
      const slots = availabilityArray.reduce(
        (acc, available, index) => {
          if (available) acc.available.push(index);
          else acc.unavailable.push(index);
          return acc;
        },
        { available: [], unavailable: [] }
      );

      setAvailableSlots(slots.available);
      setUnavailableSlots(slots.unavailable); // Assume you have a state variable for unavailable slots

      console.log("Available slots:", slots.available);
      console.log("Unavailable slots:", slots.unavailable);
    } catch (error) {
      console.error("Error fetching available slots:", error);
    }
  };

  const renderTimeSlots = () => {
    const minBookableTime = getMinimumBookableTime().getHours();
    const maxHour = 17; // Adjusted to 17 for 4PM-5PM slot
    const today = new Date().getDate();
    const selectedDay = selectedDate.getDate();
    const slots = [];

    let slotsAvailable = false;

    for (let index = 0; index < maxHour - 9; index++) {
      const hour = index + 9;
      const isAvailable = availableSlots.includes(index); // Adjusted index to start from 0

      if (isAvailable || (today === selectedDay && hour < minBookableTime)) {
        slotsAvailable = true;

        const hour12 = hour % 12 || 12;
        const ampm = hour < 12 ? "AM" : "PM";

        slots.push(
          <button
            key={hour}
            onClick={() => handleTimeSlotSelect(hour)}
            className={`py-2 px-4 m-1 rounded-lg ${
              isAvailable
                ? "bg-green-600 text-white"
                : "bg-red-500 text-white cursor-not-allowed"
            }`}
            disabled={!isAvailable}
          >
            {`${hour12}:00 ${ampm} - ${hour12 + 1}:00 ${ampm}`}
          </button>
        );
      } else {
        const hour12 = hour % 12 || 12;
        const ampm = hour < 12 ? "AM" : "PM";

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

    return slots.length > 0 ? (
      slots
    ) : (
      <p className="font-bold">All slots are unavailable for this date.</p>
    );
  };

  const getMinimumBookableTime = () => {
    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours() + 2);
    return currentTime;
  };

  // Form submission state
  const [submissionError, setSubmissionError] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Fetch available slots
  useEffect(() => {
    fetchAvailableSlots();
  }, [selectedDate, selectedProvider]);

  // Fetch providers list
  // useEffect(() => {
  //     const fetchProviders = async () => {
  //         try {
  //             const response = await instance.get('user/providers');
  //             setProviders(response.data.providers);
  //             console.log(response.data.providers);
  //         } catch (error) {
  //             console.error('Error fetching providers:', error);
  //             // Handle error as needed
  //         }
  //     };

  //     fetchProviders();
  // }, []);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await fetch("https://carmadices-beta-11pk.vercel.app/getproviders/data");
        let result = await response.json();
        console.log(result);
        setProviders(result);
      } catch (error) {
        console.error("Error fetching providers:", error);
        // Handle error as needed
      }
    };

    fetchProviders();
  }, []);

  // useEffect(() => {
  //   const fetchProviders = async () => {
  //     try {
  //       const response = await instance.get("user/providers");
  //       setProviders(response.data.providers);
  //       console.log(response.data.providers);
  //     } catch (error) {
  //       console.error("Error fetching providers:", error);
  //       // Handle error as needed
  //     }
  //   };

  //   fetchProviders();
  // }, []);

  // Fetch available slots based on selected date, provider, and headlights count
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!formData.scheduledDate || !selectedProvider) return;
      const formattedDate = formData.scheduledDate.toISOString().slice(0, 10);
      try {
        const response = await axios.get(
          `https://carmadices-beta-11pk.vercel.app/user/availability`,
          {
            params: {
              providerId: selectedProvider,
              date: formattedDate,
              headlightsCount: formData.headlightsCount,
            },
          }
        );
        setAvailableSlots(response.data.availability);
        console.log(response.data.availability);
      } catch (error) {
        console.error("Error fetching available slots:", error);
      }
    };

    fetchAvailableSlots();
  }, [formData.scheduledDate, selectedProvider, formData.headlightsCount]);

  // Handle decrementing the headlights count
  const handleHeadlightsDecrement = () => {
    if (formData.headlightsCount > 1) {
      setFormData((prevState) => ({
        ...prevState,
        headlightsCount: prevState.headlightsCount - 1,
      }));
    }
  };

  // Handle incrementing the headlights count
  const handleHeadlightsIncrement = () => {
    setFormData((prevState) => {
      const newHeadlightsCount = prevState.headlightsCount + 1;
      let endHour = prevState.endHour;

      // Check if the next slot is available for each additional headlight
      for (let i = 1; i < newHeadlightsCount; i++) {
        const nextSlotAvailable = checkSlotAvailability(
          parseInt(prevState.startHour.split(":")[0]) + i,
          1
        );
        if (!nextSlotAvailable) {
          // Reduce the headlightsCount if the next slot is not available
          return {
            ...prevState,
            headlightsCount: i,
            endHour: `${parseInt(prevState.startHour.split(":")[0]) + i}:00`,
          };
        }
      }

      // Update endHour based on the newHeadlightsCount
      if (newHeadlightsCount > 3 && (newHeadlightsCount - 1) % 4 === 0) {
        const hour = parseInt(prevState.endHour.split(":")[0]); // Extract the hour part
        endHour = `${hour + 1}:00`;
      }

      return {
        ...prevState,
        headlightsCount: newHeadlightsCount,
        endHour,
      };
    });
  };

  // Tint logic
  const handleTintCheckboxChange = (event) => {
    const { checked } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      isTint: checked,
    }));
  };
  const handleTintColorChange = (event) => {
    const { value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      tintColor: value,
    }));
  };

  // Calendar

  // Handle initial date change and open modal for time slots
  const handleDateChange = (date) => {
    setSelectedDate(date);
    console.log(date);
    setIsModalOpen(true);
    setFormData({ ...formData, scheduledDate: date });
  };

  const handleTimeSlotSelect = (hour) => {
    const startHour = `${hour}:00`;
    const endHour = `${hour + 1}:00`;
    setFormData({ ...formData, startHour, endHour });
    setIsModalOpen(false); // Close the modal after selecting a time slot
  };

  useEffect(() => {
    setFormData((prevState) => ({
      ...prevState,
      headlightsCount: 1,
    }));
  }, [selectedDate]);

  // Form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = validateInput(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const { data } = await instance.post("orders", formData, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (data.paymentIntentClientSecret) {
        await stripe.confirmCardPayment(data.paymentIntentClientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        });

        ReactPixel.track("Purchase", {
          value: calculatedPrice,
          currency: "USD",
        });

        setIsSubmitting(false);
        setFormSubmitted(true);
        navigate("/confirmation");
      } else {
        throw new Error("Payment failed");
      }
    } catch (error) {
      setSubmissionError("Payment failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  // Pricing calculations
  const pricePerHeadlight = formData.headlightsCount > 1 ? 79.98 : 99.97;
  const extrasPrice = formData.isTint ? 19.98 * formData.headlightsCount : 0;
  const totalPrice =
    pricePerHeadlight * formData.headlightsCount +
    extrasPrice +
    calculatedPrice;

  let handleCheckout = async () => {
    if (
      formData.name &&
      formData.email &&
      formData.password &&
      formData.phone &&
      formData.providerId &&
      formData.address
    ) {
      let localFormData = JSON.stringify({ ...formData, price: totalPrice });
      localStorage.setItem("formData", localFormData);

      let stripe: any = await loadStripe(
        "pk_test_51PK2e4AbZoRkoGyHXWL0GQxTRlT6J1SJMiWw37DkKvVfzE8qLv0TKJLdm5yzdyd2txMYvIg5bOICHZrk1xvlcR0U00GyNPL9qT"
      );

      let response: any = await fetch("https://carmadices-beta-11pk.vercel.app/paytest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, price: totalPrice }),
      });

      let session = await response.json();
      console.log(session);
      if (session.msg == "exist") {
        alert(
          "This email is registered, first login to make an order. Thank you"
        );
      } else {
        stripe.redirectToCheckout({
          sessionId: session.id,
        });
      }
    } else {
      alert("Provide all required data");
    }
  };
  return (
    <div>
      {!formSubmitted ? (
        <>
          <div className="flex flex-col w-1/3 justify-center items-center mx-auto gap-2 py-10">
            {/* Basic Inputs */}
            <p>First Name</p>
            <input
              type="text"
              placeholder="First Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg mb-0 text-center appearance-none border border-gray-300"
              required
            />
            <p>Email</p>
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg mb-0 text-center appearance-none border border-gray-300"
              required
            />
            <p>Phone Number</p>
            <input
              type="tel"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg mb-0 text-center appearance-none border border-gray-300"
              required
            />
            <p>Set up your password</p>
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg mb-0 text-center appearance-none border border-gray-300"
              required
            />

            <p>Select Service Location</p>
            <select
              id="locationSelect"
              value={serviceLocation}
              onChange={(e) => {
                setServiceLocation(e.target.value);
                setFormData((prevState) => ({
                  ...prevState,
                  serviceLocation: e.target.value,
                }));
              }}
              className="w-full px-4 py-2 rounded-lg mb-0 text-center appearance-none border border-gray-300"
              required
            >
              <option value="">Select Location</option>
              <option value="Garage">
                Car Medics Oakland Park - 3901 NE 5th Terrace SUITE 4
              </option>
              <option value="CustomerLocation">
                Order service at my location
              </option>
            </select>

            {/* Choose Provider */}
            <p className="font-semibold">Select Service Provider</p>
            <select
              id="providerSelect"
              value={selectedProvider}
              onChange={(e) => {
                setSelectedProvider(e.target.value);
                setFormData((prevState) => ({
                  ...prevState,
                  providerId: e.target.value,
                }));
              }}
              className="w-full px-4 py-2 rounded-lg mb-0 text-center appearance-none border border-gray-300"
              required
            >
              <option value="">Select a Provider</option>
              {Array.isArray(providers) &&
                providers.map((provider) => (
                  <option key={provider._id} value={provider._id}>
                    {provider.firstName} - {provider.email}
                  </option>
                ))}
            </select>

            {/* Whole Calendar With Time Slots ( Visible only when provider is selected ) */}
            {selectedProvider && (
              <div className="custom-calendar">
                <Calendar
                  onChange={handleDateChange}
                  className="w-full"
                  value={selectedDate}
                  minDate={new Date()}
                />
              </div>
            )}
            <Modal
              isOpen={isModalOpen}
              onRequestClose={handleCloseModal}
              style={customStyles}
              contentLabel="Available Time Slots"
            >
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-1 text-center">
                  Time Slots
                </h2>
                <p className="mb-4 text-center">
                  Selected date:{" "}
                  <strong>
                    {selectedDate
                      ? selectedDate.toDateString()
                      : "None selected"}
                  </strong>
                </p>
                <div className="grid lg:grid-cols-1 gap-1">
                  {renderTimeSlots()}
                </div>
              </div>
            </Modal>

            {/* Google API Autocomplete Address Input */}
            <p>Your Address</p>
            <MapComponent
              setAddress={setCustomerAddress}
              setCalculatedPrice={setCalculatedPrice}
              serviceLocation={serviceLocation}
              customerAddress={customerAddress}
              parentAddress={(e: any) => {
                setFormData((prevState) => ({
                  ...prevState,
                  address: e,
                }));
              }}
            />

            {/* Headlights Amount */}
            <p>How many headlights to restore?</p>
            <div className="flex items-center gap-2 mb-4 mt-2">
              <button
                type="button"
                onClick={handleHeadlightsDecrement}
                className="px-4 py-2 bg-blue text-white font-bold rounded-lg"
              >
                -
              </button>
              <input
                type="text"
                name="headlightsCount"
                value={formData.headlightsCount} // Set the value attribute to formData.headlightsCount
                onChange={(e) =>
                  setFormData({ ...formData, headlightsCount: e.target.value })
                }
                className="text-center w-20 bg-blue/15 text-black px-4 py-2 rounded-lg"
              />
              <button
                type="button"
                onClick={handleHeadlightsIncrement}
                className="px-4 py-2 bg-blue text-white font-bold rounded-lg"
              >
                +
              </button>
            </div>

            <p className="font-bold">Add more cool options</p>
            <label htmlFor="tintColorCheckbox" className="flex items-center">
              <input
                id="tintColorCheckbox"
                type="checkbox"
                checked={formData.isTint}
                onChange={handleTintCheckboxChange}
                className="mr-2"
              />
              Tint Color
            </label>
            {formData.isTint && (
              <>
                <p>Choose color</p>
                <select
                  value={formData.tintColor}
                  onChange={handleTintColorChange}
                  className="w-full px-4 py-2 rounded-lg mb-0 text-center appearance-none border border-gray-300"
                >
                  <option value="">Select Color</option>
                  <option value="Black">Black</option>
                  <option value="Blue">Blue</option>
                  <option value="Red">Red</option>
                  <option value="Green">Green</option>
                  <option value="Purple">Purple</option>
                </select>
              </>
            )}

            <p>How much will you pay today?</p>
            {serviceLocation === "CustomerLocation" && (
              <>
                <p>
                  Service Charge: <strong>${calculatedPrice.toFixed(2)}</strong>
                </p>
              </>
            )}
            <p>
              Extras Price: <strong>${extrasPrice.toFixed(2)}</strong>
            </p>
            <div className="bg-green-300 border border-green-400 rounded-lg p-4 text-center">
              <p className="font-bold">Total Price:</p>
              <p className="text-xl font-bold">${totalPrice.toFixed(2)}</p>
            </div>

            <p className="mb-2 text-center text-xs">
              Price includes all taxes and fees and it's final. You will be
              charged immediately and there is no refunds.
            </p>

            <button
              onClick={handleCheckout}
              // onClick={() => {
              //   console.log(formData.scheduledDate);
              // }}
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue text-white px-4 py-2 rounded-lg flex justify-center items-center"
            >
              {isSubmitting && (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                >
                  {/* Spinner SVG path here */}
                </svg>
              )}
              {isSubmitting ? "Submitting..." : "Submit Order"}
            </button>
          </div>
        </>
      ) : (
        <p>Your order has been submitted successfully!</p>
      )}
    </div>
  );
};

export default HeadlightRestorationForm;
