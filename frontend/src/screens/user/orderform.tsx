import { Elements } from "@stripe/react-stripe-js";
import OrderForm from "../../components/landingPage/OrderForm";
import { loadStripe } from "@stripe/stripe-js";
import HeaderMenu from "../../components/HeaderMenu";
import { useAuth } from "../../contexts/authContext";
const stripePromise = loadStripe(
  "pk_test_51PK2e4AbZoRkoGyHXWL0GQxTRlT6J1SJMiWw37DkKvVfzE8qLv0TKJLdm5yzdyd2txMYvIg5bOICHZrk1xvlcR0U00GyNPL9qT"
);
const Order: React.FC = () => {
  const { user }:any = useAuth();
  console.log(user);
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
