import moment from "moment-timezone";

import React, { useState } from "react";
import Loading from "./Loading";

const ItemCoupon = ({ item, createUserCoupon }) => {
  return (
    <>
      {item.number > 0 && (
        <div className="col-span-6 rounded-lg shadow-lg flex cursor-pointer">
          <div className="w-[170px] p-3 flex justify-center items-center font-semibold rounded-l-md text-slate-50 bg-green-500">
            {item.name}
          </div>
          <div className="p-3 flex-1 text-gray-500 ">
            <p className="m-0 font-semibold">Tất cả hình thức thanh toán</p>
            <p className="m-0 font-semibold">Đơn tối thiểu 0$</p>

            <p className="m-0">Số lượng còn lại: {item.number}</p>
            {/* <span>
              <span> HSD </span>
              {moment(item.expires)
                .tz("Asia/Bangkok")
                .format("DD/MM/YYYY h:mm:ss A")}
            </span> */}
          </div>
          <p
            onClick={() => createUserCoupon(item.id, item.coin_dre)}
            className=" font-bold self-center mb-0 hover:scale-110 transition-all   mr-3 inline-flex flex-col items-center justify-center text-end p-3 rounded-lg bg-orange-400 text-slate-50"
          >
            <span>Lấy mã</span>
            <span>{item.coin_dre ? item.coin_dre + " coin" : "free"}</span>
          </p>
        </div>
      )}
      {item.number <= 0 && (
        <div className="opacity-50 col-span-6 rounded-lg shadow-lg flex cursor-pointer">
          <div className="w-[170px] p-3 flex justify-center items-center font-semibold rounded-l-md text-slate-50 bg-green-500">
            {item.name}
          </div>
          <div className="p-3 flex-1 text-gray-500 ">
            <p className="m-0 font-semibold">Tất cả hình thức thanh toán</p>
            <p className="m-0 font-semibold">Đơn tối thiểu 0$</p>

            <p className="m-0">Số lượng còn lại: {item.number}</p>
            {/* <span>
              <span> HSD </span>
              {moment(item.expires)
                .tz("Asia/Bangkok")
                .format("DD/MM/YYYY h:mm:ss A")}
            </span> */}
          </div>
          <p className=" font-bold self-center mb-0  transition-all   mr-3 inline-flex items-center justify-center text-end p-3 rounded-lg bg-orange-400 text-slate-50">
            Đã hết mã
          </p>
        </div>
      )}
    </>
  );
};

export default ItemCoupon;
