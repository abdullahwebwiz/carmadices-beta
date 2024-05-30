import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const SuccessCheckout: React.FC = () => {
  let navigate = useNavigate();
  let userToken = localStorage.getItem("userToken");
  let data = localStorage.getItem("formData");
  let [x, setX] = useState(false);
  useEffect(() => {
    let handleSubmit = async () => {
      if (data) {
        let response = await fetch(
          "https://carmadices-beta-11pk.vercel.app/order" +
            (userToken ? "/" : "/guest-order-two"),
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: userToken ? `Bearer ${userToken}` : ``,
            },
            body: data,
          }
        );
        let result = await response.json();
        console.log(result);
        if (result.msg == "success") {
          localStorage.removeItem("formData");
          alert("Payment Recevied Successfully");
          navigate("/");
        } else {
          alert("Payment Failed");
          navigate("/failedcheckout");
        }
      } else {
        navigate("/");
      }
    };
    handleSubmit();
    setX(true);
  }, []);

  if (x) {
    return null;
  }
};

export default SuccessCheckout;
