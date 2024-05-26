import {Button} from "@mui/material";
import { loadStripe } from "@stripe/stripe-js";
const PayTest: React.FC = () => {
  let handleCheckout = async () => {
    console.log('lol 1');
    let stripe: any = await loadStripe(
      "pk_test_51PK2e4AbZoRkoGyHXWL0GQxTRlT6J1SJMiWw37DkKvVfzE8qLv0TKJLdm5yzdyd2txMYvIg5bOICHZrk1xvlcR0U00GyNPL9qT"
    );

    let response: any = await fetch("https://carmadices-beta-11pk.vercel.app/paytest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ msg: "successify" }),
    });

    let session = await response.json();
    console.log('lol 2');
    console.log(session.id);
    stripe.redirectToCheckout({
      sessionId: session.id,
    });
    console.log('lol 3');
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
