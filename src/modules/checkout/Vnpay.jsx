import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Vnpay = ({ user, info, fee, sumf }) => {
  const navigate = useNavigate();
  const handleVnpay = async () => {
    let sum = JSON.parse(localStorage.getItem("sum"));
    sum = parseFloat(sum).toFixed(2);
    console.log("asdasdasdasdasdas");

    Swal.fire({
      title: "Bạn chắc chắn chứ?",
      text: "Chúng tôi sẽ khởi tạo đơn hàng ngay bây giờ!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (!info) return;
        localStorage.removeItem("sum");

        const formData = new FormData();
        formData.append("phone", info.phone);
        formData.append("address", info.address + "," + info.country);
        formData.append("total", sum);
        formData.append("userId", user?.id);
        formData.append("pttt", "vnpay");
        formData.append("fee", fee);

        const formData2 = new FormData();
        formData2.append("redirect", "redirect");
        formData2.append("sum", sum);
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

          const formData3 = new FormData();
          formData3.append("user_id", user?.id);
          formData3.append("coupon_id", voucher.id);
          try {
            const response = await axios({
              method: "post",
              url: "https://shoppet.site/api/coupon/delete_user_coupon",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + user?.token,
              },
              data: formData3,
            });
          } catch (e) {
            console.log(e);
          }
        }
        const infoVoucher = localStorage.removeItem("infoVoucher");

        const result = await axios({
          method: "post",
          url: "https://shoppet.site/api/bill/add",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + user?.token,
          },
          data: formData,
        });
        const response = await axios({
          method: "post",
          url: "https://shoppet.site/api/bill/vnPay",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + user?.token,
          },
          data: formData2,
        });
        if (response) {
          console.log(response);
          window.open(response.data, "_self");
        }
      }
    });
  };
  return (
    <div className="w-full h-[150px] ">
      <img
        onClick={() => handleVnpay()}
        className="w-full hover:scale-110 transition-all object-cover cursor-pointer h-full shadow-xl rounded-xl"
        src="./vnpay.jpg"
        alt=""
      />
    </div>
  );
};

export default Vnpay;
