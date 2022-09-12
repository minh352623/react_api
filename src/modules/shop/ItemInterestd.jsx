import * as React from "react";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import { formatter } from "../../trait/FormatMoney";
import { Link } from "react-router-dom";

const ItemInterestd = ({ item }) => {
  return (
    <div
      key={item.id}
      className="item flex gap-3 py-3 border-b border-dashed border-gray-400"
    >
      <Link
        to={"/product/" + item.id}
        className="image w-[100px] rounded-2xl p-1 border border-gray-400"
      >
        <img
          className="w-full h-full object-cover"
          src={"http://127.0.0.1:8000" + item.file_path}
          alt=""
        />
      </Link>
      <div className="info py-1 flex-col gap-5 ">
        <Stack spacing={1}>
          {/* <Rating name="half-rating" defaultValue={2.5} precision={1} /> */}
          <Rating
            name="half-rating-read"
            defaultValue={item.start}
            precision={0.5}
            readOnly
          />
        </Stack>

        <Link
          to={"/product/" + item.id}
          className="name my-2 font-semibold text-black"
        >
          {item.name}
        </Link>
        <p className="price font-bold  text-orange-400">
          {formatter.format(item.price)}
        </p>
      </div>
    </div>
  );
};

export default ItemInterestd;
