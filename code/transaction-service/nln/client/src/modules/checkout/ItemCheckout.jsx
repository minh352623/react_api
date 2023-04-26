import React from "react";
import { formatter } from "../../trait/FormatMoney";

const ItemCheckout = ({ item }) => {
  return (
    <div className="flex items-center justify-between ">
      <div className="flex gap-3 items-center">
        <div className="image w-fit relative ">
          <img
            src={`${item.file_path || item.image}`}
            className="w-[80px] border rounded-2xl"
            alt=""
          />
          <span className="absolute top-[-8px] p-1 bg-gray-500 rounded-full leading-none  text-white right-[-8px] min-w-[20px] min-h-[20px] max-w-[20px] max-h-[20px] flex justify-center items-center">
            {item.number}
          </span>
        </div>
        <p className="font-semibold">{item.name || item.name_pro}</p>
      </div>
      <p className="flex-end font-semibold">{formatter.format(item.total)}</p>
    </div>
  );
};

export default ItemCheckout;
