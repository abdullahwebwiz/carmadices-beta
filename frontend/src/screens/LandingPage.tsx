import React from "react";
import HeroSection from "../components/landingPage/HeroSection";
import ContentContainer from "../components/landingPage/ContentContainer";
// import LatestWork from '../components/landingPage/LatestWork';
import SatisfactionGuaranteed from "../components/landingPage/SatisfactionGuaranteed";
import HeaderMenu from "../components/HeaderMenu";
import Footer from "../components/Footer";
import OrderForm from "../components/landingPage/OrderForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import OrderScheduler from "../components/landingPage/OrderScheduler";
import { useAuth } from "../contexts/authContext";
// import Calendar from '../components/landingPage/Calendar';

const stripePromise = loadStripe(
  "pk_test_51PK2e4AbZoRkoGyHXWL0GQxTRlT6J1SJMiWw37DkKvVfzE8qLv0TKJLdm5yzdyd2txMYvIg5bOICHZrk1xvlcR0U00GyNPL9qT"
);

// Log the contents of localStorage
const logLocalStorage = () => {
  for (let i = 0; i < localStorage.length; i++) {
    const key: any = localStorage.key(i);
    const value = localStorage.getItem(key);
    console.log(`${key}: ${value}`);
  }
};

// Call the function to log localStorage contents
logLocalStorage();

const LandingPage: React.FC = () => {
  const { user } = useAuth();
  return (
    <div>
      <HeaderMenu />
      <HeroSection />
      <ContentContainer />
      <Elements stripe={stripePromise}>
        {!user ? <OrderForm /> : null}
        <SatisfactionGuaranteed />
      </Elements>
      <Footer />
    </div>
  );
};

export default LandingPage;
