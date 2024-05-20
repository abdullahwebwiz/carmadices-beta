import React from 'react';
import Logo from '../assets/mycarmedics-logo-white.svg';

const Footer = () => {
  return (
    <footer className="bg-darker-blue text-white py-8 lg:px-20">
        <div className="max-w-[1420px] mx-auto">
            <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between">

                <div className="flex items-center">
                    <img src={Logo} alt="Logo" className="lg:h-12 h-16 w-full mb-4 text-white" />
                </div>

                <nav className="flex lg:flex-row flex-col gap-2 items-center font-bold lg:font-normal lg:flex-initial mt-4 lg:mt-0 lg:space-x-4">
                <a href="/" className="hover:text-gray-400">Headlights Restoration</a>
                <a href="#" className="hover:text-gray-400 hidden">Products</a>
                <a href="#" className="hover:text-gray-400 hidden">About Us</a>
                <a href="/partner" className="text-blue hover:text-gray-400">Become Car Medic</a>
                <a href="#" className="text-blue hover:text-gray-400">Login</a>
                </nav>

            </div>
        
            <div>
                <div className="text-sm text-center text-gray-500 mt-4">
                    &copy; {new Date().getFullYear()} MyCarMedics.com | All rights reserved
                </div>
            </div>
      </div>
    </footer>
  );
};

export default Footer;
