import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import { formatter } from "../trait/FormatMoney";
const TopThreeLess = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState();
  useEffect(() => {
    const fetchTopThree = async () => {
      try {
        const response = await axios({
          method: "GET",
          url: "https://shoppet.site/api/product/productLessInterested",
        });
        if (response.status === 200) {
          console.log(response);
          setProducts(response.data.products);
        }
      } catch (e) {
        console.log(e);
        if (e.response.status(401)) {
          navigate("/login");
        }
      }
    };
    fetchTopThree();
  }, []);
  return (
    <div>
      <h3 className="text-center text-yellow-500 ">
        Top 3 sản phẩm ít lượt mua nhất
      </h3>
      {products?.length <= 0 && (
        <p className="text-center text-red-500">Chưa có sản phẩm nào</p>
      )}
      {products?.length >= 0 &&
        products?.map((product, index) => (
          <div className="border-b p-2 rounded-lg flex gap-3 justify-between items-center">
            <div className="flex gap-3 items-center">
              <span className="w-[150px] border">
                <img
                  className="w-full object-cover"
                  src={product?.info_product?.file_path}
                  alt=""
                />
              </span>
              <div className="flex flex-col gap-2">
                <span className="font-bold">{product.info_product.name}</span>
                <span className="price font-bold  text-orange-400">
                  {formatter.format(product.info_product?.price)}
                </span>
                <p>
                  <span>Só lượng còn lại: </span>
                  <span className="text-green-500 font-bold">
                    {product.info_product?.number}
                  </span>
                </p>
                <Stack spacing={1}>
                  {/* <Rating name="half-rating" defaultValue={2.5} precision={1} /> */}
                  <Rating
                    name="half-rating-read"
                    defaultValue={+product.info_product.start}
                    precision={0.5}
                    readOnly
                  />
                </Stack>
              </div>
            </div>
            <p
              className={`m-0 flex-col gap-2 p-3 rounded-full  font-bold border-2 ${
                index == 0
                  ? "text-blue-500 bg-blue-200"
                  : index == 1
                  ? "text-green-500 bg-green-200"
                  : "text-red-500 bg-red-200"
              } text-2xl leading-none w-[140px] h-[140px] flex items-center justify-center  border-blue-500`}
            >
              <span>{product.total}</span>
              <span>Đã bán</span>
            </p>
          </div>
        ))}
    </div>
  );
};

export default TopThreeLess;
