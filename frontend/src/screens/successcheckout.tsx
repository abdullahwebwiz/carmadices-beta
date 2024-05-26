import { useEffect } from "react";
import { Link } from "react-router-dom";

const SuccessCheckout: React.FC = () => {
  useEffect(() => {
    let handleSubmit = async () => {
      let response = await fetch(
        "https://carmadices-beta-11pk.vercel.app/order/guest-order-two",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: localStorage.getItem("formData"),
        }
      );
      let result = await response.json();
      console.log(result);
    };
    handleSubmit();
  }, []);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {" "}
        <div style={{ fontSize: "50px", fontWeight: "900", margin: "20px" }}>
          Thank you for Choosing
        </div>
        <div
          style={{
            fontSize: "20px",
            fontWeight: "400",
            margin: "20px",
            fontFamily: "cursive",
            color: "#008900",
          }}
        >
          Payment successfully recevied
        </div>
        <img
          src="/mycarmedics-logo.svg"
          style={{ width: "200px", margin: "20px" }}
        />
        <Link to={"/"}>Back To Home</Link>
      </div>
    </>
  );
};

export default SuccessCheckout;
