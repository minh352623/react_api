import * as React from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { handleAddCart, handleDeleteCart } from "../../redux-thunk/cartSlice";
import { formatter } from "../../trait/FormatMoney";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
const ItemCart = ({ item }) => {
  const dispatch = useDispatch();
  return (
    <TableRow
      key={item.id}
      className="cart-item flex  items-center gap-3 my-3 justify-between py-3 border-none border-0"
    >
      <TableCell
        align="right"
        className="image px-0 py-3 w-[200px] h-[200px]   "
      >
        <img
          className="w-full h-full object-cover border rounded-lg"
          src={`${item.file_path}`}
          alt=""
        />
      </TableCell>
      <TableCell align="left" className="info">
        <p className="name m-0 font-semibold text-lg">{item.name}</p>
        <p className="price my-2 font-bold text-orange-500 text-xl">
          {formatter.format(item.price)}
        </p>
      </TableCell>
      <TableCell>
        <div className="in_de text-xl border gap-3 inline-flex rounded-3xl px-6 py-3 justify-between w-full">
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              // onClick={() => addToCart(item.id, -1)}
              onClick={() =>
                dispatch(handleAddCart({ idpro: item.id, number: -1 }))
              }
              className="cursor-pointer hover:scale-125 font-bold hover:text-orange-500 w-8 h-8"
            >
              <path strokeLinecap="round" d="M5 12h14" />
            </svg>
          </span>
          <span className="text-2xl">{item.number}</span>
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              // onClick={() => addToCart(item.id, 1)}
              onClick={() =>
                dispatch(handleAddCart({ idpro: item.id, number: 1 }))
              }
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
      </TableCell>
      <TableCell align="right">
        <span className="my-2 font-bold text-orange-500 text-xl">
          {formatter.format(item.price * item.number)}
        </span>
      </TableCell>
      <TableCell align="center" className="text-end flex mx-auto justify-end">
        <p className="text-end flex justify-end">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            onClick={() => dispatch(handleDeleteCart({ idpro: item.id }))}
            className="cursor-pointer w-8 h-8 text-end hover:text-orange-500 hover:scale-110"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
        </p>
      </TableCell>
    </TableRow>
  );
};

export default ItemCart;
