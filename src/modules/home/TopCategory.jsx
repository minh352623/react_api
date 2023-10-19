import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import LoadingSkeleton from "../../components/LoadingSkeleton";

const TopCategory = () => {
  const { user } = useSelector((state) => state.user);
  const [data, setData] = useState();
  const FetchTopPro = async () => {
    try {
      const response = await axios({
        method: "GET",
        url: "https://shoppet.fun/api/product/top10",

        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user?.token,
        },
      });
      if (response) {
        console.log(response);
        setData(response.data);
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    FetchTopPro();
  }, []);

  if (!data)
    return (
      <div className="my-5">
        <h2 className="text-center">Top Categories</h2>
        <div className="grid grid-cols-5 gap-5 mt-5">
          {Array(5)
            .fill()
            .map((item, index) => (
              <div
                key={index}
                className="p-3 cursor-pointer hover:scale-110 transition-all rounded-2xl shadow-lg bg-white"
              >
                <LoadingSkeleton className="w-full h-[200px]"></LoadingSkeleton>
              </div>
            ))}
        </div>
      </div>
    );
  return (
    <div className="my-5">
      <h2 className="text-center">Top Categories</h2>
      <div className="grid grid-cols-5 gap-5 mt-5">
        {data &&
          data.map((item) => (
            <div
              data-aos="flip-down"
              data-aos-duration="1000"
              data-aos-delay="200"
              key={item.id}
              className="p-3 cursor-pointer hover:scale-110 transition-all rounded-2xl shadow-lg bg-white"
            >
              <img src={`${item.file_path}`} alt="" />
            </div>
          ))}
      </div>
    </div>
  );
};

export default TopCategory;
