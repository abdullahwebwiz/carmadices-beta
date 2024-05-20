import React from 'react';
import HeroSection from '../components/landingPage/HeroSection';
import ContentContainer from '../components/landingPage/ContentContainer';
import LatestWork from '../components/landingPage/LatestWork';
import SatisfactionGuaranteed from '../components/landingPage/SatisfactionGuaranteed';
import HeaderMenu from '../components/HeaderMenu';
import Footer from '../components/Footer';
import OrderForm from '../components/landingPage/OrderForm';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Calendar from '../components/landingPage/Calendar';

const stripePromise = loadStripe('pk_test_51P1Dr3DuQ2xq97QExKde8eaXqU2BKm7L8wGvTErtdYT4DjQ8hkBm3XWVJXifxInEfn8vZKowNLXyhHk0OsNj5bZa00pUN7qLv6');

  // Log the contents of localStorage
  const logLocalStorage = () => {
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        console.log(`${key}: ${value}`);
    }
  };
  
  // Call the function to log localStorage contents
  logLocalStorage();

const LandingPage: React.FC = () => {
  return (
    <div>
      <HeaderMenu />
      <HeroSection />
      <ContentContainer />
      <Elements stripe={stripePromise}>
        <OrderForm />
        <SatisfactionGuaranteed />
      </Elements>
      <Footer />
    </div>
  );
};

export default LandingPage;
