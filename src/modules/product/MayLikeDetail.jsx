import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs, Navigation, Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ItemProductNew from "../home/ItemProductNew";
const MayLikeDetail = ({ idPro, idCate }) => {
  const [data, setData] = useState();
  const { user } = useSelector((state) => state.user);

  const FetchData = async () => {
    const formData = new FormData();
    formData.append("idPro", idPro);
    formData.append("cate", idCate);

    try {
      const response = await axios({
        method: "POST",
        url: "https://shoppet.site/api/product/getMayLike",

        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user?.token,
        },
        data: formData,
      });
      if (response) {
        setData(response.data);
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    FetchData();
  }, []);
  return (
    <div className="mt-[100px]">
      <h2 className="text-[40px] text-center">
        <span className="text-orange-400">You may </span>
        also like
      </h2>
      <p className="text-gray-400 text-center">
        Sed quia consequuntur magni dolores eos qui ratione voluptatem
      </p>
      <Swiper
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        grabCursor={"true"}
        spaceBetween={40}
        navigation={true}
        modules={[Navigation, Thumbs]}
        loop={true}
        slidesPerView={4}
        className="sliders grid grid-cols-4 mySwiper w-full mt-5 rounded-lg"
      >
        {data?.length > 0 &&
          data?.map((item, index) => {
            return (
              <SwiperSlide className="sliders" key={item.id}>
                <ItemProductNew
                  shop={true}
                  key={item.id}
                  item={item}
                ></ItemProductNew>
              </SwiperSlide>
            );
          })}
      </Swiper>
    </div>
  );
};

export default MayLikeDetail;
