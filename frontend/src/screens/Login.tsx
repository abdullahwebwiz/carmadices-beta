import React, { useState } from 'react';
import { useAuth } from '../contexts/authContext'; // Ensure correct path
import { Navigate } from 'react-router-dom';
import HeaderMenu from '../components/HeaderMenu';
import Footer from '../components/Footer';

interface LoginFormData {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({ email: '', password: '' });
  const { login, loginError, user } = useAuth(); // Correctly destructure `user` from useAuth

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(formData.email, formData.password); // Await the login function
  };

  // Redirect to the profile page if the user is successfully logged in
  if (user) {
    return <Navigate to="/profile" replace={true} />;
  }
  return (
    <>
      <div className="flex flex-col h-screen">
        <HeaderMenu />
        <div className="flex-grow bg-blue/25 lg:flex flex-col items-center justify-center lg:py-10">
          <form onSubmit={handleSubmit} className="bg-white/25 p-8 lg:rounded-2xl">
            <h1 className="text-center text-black lg:text-5xl text-5xl font-black mb-8">Log in to your account</h1>
            <div className="flex flex-col gap-4 mb-4">
              <div className="flex flex-col flex-1 text-center font-semibold text-black">
                <label htmlFor="email" className="mb-2">Email:</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange}
                  className="text-black px-4 py-3 rounded-full bg-white" />
              </div>
              <div className="flex flex-col flex-1 text-center font-semibold text-black">
                <label htmlFor="password" className="mb-2">Password:</label>
                <input type="password" id="password" name="password" value={formData.password} onChange={handleChange}
                  className="text-black px-4 py-3 rounded-full bg-white" />
              </div>
            </div>
            {loginError && <div className="text-red-500 mb-4 text-center">{loginError}</div>}
            <button type="submit" className="p-3 bg-dark-blue text-white rounded-full w-full">Log in</button>
            <p className="text-center mt-2">If you don't have an account, you can <a href="/register" className="text-blue font-semibold">create one.</a></p>
          </form>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default LoginForm;
