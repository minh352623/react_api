import React, { useState } from "react";
import { useSelector } from "react-redux";

const ItemDm = ({ item, index }) => {
  const { user } = useSelector((state) => state.user);
  console.log(index - 7);
  console.log(user?.attendance);

  if (index - 7 < +user?.attendance) {
    return (
      <div className="flex p-1 w-full   rounded-lg flex-col justify-center items-center">
        <div className="relative w-full p-1 before:block before:content-['Đã-Nhận'] before:text-center  before:text-green-500 before:absolute before:-top-[22px]  before:leading-0 before:p-1  before:bottom-0 before:left-0 before:right-0">
          <label
            for={`coin_${item.config_key}`}
            className="p-3 opacity-50 rounded-xl  flex flex-col items-center justify-center bg-gray-200 cursor-pointer"
          >
            <p className="font-semibold">+{item.config_value}</p>
            <p className="m-0">
              <img src="coin2.gif" className="w-[30px] " alt="" />
            </p>
          </label>
        </div>

        <input
          id={`coin_${item.config_key}`}
          className="invisible"
          type="radio"
          name="abc"
          value={item.config_value}
        />
        <p className="m-0">{item.config_key}</p>
      </div>
    );
  } else if (index - 7 == user?.attendance) {
    return (
      <div className="flex  w-full flex-col justify-center items-center">
        <div className="border  w-full border-4 border-[#000] p-1 rounded-lg">
          <label
            for={`coin_${item.config_key}`}
            className="p-3 rounded-xl  flex flex-col items-center justify-center bg-gray-200 cursor-pointer"
          >
            <p className="font-semibold">+{item.config_value}</p>
            <p className="m-0">
              <img src="coin2.gif" className="w-[30px] " alt="" />
            </p>
          </label>
        </div>
        <input
          id={`coin_${item.config_key}`}
          className="invisible"
          type="radio"
          name="coin"
          checked
          value={item.config_value}
        />

        <p className="m-0">{item.config_key}</p>
      </div>
    );
  } else {
    return (
      <div className="flex  w-full flex-col justify-center items-center">
        <div className="p-1 w-full">
          <label
            for={`coin_${item.config_key}`}
            className="p-3 rounded-xl  flex flex-col items-center justify-center bg-gray-200 cursor-pointer"
          >
            <p className="font-semibold">+{item.config_value}</p>
            <p className="m-0">
              <img src="coin2.gif" className="w-[30px] " alt="" />
            </p>
          </label>
        </div>

        <input
          id={`coin_${item.config_key}`}
          className="invisible"
          type="radio"
          name="sdsd"
          value={item.config_value}
        />
        <p className="m-0">{item.config_key}</p>
      </div>
    );
  }
};

export default ItemDm;
