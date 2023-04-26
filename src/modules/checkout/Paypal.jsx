import axios from "axios";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { formatter } from "../../trait/FormatMoney";

const Paypal = ({ info, user, fee, sumf }) => {
  const { changeMoney } = useSelector((state) => state.user);

  // let sumNew = JSON.parse(localStorage.getItem("sum"));
  // console.log(sumNew);
  // sumNew = parseFloat(sumNew).toFixed(2);

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
                  value: parseFloat(
                    JSON.parse(localStorage.getItem("sum"))
                  ).toFixed(2),
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
          formData.append(
            "total",
            parseFloat(JSON.parse(localStorage.getItem("sum"))).toFixed(2)
          );
          formData.append("fee", fee);

          formData.append("userId", user?.id);
          formData.append("pttt", "paypal");

          if (JSON.parse(localStorage.getItem("infoVoucher"))) {
            const voucher = JSON.parse(localStorage.getItem("infoVoucher"));
            if (+voucher.feature == 1) {
              formData.append(
                "voucher",
                parseFloat(sumf * (+voucher.value / 100).toFixed(2))
              );
            } else if (+voucher.feature == 2) {
              formData.append("voucher", parseFloat(voucher.value).toFixed(2));
            }

            const formData2 = new FormData();
            formData2.append("user_id", user?.id);
            formData2.append("coupon_id", voucher.id);
            try {
              const response = await axios({
                method: "post",
                url: "https://shoppet.site/api/coupon/delete_user_coupon",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + user?.token,
                },
                data: formData2,
              });
            } catch (e) {
              console.log(e);
            }
          }
          const infoVoucher = localStorage.removeItem("infoVoucher");

          const response = await axios({
            method: "post",
            url: "https://shoppet.site/api/bill/add",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + user?.token,
            },
            data: formData,
          });
          if (response) {
            localStorage.removeItem("sum");

            console.log(response);
            navigate("/payment/" + response.data.id_bill);
          }
        },
        onError: (err) => {
          console.log("asd");
          console.log(err);
        },
      })
      .render(paypal.current);

    return () => {};
  }, []);
  return <div className="w-full relative z-20" ref={paypal}></div>;
};

export default Paypal;
