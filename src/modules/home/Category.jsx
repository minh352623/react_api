import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import LoadingSkeleton from "../../components/LoadingSkeleton";

const Category = () => {
  const { user } = useSelector((state) => state.user);

  const [categorys, setCategorys] = useState();
  const FetchCate = async () => {
    try {
      const response = await axios({
        method: "GET",
        url: "https://shoppet-tm.herokuapp.com/api/category/all",

        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user?.token,
        },
      });
      if (response) {
        setCategorys(response.data);
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    FetchCate();
  }, []);

  if (!categorys)
    return (
      <div className="grid grid-cols-4 gap-2 mt-3">
        {Array(5)
          .fill()
          .map((item, index) => {
            let order = "order-" + index;
            if (index == 1) {
              order = "order-0";
              return (
                <div
                  key={index}
                  className={`w-full ${order} row-span-2 col-span-2 relative`}
                >
                  <LoadingSkeleton className="w-[full] h-[610px]"></LoadingSkeleton>
                </div>
              );
            } else {
              return (
                <div key={index} className={`w-full ${order} relative`}>
                  <LoadingSkeleton className="w-[full] h-[300px]"></LoadingSkeleton>
                </div>
              );
            }
          })}
      </div>
    );
  return (
    <div className="grid grid-cols-4 gap-2">
      {categorys &&
        categorys.map((item, index) => {
          let order = "order-" + index;
          if (item.name == "Best Seller") {
            order = "order-0";
            return (
              <div
                data-aos="zoom-in-up"
                data-aos-duration="1000"
                data-aos-delay="300"
                key={item.id}
                className={`w-full ${order} row-span-2 col-span-2 relative`}
              >
                <img
                  className="w-full h-full object-cover rounded-lg"
                  src={`${item.image}`}
                  alt=""
                />
                <a className="text-orange-500 transition-all absolute top-2/4 left-2/4 -translate-x-2/4 rounded-3xl cursor-pointer leading-none text-2xl -translate-y-2/4 hover:text-white shadow-sm px-16 py-4 font-bold bg-orange-50 hover:bg-orange-500">
                  {item.name}
                </a>
              </div>
            );
          } else {
            return (
              <div
                data-aos="zoom-in-up"
                data-aos-duration="1000"
                data-aos-delay="300"
                key={item.id}
                className={`w-full ${order} relative`}
              >
                <img
                  className="w-full h-full object-cover rounded-lg"
                  src={`${item.image}`}
                  alt=""
                />
                <a className="text-orange-500 transition-all absolute top-3/4 left-2/4 -translate-x-2/4 rounded-3xl cursor-pointer leading-none text-2xl -translate-y-2/4 hover:text-white shadow-sm px-8 py-2 font-bold bg-orange-50 hover:bg-orange-500">
                  {item.name}
                </a>
              </div>
            );
          }
        })}
    </div>
  );
};

export default Category;
