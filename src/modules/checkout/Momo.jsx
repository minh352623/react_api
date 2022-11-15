import axios from "axios";
import React from "react";
import Swal from "sweetalert2";

const Momo = ({ info, user, fee, sumf }) => {
  const handleMomo = async () => {
    let sum = JSON.parse(localStorage.getItem("sum"));
    sum = parseFloat(sum).toFixed(2);
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
        formData.append("total", sum);
        formData.append("userId", user?.id);
        formData.append("pttt", "momo");
        formData.append("fee", fee);

        const formData2 = new FormData();
        formData2.append("redirect", "redirect");
        formData2.append("sum", sum.toString());

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

        const result = await axios({
          method: "post",
          url: "https://shoppet.site/api/bill/add",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + user?.token,
          },
          data: formData,
        });
        localStorage.removeItem("sum");

        const infoVoucher = localStorage.removeItem("infoVoucher");

        const response = await axios({
          method: "post",
          url: "https://shoppet.site/api/momo",
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
    <div className="mt-2 w-full">
      <img
        onClick={handleMomo}
        className="w-full hover:scale-105 rounded-lg transition-all cursor-pointer  h-[150px] object-cover"
        src="./momo2.jpg"
        alt=""
      />
    </div>
  );
};

export default Momo;
