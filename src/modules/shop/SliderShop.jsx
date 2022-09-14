import { Link } from "react-router-dom";
import axios from "axios";
import React, { useEffect, useState } from "react";
import LoadingSkeleton from "../../components/LoadingSkeleton";
import { useDispatch, useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs, Navigation, Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
const SliderShop = ({ data }) => {
  return (
    <div className="block">
      <div className="banner max-w-full relative flex-col items-center text-center my-auto justify-center bg-[url('/bannerPro.jpg')] bg-center bg-cover h-[70vh] bg-no-repeat">
        <div className="h-full flex items-center justify-center flex-col">
          <div className="content max-w-full mx-[50px] flex-col items-center text-center justify-center">
            <h2 className="text-[40px] text-white">Products</h2>
            <div className="breadbrum mx-automy-auto inline-flex items-center text-center text-white gap-2">
              <Link to="/home" className="leading-none">
                <span className="text-white leading-none">Home</span>
              </Link>
              <span className="mt-[3px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-4 h-6 leading-none"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </span>
              <span>Product</span>
            </div>
          </div>
          <div className="w-[650px] mx-auto mt-5">
            <Swiper
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              grabCursor={"true"}
              spaceBetween={60}
              navigation={true}
              modules={[Navigation, Thumbs, Autoplay]}
              loop={true}
              pagination={{
                clickable: true,
              }}
              slidesPerView={4}
              className="w-full grid-cols-3 gap-5 rounded-lg"
            >
              {data?.length > 0 &&
                data.map((item) => {
                  let img = item.image;
                  return (
                    <SwiperSlide className="sliders w-[150px] " key={item.id}>
                      <div className="item w-[120px] h-[120px] cursor-pointer transition-all p-1 hover:border-white rounded-full hover:border">
                        <img
                          className="w-full h-full rounded-full"
                          src={`${img}`}
                        ></img>
                      </div>
                      <p className="text-xl mt-1 font-semibold text-white">
                        {item.name}
                      </p>
                    </SwiperSlide>
                  );
                })}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SliderShop;
