import { useSelector } from "react-redux";
import Layout from "../../components/layouts/Layout";
import ItemCart from "../../modules/cart/ItemCart";
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";
import { formatter } from "../../trait/FormatMoney";
const Cart = () => {
  const { isShowCart, carts } = useSelector((state) => state.cart);
  const sumCart = () => {
    let sum = 0;
    if (carts) {
      carts.map((item) => {
        sum += parseFloat(item.total);
      });
    }
    return sum;
  };
  return (
    <Layout>
      {carts?.length > 0 && (
        <>
          <h2 className="px-5 mt-5">Your cart</h2>
          <div className="grid grid-cols-12 gap-5 mb-5 px-5">
            <div className="col-span-8">
              <TableContainer>
                <Table
                  sx={{ minWidth: 650 }}
                  size="small"
                  aria-label="a dense table"
                >
                  <TableHead className="rounded-3xl">
                    <TableRow className="bg-gray-100 py-3 block rounded-3xl">
                      <TableCell>
                        <span className="font-bold uppercase">Product</span>
                      </TableCell>
                      <TableCell align="left">
                        <span className="font-bold uppercase">QUANTITY</span>
                      </TableCell>
                      <TableCell align="left">
                        <span className="font-bold uppercase">QUANTITY</span>
                      </TableCell>
                      <TableCell align="right">
                        <span className="font-bold uppercase">Total</span>
                      </TableCell>
                      <TableCell align="right">
                        <span className="font-bold uppercase">Action</span>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {carts &&
                      carts.map((item) => (
                        <ItemCart item={item} key={item.id}></ItemCart>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
            <div className="col-span-4">
              <div className="p-4 bg-gray-200 rounded-2xl">
                <p className="font-semibold">Order special instructions</p>
                <textarea
                  name=""
                  className="form-control mb-3"
                  rows="5"
                  placeholder="Order special instructions"
                ></textarea>
                <div className="flex justify-between border-t border-gray-400 pt-3">
                  <span className="font-semibold text-black text-2xl">
                    Subtotal:
                  </span>
                  <span className="font-semibold text-orange-500 text-2xl">
                    {formatter.format(sumCart())}
                  </span>
                </div>
                <p className="text-end my-3">
                  Tax included. Shipping calculated at checkout.
                </p>
                <p>
                  <Link
                    to="/checkout"
                    className="text-white bg-slate-900 block rounded-3xl p-2 text-center font-semibold hover:bg-orange-400 transition-all"
                  >
                    Check out
                  </Link>
                </p>
              </div>
            </div>

            <Link to="/shop" className="block w-fit">
              <span
                className="px-6 flex justify-center gap-2 py-3 text-slate-900 border-2 uppercase min-w-fit w-[250px]
          text-center rounded-3xl font-semibold cursor-pointer hover:text-white
          transition-all hover:bg-orange-400"
              >
                <span>
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
                      d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
                    />
                  </svg>
                </span>
                keep shopping
              </span>
            </Link>
          </div>
        </>
      )}
      {carts?.length <= 0 && (
        <div className="flex flex-col justify-center items-center py-5">
          <h2 className="mb-5">Your cart is empty</h2>
          <Link to="/shop" className="block w-fit">
            <span
              className="px-6 flex justify-center gap-2 py-3 text-slate-900 border-2 uppercase min-w-fit w-[250px]
          text-center rounded-3xl font-semibold cursor-pointer hover:text-white
          transition-all hover:bg-orange-400"
            >
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
                  />
                </svg>
              </span>
              keep shopping
            </span>
          </Link>
        </div>
      )}
    </Layout>
  );
};

export default Cart;
