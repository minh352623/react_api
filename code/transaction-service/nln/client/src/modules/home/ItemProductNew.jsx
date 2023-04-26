import * as React from "react";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import { formatter } from "../../trait/FormatMoney";
import { useDispatch } from "react-redux";
import { handleAddCart } from "../../redux-thunk/cartSlice";
import { Link } from "react-router-dom";

const ItemProductNew = ({ item, shop = false }) => {
  const dispatch = useDispatch();
  return (
    <div className="rounded-2xl">
      <Link
        to={"/product/" + item.id}
        className={`image block relative z-20 overflow-hidden group ${
          shop ? "border border-gray-400 rounded-2xl" : ""
        }`}
      >
        <img
          className="rounded-2xl shape-2xl cursor-pointer"
          src={`${item.file_path}`}
          alt=""
        />
        {item?.images && (
          <img
            className="rounded-2xl shape-2xl group-hover:right-0   group-hover:opacity-100  z-10 cursor-pointer transition-all duration-300 absolute top-0 right-full"
            src={`${item?.images[0]?.image_path}`}
            alt=""
          />
        )}
        <div className="absolute transition-all  z-20 group-hover:right-0  top-[24px] right-[-55px] leading-none mr-3">
          <span className="cursor-pointer leading-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 text-slate-900 hover:bg-orange-500 hover:text-white transition-all w-10 p-2 border border-gray rounded-full"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
        </div>
      </Link>
      <div className="content mt-3 px-2">
        {/* <div className="start flex items-center gap-1">
          {Array(5)
            .fill()
            .map((index) => (
              <span key={Math.random(100)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="gray"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                  />
                </svg>
              </span>
            ))}
        </div> */}
        <Stack spacing={1}>
          {/* <Rating name="half-rating" defaultValue={2.5} precision={1} /> */}
          <Rating
            name="half-rating-read"
            defaultValue={+item.start}
            precision={0.5}
            readOnly
          />
        </Stack>
        <Link
          to={"/product/" + item.id}
          className="text-slate-900 hover:text-orange-400 transition-all name font-bold my-2"
        >
          {item.name}
        </Link>
        <p className="text-2xl font-semibold text-orange-500">
          {formatter.format(item.price)}
        </p>
        <p
          // onClick={() => addToCart(item.id)}
          onClick={() => dispatch(handleAddCart({ idpro: item.id, number: 1 }))}
          data-id={item.id}
          className="mt-3 font-semibold px-6 py-2 bg-slate-900 hover:bg-orange-500 transition-all w-[150px] cursor-pointer rounded-3xl text-white text-center"
        >
          Add to cart
        </p>
      </div>
    </div>
  );
};

export default ItemProductNew;
