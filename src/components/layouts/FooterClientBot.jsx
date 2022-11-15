import axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

const FooterClientBot = () => {
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  return (
    <div className="border-t relative">
      <div className="flex items-center justify-between py-4">
        <span className="text-gray-400">&copy; 2021 Petio Pets Store</span>
        <div className="pay">
          <img src="./payment.png" alt="" />
        </div>
      </div>
      {JSON.parse(localStorage.getItem("nv_luot")) && (
        <div className="absolute bottom-[30px] left-1/3">
          <span className="relative  p-1 block w-[180px] h-[180px] bg-slate-200 rounded-full shadown-xl">
            <span className="top-1/2 left-1/2 absolute -translate-x-1/2 -translate-y-1/2">
              <img
                src="./drop.png"
                className="w-full  rounded-full animation_img_3"
                alt=""
              />
            </span>
            <span
              onClick={async () => {
                let item = JSON.parse(localStorage.getItem("nv_luot"));
                let formData = new FormData();
                formData.append("user_id", user?.id);
                formData.append("mission_id", item.id);
                formData.append("energy_miss", item.energy);
                try {
                  setLoading(true);
                  const response = await axios({
                    method: "post",
                    url: "https://shoppet.site/api/mission/add_user",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: "Bearer " + user?.token,
                    },
                    data: formData,
                  });
                  if (response.status) {
                    setLoading(false);
                    localStorage.removeItem("nv_luot");
                    Swal.fire({
                      position: "center-center",
                      icon: "success",
                      title: "Điểm danh thành công!",
                      showConfirmButton: false,
                      timer: 1000,
                    });
                  }
                } catch (e) {
                  console.log(e);
                }
              }}
              className="absolute px-4 py-2 bg-orange-400 w-3/4 rounded-full bottom-[-20px] text-center text-slate-50 transition-all hover:scale-110 cursor-pointer  left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold"
            >
              {loading ? "Đang xử lý" : "Lấy nước"}
            </span>
          </span>
        </div>
      )}
    </div>
  );
};

export default FooterClientBot;
