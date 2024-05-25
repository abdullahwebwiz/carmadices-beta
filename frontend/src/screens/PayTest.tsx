import Button from "@mui/material/Button";
import { loadStripe } from "@stripe/stripe-js";

const PayTest: React.FC = () => {
  let handleCheckout = async () => {
    let stripe: any = await loadStripe(
      "pk_test_51PK2e4AbZoRkoGyHXWL0GQxTRlT6J1SJMiWw37DkKvVfzE8qLv0TKJLdm5yzdyd2txMYvIg5bOICHZrk1xvlcR0U00GyNPL9qT"
    );

    let response: any = await fetch("http://localhost:4000/paytest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ msg: "successify" }),
    });
    
    let session = await response.json();
    console.log(session.id);
    let result = stripe.redirectToCheckout({
      sessionId: session.id,
    });
    alert();
  };

  return (
    <>
      <div>PAy testing</div>
      <Button varient="contined" onClick={handleCheckout}>
        Checkout
      </Button>
    </>
  );
};

export default PayTest;
