import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import LoadingSkeleton from "../../components/LoadingSkeleton";
const Discount = () => {
  const { user } = useSelector((state) => state.user);

  const [discounts, setDiscounts] = useState();
  const FetchCate = async () => {
    try {
      const response = await axios({
        method: "GET",
        url: "http://127.0.0.1:8000/api/discount/all",

        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user?.token,
        },
      });
      if (response) {
        console.log(response);
        setDiscounts(response.data);
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    FetchCate();
  }, []);
  if (!discounts)
    return (
      <div className="grid grid-cols-2 my-3 gap-4">
        {Array(2)
          .fill()
          .map((item, index) => (
            <div className="rounded-2xl shadow-2xl " key={index}>
              <div className="content relative">
                <LoadingSkeleton className="w-full h-[300px]"></LoadingSkeleton>
                <div className="absolute font-bold top-1/2 -translate-y-1/2 left-[50px] ">
                  <LoadingSkeleton className="w-full h-[10px]"></LoadingSkeleton>

                  <h2 className="m-0 w-[200px]">
                    <LoadingSkeleton className="w-full h-[10px]"></LoadingSkeleton>
                  </h2>
                  <div className="mt-3 font-semibold px-6 py-2 shadow-2xl transition-all w-[150px] cursor-pointer rounded-3xl text-white text-center">
                    <LoadingSkeleton className="w-full h-[10px]"></LoadingSkeleton>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    );
  return (
    <div className="grid grid-cols-2 my-3 gap-4">
      {discounts &&
        discounts.map((item, index) => (
          <div className="rounded-2xl shadow-2xl " key={item.id}>
            <div className="content relative">
              <img
                className="rounded-2xl w-full hover:scale-105 transition-all cursor-pointer"
                src={`http://127.0.0.1:8000${item.image}`}
                alt=""
              />
              <div
                className={`absolute font-bold top-1/2 -translate-y-1/2 left-[50px]  ${
                  index === 1 ? "text-black" : "text-white"
                }`}
              >
                <p>{item.caption}</p>
                <h2 className="m-0 w-[200px]">{item.title}</h2>
                <p className="mt-3 font-semibold px-6 py-2 hover:bg-slate-900 bg-orange-500 transition-all w-[150px] cursor-pointer rounded-3xl text-white text-center">
                  Shop now
                </p>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Discount;
