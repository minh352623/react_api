import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoadingSkeleton from "../../components/LoadingSkeleton";
import { useDispatch, useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs, Navigation, Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
const Slider = () => {
  const { user } = useSelector((state) => state.user);

  const [cates, setCates] = useState();
  const [sliders, setSliders] = useState();

  const [isShow, setIsShow] = useState(true);
  const FetchCate = async () => {
    const response = await axios({
      method: "get",
      url: "http://127.0.0.1:8000/api/category/all",
      headers: {
        Authorization: "Bearer " + user?.token,
      },
    });
    if (response) {
      setCates(response.data);
    }
  };
  const FetchSlider = async () => {
    const response = await axios({
      method: "get",
      url: "http://127.0.0.1:8000/api/slider/all",
      headers: {
        Authorization: "Bearer " + user?.token,
      },
    });
    if (response) {
      console.log(response);
      setSliders(response.data);
    }
  };
  useEffect(() => {
    FetchCate();
    FetchSlider();
  }, []);
  return (
    <div className="grid grid-cols-12 gap-x-3">
      <div className="col-span-2">
        <div
          onClick={() => setIsShow(!isShow)}
          className="py-2 px-3 text-white flex items-center gap-x-3 cursor-pointer  bg-orange-600 rounded-3xl"
        >
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </span>
          <span className="font-bold">Shop my pet</span>
          <span className="flex-1 text-end flex justify-end">
            {isShow ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 15l7-7 7 7"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            )}
          </span>
        </div>
        <div
          className={`overflow-hidden transition-[max-height] duration-500 vertical-menu mt-2 ${
            isShow ? "max-h-[500px]" : "max-h-0"
          }`}
        >
          <ul className={`list-group bg-[#2d2e33] rounded-3xl `}>
            {cates?.length > 0 &&
              cates.map((item) => (
                <li key={item.id}>
                  <Link
                    className="text-white font-bold py-3 px-4 flex gap-x-3 items-center border-b-[.1px] border-gray-50"
                    to={"/category/" + item.id}
                  >
                    <img
                      src={"http://127.0.0.1:8000" + item.icon_image}
                      alt=""
                    />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            {/* <LoadingSkeleton></LoadingSkeleton> */}
          </ul>
        </div>
      </div>
      <div className="col-span-10">
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
          slidesPerView={1}
          className="sliders w-full rounded-lg"
        >
          {sliders?.length > 0 &&
            sliders.map((item) => {
              let img = item.file_path;
              return (
                <SwiperSlide className="sliders w-full " key={item.id}>
                  <div className="item relative rounded-lg">
                    <img
                      className="w-full h-full"
                      src={`http://127.0.0.1:8000${img}`}
                    ></img>
                    <div className="content absolute top-1/2 -translate-y-1/2 left-8 text-white text-center font-bold">
                      <p className="text-xl">{item.caption}</p>
                      <h2>{item.caption}</h2>
                      <p className="text-2xl">{item.description}</p>
                      <span>
                        <Link
                          className="py-3 px-4 hover:bg-orange-400 bg-orange-500 leading-none  text-white rounded-3xl inline-flex items-center justify-center"
                          to="/home"
                        >
                          Shop Now
                        </Link>
                      </span>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
        </Swiper>
      </div>
    </div>
  );
};

export default Slider;
