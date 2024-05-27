import { useEffect } from "react";
import { Link } from "react-router-dom";

const failedCheckout: React.FC = () => {
  useEffect(() => {
    localStorage.removeItem('formData');
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
          Something went wrong
        </div>
        <div
          style={{
            fontSize: "20px",
            fontWeight: "400",
            margin: "20px",
            fontFamily: "cursive",
            color: "red",
          }}
        >
          Payment Failed
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

export default failedCheckout;
