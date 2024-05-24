import React, { useState } from "react";
import axios from "axios";
import HeaderMenu from "../components/HeaderMenu";
import Footer from "../components/Footer";
import { validateInput } from "../utils/validation"; // Import the validation function
// import { Navigate } from "react-router-dom";

interface RegisterFormData {
  firstName: string;
  email: string;
  password: string;
  phone: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: "",
    email: "",
    password: "",
    phone: "",
  });
  const [message, setMessage] = useState<string>("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({}); // State for form errors
  const signupEndpoint = "https://carmadices-beta-11pk.vercel.app/user/signup";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Optionally clear errors as user types
    setFormErrors((prevErrors) => ({ ...prevErrors, [e.target.name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Attempt to validate input
    try {
      const errors : any = validateInput(
        formData.firstName,
        formData.email,
        formData.password,
        formData.phone
      );
      setFormErrors(errors);
      if (Object.keys(errors).length > 0) {
        console.log(errors);
        // Stop form submission if there are errors
        return;
      }
    } catch (error) {
      alert("error 2");
      console.error("Validation error:", error);
      // Optionally, handle unexpected errors in validation function
      return;
    }

    // Proceed with submitting form data if validation passes
    try {
      alert();
      const response = await axios.post(signupEndpoint, formData);
      if (response && response.data) {
        setMessage(response.data.message);
        setFormErrors({}); // Clear errors on successful submission
      } else {
        // Handle cases where response or response.data is undefined
        console.error("Unexpected response:", response);
      }
    } catch (error : any) {
      if (error.response && error.response.data) {
        setMessage(error.response.data.message);
      } else {
        // Handle cases where error.response or error.response.data is undefined
        console.error("Error:", error);
      }
    }
  };
  return (
    <>
      <div className="flex flex-col h-screen">
        <HeaderMenu />
        <div className="flex-grow bg-blue/25 lg:flex flex-col items-center justify-center lg:py-10">
          <form
            onSubmit={handleSubmit}
            className="bg-white/25 p-8 lg:rounded-2xl"
          >
            <h1 className="text-center text-black text-5xl font-black mb-8">
              Create an Account
            </h1>

            <div className="flex flex-col gap-4 mb-4">
              <div className="flex flex-col flex-1 text-center font-semibold text-black">
                <label htmlFor="firstName" className="mb-2">
                  First Name:
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Alex Smith"
                  className="text-black px-4 py-3 rounded-full bg-white"
                />
                {formErrors.firstName && (
                  <p className="text-red-500 mt-2">{formErrors.firstName}</p>
                )}
              </div>

              <div className="flex flex-col flex-1 text-center font-semibold text-black">
                <label htmlFor="email" className="mb-2">
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="text-black px-4 py-3 rounded-full bg-white"
                  placeholder="alex@abc.com"
                />
                {formErrors.firstName && (
                  <p className="text-red-500 mt-2">{formErrors.email}</p>
                )}
              </div>
              <div className="flex flex-col flex-1 text-center font-semibold text-black">
                <label htmlFor="phone" className="mb-2">
                  Phone:
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                  className="text-black px-4 py-3 rounded-full bg-white"
                />
                {formErrors.firstName && (
                  <p className="text-red-500 mt-2">{formErrors.phone}</p>
                )}
              </div>
              <div className="flex flex-col flex-1 text-center font-semibold text-black">
                <label htmlFor="password" className="mb-2">
                  Password:
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="text-black px-4 py-3 rounded-full bg-white"
                />
                {formErrors.firstName && (
                  <p className="text-red-500 mt-2">{formErrors.password}</p>
                )}
              </div>
            </div>
            {/* Display success or error message */}
            {message && (
              <p
                className={
                  message.includes("successful")
                    ? "text-green-600 mb-4 text-center"
                    : "text-red-600 mb-4 text-center"
                }
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              className="p-3 bg-dark-blue text-white rounded-full w-full"
            >
              Create Account
            </button>
            <p className="text-center mt-2">
              Already have an account?{" "}
              <a href="/login" className="text-blue font-semibold">
                Log in here.
              </a>
            </p>
          </form>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Register;
