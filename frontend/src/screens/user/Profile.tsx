import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import HeaderMenu from '../../components/HeaderMenu';
import Footer from '../../components/Footer';
import ProfileData from '../../components/user/ProfileData';
import OrdersList from '../../components/user/OrdersList';

const Profile: React.FC = () => {
  const { user, logout, fetchProfileData } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user) {
          await fetchProfileData();
          setLoading(false);
        } else {
          setLoading(false); // No user, no need to fetch data
        }
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
        logout();
        navigate('/login');
      }
    };
  
    if (user) {
      fetchData();
    } else {
      navigate('/login');
    }
  }, []); // Empty dependency array ensures useEffect runs only once

  // Log the contents of localStorage
const logLocalStorage = () => {
  for (let i = 0; i < localStorage.length; i++) {
      const key : any = localStorage.key(i);
      const value = localStorage.getItem(key);
      console.log(`${key}: ${value}`);
  }
};

// Call the function to log localStorage contents
logLocalStorage();
  

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex flex-col h-screen">
        <HeaderMenu />
        <div className="bg-blue/25 lg:px-20 px-8 flex-1">
          <div className="flex-grow lg:flex lg:flex-row gap-8 py-8 items-start justify-center">
            <div className="flex lg:w-1/4 mb-8">
              {/* @ts-ignore */}
            <ProfileData profileData={user} />
            </div>
            <div className="bg-white p-4 rounded-xl flex-col lg:w-3/4 w-full">
              <h2 className="text-5xl font-black mb-0">History</h2>
              <p className="mb-4">Your past orders list</p>
              <OrdersList />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Profile;
