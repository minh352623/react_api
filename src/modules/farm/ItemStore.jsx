import axios from "axios";
import React from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

const ItemStore = ({ item, addSeedUser }) => {
  const { user } = useSelector((state) => state.user);

  return (
    <div className="col-span-3">
      <div className="item p-2 bg-slate-50 rounded-lg shadow flex flex-col items-center justify-center">
        <img src={item.img} className="w-[100px]" alt="" />
        <span className="font-bold text-orange-700">{item.name}</span>
        <span className="font-semibold flex gap-1 my-1">
          <span>Tiêu hao : {item.water_cost}</span>
          <img src="./drop.png" className="w-[20px]" alt="" />
        </span>
        <span className="font-semibold flex gap-1">
          <span>Thu hoạch : {item.receive_coin}</span>
          <img src="./coin2.gif" className="w-[20px]" alt="" />
        </span>
        <span
          onClick={() => {
            addSeedUser(item.id, item.water_cost, item.coin_cost);
          }}
          className=" w-full flex justify-center gap-1 text-center mt-2 px-4 py-2 bg-orange-200 rounded-lg text-orange-600 hover:bg-orange-300 transition-all  cursor-pointer"
        >
          <span>Giá {item.coin_cost} xu</span>
          <img src="./coin2.gif" className="w-[20px]" alt="" />
        </span>
      </div>
    </div>
  );
};

export default ItemStore;
