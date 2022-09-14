import * as React from "react";
import Layout from "../../components/layouts/Layout";
import Cookies from "universal-cookie";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { formatter } from "../../trait/FormatMoney";
import ItemCheckout from "../../modules/checkout/ItemCheckout";
import axios from "axios";
import Paypal from "../../modules/checkout/Paypal";
import Vnpay from "../../modules/checkout/Vnpay";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};
const Shipping = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const { isShowCart, carts } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const cookies = new Cookies();

  const info = cookies.get("infoPayment");

  const sumCart = () => {
    let sum = 0;
    if (carts) {
      carts.map((item) => {
        sum += parseFloat(item.total);
      });
    }
    return sum;
  };

  const handlePayment = async () => {
    if (!info) return;
    const formData = new FormData();
    formData.append("phone", info.phone);
    formData.append("address", info.address + "," + info.country);
    formData.append("total", sumCart() + 2);
    formData.append("userId", user?.id);

    const response = await axios({
      method: "post",
      url: "https://shoppet-tm.herokuapp.com/api/bill/add",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + user?.token,
      },
      data: formData,
    });
    if (response) {
      console.log(response);
      navigate("/payment/" + response.data.id_bill);
    }
  };

  return (
    <Layout>
      <div className="grid grid-cols-12 mx-auto w-3/4 bg-gray-50">
        <div className="col-span-6  p-5">
          <div className="image">
            <img src="./logoFotter.png" alt="" />
            <div className="flex items-center gap-2 my-3">
              <Link className="text-black" to="/cart">
                Cart
              </Link>
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  class="w-3 h-3 leading-none"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </span>
              <Link className="text-black" to="/cart">
                Infomation
              </Link>
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  class="w-3 h-3 leading-none"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </span>
              <span class="font-bold">Shiping</span>
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  class="w-3 h-3 leading-none"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </span>
              <span>Payment</span>
            </div>
            <div className="border border-2 rounded-lg p-3">
              <p className="flex gap-5 border-b pb-2">
                <span className="text-gray-500">Contact</span>
                <span className="font-semibold">{info?.phone}</span>
              </p>
              <p className="flex gap-5 m-0">
                <span className="text-gray-500">Ship to</span>
                <span className="font-semibold">
                  {info?.address},
                  <span className="uppercase"> {info?.country}</span>
                </span>
              </p>
            </div>
            <div className="method">
              <p className="mt-5 text-xl">Shipping Method</p>
              <div className="border border-2 rounded-lg p-3 flex justify-between items-center w-full">
                <p className="m-0 flex gap-3 items-center">
                  <span className="p-[10px] flex justify-center items-center block w-[5px] h-[5px] max-w-[5px] max-h-[5px] bg-blue-600 rounded-full">
                    <span className="p-[3px] block w-[3px] h-[3px] max-w-[3px] max-h-[3px] rounded-full leading-none bg-white"></span>
                  </span>
                  <span> Standard Shipping</span>
                </p>
                <span className="font-semibold">{formatter.format(2)}</span>
              </div>
            </div>
          </div>
          <div className="flex mt-3 justify-between">
            <Paypal user={user} info={info} sum={sumCart()} />
            <Vnpay user={user} info={info} sum={sumCart()} />
          </div>
          <div className="flex gap-5 items-center justify-between mt-5">
            <p
              onClick={handlePayment}
              className={`bg-blue-700 hover:bg-blue-800
                   text-center text-white px-6 py-3 rounded-xl cursor-pointer  transition-all`}
            >
              Continue to payment
            </p>
          </div>
          <Link to="/checkout">
            <span className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                class="w-5 h-4 mt-[2px] leading-none"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
              <span class="leading-none h-4">Return to infomation</span>
            </span>
          </Link>
        </div>
        <div className="col-span-6 ">
          <div className="bg-gray-50  p-5 min-h-screen">
            <div className="listItem flex flex-col gap-3 border-b pb-3">
              {carts?.length > 0 &&
                carts.map((item) => (
                  <ItemCheckout key={item.id} item={item}></ItemCheckout>
                ))}
            </div>
            <div className="subtotal py-3 border-b m-0">
              <p className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">
                  {formatter.format(sumCart())}
                </span>
              </p>
              <p className="flex justify-between items-center m-0">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">{formatter.format(2)}</span>
              </p>
            </div>
            <div className="total py-3">
              <p className="flex justify-between items-center">
                <span className="text-xl">Total</span>
                <span className="font-semibold text-3xl">
                  {formatter.format(sumCart() + 2)}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Shipping;
