import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Vnpay = ({ user, info, sum }) => {
  const navigate = useNavigate();

  const handleVnpay = async () => {
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
        const formData = new FormData();
        formData.append("phone", info.phone);
        formData.append("address", info.address + "," + info.country);
        formData.append("total", sum + 2);
        formData.append("userId", user?.id);
        formData.append("pttt", "vnpay");
        const formData2 = new FormData();
        formData2.append("redirect", "redirect");
        formData2.append("sum", sum + 2);

        const result = await axios({
          method: "post",
          url: "http://127.0.0.1:8000/api/bill/add",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + user?.token,
          },
          data: formData,
        });
        const response = await axios({
          method: "post",
          url: "http://127.0.0.1:8000/api/bill/vnPay",
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
    <div className="w-[200px] h-[100px] ">
      <img
        onClick={() => handleVnpay()}
        className="w-full object-cover cursor-pointer h-full shadow-xl rounded-xl"
        src="./vnpay.jpg"
        alt=""
      />
    </div>
  );
};

export default Vnpay;
