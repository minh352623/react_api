import React, { useState } from "react";
import { useSelector } from "react-redux";

const ItemDmRain = ({ item, index }) => {
  const { user } = useSelector((state) => state.user);
  console.log(index - 7);
  console.log(user?.attendance_rain);

  if (index - 14 < +user?.attendance_rain) {
    return (
      <div className="flex p-1 w-full   rounded-lg flex-col justify-center items-center">
        <div className="relative w-full p-1 before:block before:content-['Đã-Nhận'] before:text-center  before:text-green-500 before:absolute before:top-1/2 before:z-[100] before:font-bold before:font-italic before:-translate-y-1/2  before:leading-0 before:p-1  before:bottom-0 before:left-0 before:right-0">
          <label
            for={`coin_${item.config_key}`}
            className="p-3 opacity-50 rounded relativeed-xl  flex flex-col items-center justify-center bg-gray-200 cursor-pointer"
          >
            <span className="mb-2 font-semibold text-orange-600">
              Ngày {index - 13}
            </span>
            <p className="font-semibold absolute top-[60%] left-1/2 -translate-x-1/2">
              +{item.config_value}
            </p>
            <p className="m-0">
              <img src="drop.png" className="w-[60px] " alt="" />
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
      </div>
    );
  } else if (index - 14 == +user?.attendance_rain) {
    return (
      <div className="flex  w-full flex-col justify-center items-center">
        <div className="border  w-full border-4 border-[#000] p-1 rounded-lg">
          <label
            for={`coin_${item.config_key}`}
            className="px-3 py-1 rounded-xl  flex relative flex-col items-center justify-center bg-gray-200 cursor-pointer"
          >
            <span className="mb-2 font-semibold text-orange-600">
              Ngày {index - 13}
            </span>
            <p className="font-semibold  absolute top-[60%] left-1/2 -translate-x-1/2">
              +{item.config_value}
            </p>
            <p className="m-0">
              <img src="drop.png" className="w-[60px] " alt="" />
            </p>
          </label>
        </div>
        <input
          id={`coin_${item.config_key}`}
          className="invisible"
          type="radio"
          name="rain"
          defaultChecked
          value={item.config_value}
        />
      </div>
    );
  }
  return (
    <div className="flex  w-full flex-col justify-center items-center">
      <div className="p-1 w-full">
        <label
          htmlFor={`coin_${item.config_key}`}
          className="p-3 rounded-xl  flex relative flex-col items-center justify-center bg-gray-200 cursor-pointer"
        >
          <span className="mb-2 font-semibold text-orange-600">
            Ngày {index - 13}
          </span>
          <p className="font-semibold absolute top-[60%] left-1/2 -translate-x-1/2">
            +{item.config_value}
          </p>
          <p className="m-0">
            <img src="drop.png" className="w-[60px] " alt="" />
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
    </div>
  );
};

export default ItemDmRain;
