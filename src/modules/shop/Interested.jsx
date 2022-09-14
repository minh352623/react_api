import { SignalCellularNull } from "@mui/icons-material";
import axios from "axios";
// import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as React from "react";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import LoadingSkeleton from "../../components/LoadingSkeleton";
import ItemInterestd from "./ItemInterestd";
const Interested = () => {
  const { user } = useSelector((state) => state.user);

  const [data, setData] = React.useState(null);
  const FetchInterested = async () => {
    try {
      const response = await axios({
        method: "GET",
        url: "https://shoppet-tm.herokuapp.com/api/product/top10",

        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user?.token,
        },
      });
      if (response) {
        console.log(response.data);
        setData(response.data);
      }
    } catch (e) {
      console.log(e);
    }
  };
  React.useEffect(() => {
    FetchInterested();
  }, []);
  if (!data)
    return (
      <>
        <h4 className="border-b mt-5 pb-3 border-gray-300">Most interested</h4>
        <div className="list-interested flex-col gap-3">
          {Array(5)
            .fill()
            .map((item, index) => (
              <div
                key={index}
                className="item flex gap-3 py-3 border-b border-dashed border-gray-400"
              >
                <LoadingSkeleton className="image w-[100px] rounded-2xl p-1 border border-gray-400"></LoadingSkeleton>
                <div className="info py-1 flex-col gap-5 ">
                  <LoadingSkeleton className="w-[100px] h-[15px]"></LoadingSkeleton>

                  <LoadingSkeleton className="w-[100px] h-[15px]"></LoadingSkeleton>
                  <LoadingSkeleton className="w-[50px] h-[15px]"></LoadingSkeleton>
                </div>
              </div>
            ))}
        </div>
      </>
    );
  return (
    <>
      <h4 className="border-b mt-5 pb-3 border-gray-300">Most interested</h4>
      <div className="list-interested flex-col gap-3">
        {data.length > 0 &&
          data.map((item) => (
            <ItemInterestd key={item.id} item={item}></ItemInterestd>
          ))}
      </div>
    </>
  );
};

export default Interested;
