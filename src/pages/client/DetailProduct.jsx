import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import Layout from "../../components/layouts/Layout";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs, Navigation, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import * as React from "react";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import { formatter } from "../../trait/FormatMoney";
import { handleAddCart } from "../../redux-thunk/cartSlice";
import TabDetail from "../../modules/product/TabDetail";
import MayLikeDetail from "../../modules/product/MayLikeDetail";

const DetailProduct = () => {
  const { user } = useSelector((state) => state.user);
  const [data, setData] = React.useState();
  const { product } = useParams();
  const [number, setNumber] = React.useState(1);
  const dispatch = useDispatch();
  const [settings, setSettings] = React.useState();
  const [isShowComment, setIsShowComment] = React.useState(false);
  const FetchDetail = async () => {
    const response = await axios({
      method: "GET",
      url: "http://127.0.0.1:8000/api/product/update/" + product,

      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + user?.token,
      },
    });
    if (response) {
      console.log(response.data.data);
      setData(response.data.data);
    }
  };
  const FetchSetting = async () => {
    try {
      const response = await axios({
        method: "get",
        url: "http://127.0.0.1:8000/api/setting/all",
        headers: {
          Authorization: "Bearer " + user?.token,
        },
      });
      console.log(response);
      if (response) {
        setSettings(response.data);
      }
    } catch (e) {
      console.log(e);
    }
  };
  React.useEffect(() => {
    const caculatorComment = async () => {
      const formData = new FormData();
      formData.append("user_id", user.id);
      formData.append("product_id", product);

      const data = await axios({
        method: "POST",
        url: "http://127.0.0.1:8000/api/comment/caculatorComment",

        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user?.token,
        },
        data: formData,
      });
      if (data) {
        if (data.data.check == "yes") {
          setIsShowComment(true);
        }
      }
    };
    caculatorComment();
    FetchDetail();
    FetchSetting();
  }, []);
  const pagination = {
    clickable: true,
    renderBullet: function (index, className) {
      if (data?.images[index]) {
        return (
          '<img class="' +
          className +
          '" src="http://127.0.0.1:8000' +
          data?.images[index]?.image_path +
          '"' +
          'class="w-[80px]" />'
        );
      } else {
        return (
          '<img class="' +
          className +
          '" src="http://127.0.0.1:8000' +
          data?.file_path +
          '"' +
          'class="w-[80px]" />'
        );
      }
    },
  };
  const createNumber = (nb) => {
    setNumber(number + nb);
  };

  console.log(settings);
  return (
    <Layout>
      <div className="p-5">
        <div className="info">
          <div className="info-top">
            <div className="grid grid-cols-12 gap-5">
              <div className="col-span-6 max-w-full">
                <Swiper
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                  }}
                  pagination={pagination}
                  grabCursor={"true"}
                  spaceBetween={40}
                  navigation={true}
                  modules={[Navigation, Thumbs, Pagination]}
                  loop={true}
                  slidesPerView={1}
                  className="sliders mySwiper w-full rounded-lg"
                >
                  {data?.images?.length > 0 &&
                    data.images.map((item, index) => {
                      return (
                        <SwiperSlide
                          className="sliders border border-gray-400"
                          key={item.id}
                        >
                          <div className="item rounded-lg">
                            <img
                              className="w-full h-[80%] object-cover"
                              src={`http://127.0.0.1:8000${item.image_path}`}
                            ></img>
                          </div>
                        </SwiperSlide>
                      );
                    })}
                  <SwiperSlide className="sliders border border-gray-400">
                    <div className="item rounded-lg">
                      <img
                        className="w-full h-[80%] object-cover"
                        src={`http://127.0.0.1:8000${data?.file_path}`}
                      ></img>
                    </div>
                  </SwiperSlide>
                </Swiper>
              </div>
              <div className="col-span-6 flex flex-col gap-2">
                <h2 className="name">{data?.name}</h2>
                <div className="flex gap-2">
                  <Stack spacing={1}>
                    {/* <Rating name="half-rating" defaultValue={2.5} precision={1} /> */}
                    <Rating
                      name="half-rating-read"
                      defaultValue={data?.start}
                      precision={0.1}
                      readOnly
                    />
                  </Stack>
                  ({data?.start})
                </div>

                <p className="price font-bold  text-orange-400 text-2xl">
                  {formatter.format(data?.price)}
                </p>
                <p>
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa
                  qui officia deserunt mollit anim id est laborum. Sed ut
                  perspiciatis unde omnis iste natus error sit voluptatem
                  accusantium doloremque laudantium, totam rem aperiam
                </p>
                <p className="flex items-center">
                  <span className="font-semibold">SKU:</span>
                  <span className="text-gray-400 ml-3">N/A</span>
                  <span className="ml-5 text-green-500 flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                    <span className="font-bold">In stock</span>
                  </span>
                </p>
                <div className="flex items-center gap-3">
                  <div className="in_de border flex rounded-3xl py-3 px-6 justify-between  w-[180px]">
                    <span>
                      {number > 1 && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          // onClick={() => addToCart(item.id, -1)}
                          onClick={() => createNumber(-1)}
                          className="cursor-pointer hover:scale-125 font-bold hover:text-orange-500 w-8 h-8"
                        >
                          <path strokeLinecap="round" d="M5 12h14" />
                        </svg>
                      )}
                      {number <= 1 && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          // onClick={() => addToCart(item.id, -1)}
                          className="cursor-pointer text-gray-200  font-bold  w-8 h-8"
                        >
                          <path strokeLinecap="round" d="M5 12h14" />
                        </svg>
                      )}
                    </span>
                    <span className="text-2xl">{number}</span>
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        // onClick={() => addToCart(data?.id, 1)}
                        onClick={() => createNumber(1)}
                        className="cursor-pointer hover:scale-125 font-bold hover:text-orange-500 w-8 h-8"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 5v14m7-7H5"
                        />
                      </svg>
                    </span>
                  </div>
                  <p
                    // onClick={() => addToCart(item.id)}
                    onClick={() =>
                      dispatch(
                        handleAddCart({ idpro: data?.id, number: number })
                      )
                    }
                    className="mt-3 text-2xl font-semibold px-6 py-3 bg-slate-900 hover:bg-orange-500 transition-all w-[200px] cursor-pointer rounded-3xl text-white text-center"
                  >
                    Add to cart
                  </p>
                </div>
                <p>
                  <span className="font-semibold">Product type:</span>
                  <span className="text-gray-400 ml-3">Dog Apparel</span>
                </p>
                <p>
                  <span className="font-semibold">Categories:</span>
                  <span className="text-gray-400 ml-3">
                    {data?.cate_name.name}
                  </span>
                </p>
                <p>
                  <span className="font-semibold">Tag:</span>
                  <span className="text-gray-400 ml-3">
                    {data?.cate_name.name}
                  </span>
                </p>
                {settings && (
                  <div className="flex gap-3 items-center">
                    <span className="font-semibold">Share:</span>
                    <div className="socials flex items-center gap-2">
                      <Link
                        className="text-gray-400"
                        to={settings && settings[0]?.config_value}
                      >
                        <span className="text-white hover:bg-orange-500 transition-all leading-none h-full w-full block flex items-center justify-center max-h-[32px]  max-w-[32px] rounded-full p-[20px] bg-slate-800">
                          <i className="fa-brands fa-facebook-f leading-none"></i>
                        </span>
                      </Link>
                      <Link
                        className="text-gray-400"
                        to={settings && settings[0]?.config_value}
                      >
                        <span className="text-white hover:bg-orange-500 transition-all leading-none h-full w-full block flex items-center justify-center max-h-[32px]  max-w-[32px] rounded-full p-[20px] bg-slate-800">
                          <i className="fa-brands fa-twitter"></i>
                        </span>
                      </Link>
                      <Link
                        className="text-gray-400"
                        to={settings && settings[2]?.config_value}
                      >
                        <span className="text-white hover:bg-orange-500 transition-all leading-none h-full w-full block flex items-center justify-center max-h-[32px]  max-w-[32px] rounded-full p-[20px] bg-slate-800">
                          <i className="fa-brands fa-linkedin-in"></i>
                        </span>
                      </Link>
                      <Link
                        className="text-gray-400"
                        to={settings && settings[1]?.config_value}
                      >
                        <span className="text-white hover:bg-orange-500 transition-all leading-none h-full w-full block flex items-center justify-center max-h-[32px]  max-w-[32px] rounded-full p-[20px] bg-slate-800">
                          <i className="fa-brands fa-instagram"></i>
                        </span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="info-bot mt-[100px] ">
            <TabDetail
              product={product}
              isShow={isShowComment}
              description={data?.description}
            ></TabDetail>
          </div>

          <MayLikeDetail
            idCate={data?.category_id}
            idPro={data?.id}
          ></MayLikeDetail>
        </div>
      </div>
    </Layout>
  );
};

export default DetailProduct;
