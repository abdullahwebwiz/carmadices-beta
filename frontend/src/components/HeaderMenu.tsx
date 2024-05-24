import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/mycarmedics-logo.svg'; // Make sure the path is correct
import { useAuth } from '../contexts/authContext'; // Adjust the import path as needed
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

const HeaderMenu = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoverTimeoutId, setHoverTimeoutId] = useState(null);

  const { user, logout, isAdmin, isProvider } = useAuth();

  // Handle opening and closing dropdown with delay
  const handleDropdownHover = (action) => {
    if (hoverTimeoutId) clearTimeout(hoverTimeoutId);

    const timeoutId = action === 'enter' 
      ? setTimeout(() => setIsDropdownOpen(true), 100) 
      : setTimeout(() => setIsDropdownOpen(false), 300);

    setHoverTimeoutId(timeoutId);
  };

  useEffect(() => {
    // Cleanup timeout on component unmount to avoid memory leaks
    return () => hoverTimeoutId && clearTimeout(hoverTimeoutId);
  }, [hoverTimeoutId]);

  return (
    <div>
      <nav className="flex flex-row px-8 items-center min-h-[80px] justify-between shadow-lg lg:shadow-2xl lg:px-20 lg:relative lg:shadow-blue/15">
        <Link to="/">
          <img src={Logo} alt="Logo" className="h-12 lg:ml-0 text-white" />
        </Link>

        <div className="hidden md:flex gap-8 items-center font-semibold">
        <Link to="/">
          <span>Headlights Restoration</span>
          </Link>
          <Link to="/dealers">
          <span>Dealership Offer</span>
          </Link>
          <div className="relative hidden" onMouseEnter={() => handleDropdownHover('enter')} onMouseLeave={() => handleDropdownHover('leave')}>
            <span className="cursor-pointer">Products</span>
            {isDropdownOpen && (
              <div className="absolute left-0 mt-1 w-48 bg-white py-2 border border-gray-300 rounded-lg shadow-md">
                <span className="block px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer">DIY Restoration Kit</span>
                <span className="block px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer">Ceramic Guard</span>
                <span className="block px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer">Tint Color</span>
              </div>
            )}
          </div>
          <span className="hidden">About Us</span>
          <Link to="/partner">
          <span>Become Car Medic</span>
          </Link>
          {user ? (
            <div className="flex gap-4">
              <Link to="/profile" className="bg-blue px-4 py-1 rounded-full text-white">Profile</Link>
              <button onClick={logout} className="bg-blue px-4 py-1 rounded-full text-white">Logout</button>
              {isAdmin && <Link to="/admin" className="bg-blue px-4 py-1 rounded-full text-white">Admin</Link>}
              {isProvider && <Link to="/provider" className="bg-blue px-4 py-1 rounded-full text-white">Provider</Link>}
            </div>
          ) : (
            <Link to="/login" className="text-black dark:text-gray-400">Log in</Link>
          )}
        </div>

        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-black focus:outline-none">
            {isMobileMenuOpen ? <FontAwesomeIcon icon={faTimes} size="2x" /> : <FontAwesomeIcon icon={faBars} size="2x" />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex flex-col bg-white/90 p-4 backdrop-blur-sm">
            <button onClick={() => setIsMobileMenuOpen(false)} className="text-black focus:outline-none">
              <FontAwesomeIcon icon={faTimes} size="3x" />
            </button>
            <div className="flex flex-col items-center text-3xl gap-4 mt-4">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Headlight Restoration</Link>
              <Link to="/dealers" onClick={() => setIsMobileMenuOpen(false)}>Dealership Offer</Link>
              <Link to="#" className="hidden" onClick={() => setIsMobileMenuOpen(false)}>Products</Link>
              <Link to="#" className="hidden" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
              <Link to="/partner" onClick={() => setIsMobileMenuOpen(false)}>Become Car Medic</Link>
              {user ? (
                <>
                  <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="bg-blue px-4 py-1 rounded-full text-white">Profile</Link>
                  <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="bg-blue px-4 py-1 rounded-full text-white">Logout</button>
                  {isAdmin && <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="bg-blue px-4 py-1 rounded-full text-white">Admin</Link>}
                  {isProvider && <Link to="/provider" onClick={() => setIsMobileMenuOpen(false)} className="bg-blue px-4 py-1 rounded-full text-white">Provider</Link>}
                </>
              ) : (
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="bg-blue px-4 py-1 rounded-full text-white">Log in</Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default HeaderMenu;
