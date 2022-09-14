import axios from "axios";
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Paypal = ({ sum, info, user }) => {
  console.log(sum);
  const navigate = useNavigate();

  const paypal = useRef(null);
  useEffect(() => {
    window.paypal
      .Buttons({
        createOrder: (data, actions, err) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                description: "Cool looking table",
                amount: {
                  current_code: "CAD",
                  value: sum + 2,
                },
              },
            ],
          });
        },
        onApprove: async (data, actions) => {
          const order = await actions.order.capture();
          console.log(order);
          if (!info) return;
          const formData = new FormData();
          formData.append("phone", info.phone);
          formData.append("address", info.address + "," + info.country);
          formData.append("total", sum + 2);
          formData.append("userId", user?.id);
          formData.append("pttt", "paypal");

          const response = await axios({
            method: "post",
            url: "https://shoppet-tm.herokuapp.com/api/bill/add",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + user?.token,
            },
            data: formData,
          });
          if (response) {
            console.log(response);
            navigate("/payment/" + response.data.id_bill);
          }
        },
        onError: (err) => {
          console.log(err);
        },
      })
      .render(paypal.current);
    return () => {};
  }, []);
  return (
    <div className="max-w-[100px] w-[100px] relative z-20" ref={paypal}></div>
  );
};

export default Paypal;
