import React from "react";
import { useNavigate } from "react-router-dom";

const ItemFriend = ({ item }) => {
  const navigate = useNavigate();

  return (
    <div className="col-span-12">
      <div className="content w-full bg-white gap-4 px-4 py-2 flex items-center shadow-lg rounded-lg">
        <span className="p-2 bg-slate-500 shadow-xl inline-block rounded-full">
          <img
            src={item.user?.image ? item.user?.image : "./delivery-boy.png"}
            className="w-[50px] rounded-full h-[50px]"
            alt=""
          />
        </span>
        <div className="flex flex-col flex-1">
          <span className="text-gray-600 font-bold">{item.user.name}</span>
          <span className="text-gray-400">Bạn bè được gợi ý từ bạn chung</span>
        </div>

        <p
          onClick={() => {
            localStorage.setItem("friend_mission", JSON.stringify(item));
            navigate("/farm/friend");
          }}
          className="m-0 bg-blue-400 py-3 px-6 font-bold text-slate-50 cursor-pointer hover:bg-blue-600 transition-all rounded-full"
        >
          Viến thăm
        </p>
      </div>
    </div>
  );
};

export default ItemFriend;
