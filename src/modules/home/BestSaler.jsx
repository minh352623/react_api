import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import LoadingSkeleton from "../../components/LoadingSkeleton";
import ItemProductNew from "./ItemProductNew";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs, Navigation, Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
const BestSaler = () => {
  const { user } = useSelector((state) => state.user);
  const [data, setData] = useState();
  const FetchTopPro = async () => {
    try {
      const response = await axios({
        method: "GET",
        url: "http://127.0.0.1:8000/api/product/bestSaler",

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
        <h2 className="text-center">Best Saler</h2>
        <div className="grid grid-cols-4 gap-5 mt-5">
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
    <div className="my-5">
      <h2 className="text-center">Best Seller</h2>
      <Swiper
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        grabCursor={"true"}
        spaceBetween={40}
        navigation={true}
        modules={[Navigation, Thumbs, Autoplay]}
        loop={true}
        pagination={{
          clickable: true,
        }}
        slidesPerView={4}
        className="grid grid-cols-4 gap-5 mt-5"
      >
        {data.length > 0 &&
          data?.map((item) => (
            <SwiperSlide key={item.id}>
              <ItemProductNew item={item}></ItemProductNew>
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
};

export default BestSaler;
