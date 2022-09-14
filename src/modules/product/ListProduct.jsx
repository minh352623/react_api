import React, { useEffect, useState } from "react";
import LoadingSkeleton from "../../components/LoadingSkeleton";
import ItemProductNew from "../home/ItemProductNew";
const ListProduct = ({ data, loading = false }) => {
  console.log(data);
  if (!data || loading)
    return (
      <div className="my-5">
        <h2 className="text-center">New Arrivals</h2>
        <div className="grid grid-cols-3 gap-5 mt-5">
          {Array(4)
            .fill()
            .map((item, index) => (
              <div key={index}>
                <LoadingSkeleton className="w-full h-[300px] rounded-3xl"></LoadingSkeleton>
                <div className="px-2 mt-3">
                  <LoadingSkeleton className="w-[50px] h-[10px] my-2"></LoadingSkeleton>
                  <LoadingSkeleton className="w-[150px] h-[10px]"></LoadingSkeleton>
                  <LoadingSkeleton className="w-[50px] h-[10px] my-2"></LoadingSkeleton>
                  <LoadingSkeleton className="my-2 h-[30px] w-[150px] cursor-pointer rounded-3xl text-white text-center"></LoadingSkeleton>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  return (
    <div className="">
      <div className="grid grid-cols-3 gap-5">
        {data &&
          !loading &&
          data?.map((item) => (
            <ItemProductNew
              shop={true}
              key={item.id}
              item={item}
            ></ItemProductNew>
          ))}
      </div>
    </div>
  );
};

export default ListProduct;
