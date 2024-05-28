import { Elements } from "@stripe/react-stripe-js";
import OrderForm from "../../components/landingPage/OrderForm";
import { loadStripe } from "@stripe/stripe-js";
import HeaderMenu from "../../components/HeaderMenu";
import { useAuth } from "../../contexts/authContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const stripePromise = loadStripe(
  "pk_test_51PK2e4AbZoRkoGyHXWL0GQxTRlT6J1SJMiWw37DkKvVfzE8qLv0TKJLdm5yzdyd2txMYvIg5bOICHZrk1xvlcR0U00GyNPL9qT"
);
const Order: React.FC = () => {
  const { user }: any = useAuth();
  const navigate = useNavigate();
  console.log(user);

  useEffect(() => {
    setTimeout(() => {
      if (!user) {
        navigate("/login");
      }
    }, 500);
  }, [user]);
  return (
    <>
      <HeaderMenu />
      <Elements stripe={stripePromise}>
        <OrderForm userData={user} />
      </Elements>
    </>
  );
};

export default Order;
