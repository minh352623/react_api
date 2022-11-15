import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import Layout from "../../components/layouts/Layout";
import ItemCheckout from "../../modules/checkout/ItemCheckout";
import Status from "../../modules/payment/Status";
import capitalizeFirstLetter from "../../trait/FirstUpper";
import { formatter } from "../../trait/FormatMoney";

const Payment = () => {
  const { bill } = useParams();
  const { user } = useSelector((state) => state.user);
  const [data, setData] = useState();
  const fetchBill = async () => {
    const response = await axios({
      method: "get",
      url: "https://shoppet.site/api/bill/detail/" + bill,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + user?.token,
      },
    });
    if (response) {
      console.log(response);
      setData(response.data);
    }
  };
  useEffect(() => {
    fetchBill();
  }, []);
  const cacaulateVoucherMoney = (id) => {
    if (id == 1) {
      return formatter.format(1);
    } else if (id == 2) {
      return formatter.format(2);
    }
    return null;
  };
  return (
    <Layout>
      <div className="grid grid-cols-12 mx-auto w-3/4 bg-gray-50">
        <div className="col-span-12 mx-auto">
          <Status status={parseInt(data?.status)}></Status>
        </div>
        <div className="col-span-6  p-5">
          <div className="image">
            <img src="../logoFotter.png" alt="" />
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
                  className="w-3 h-3 leading-none"
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
                  className="w-3 h-3 leading-none"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </span>
              <span>Shiping</span>
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-3 h-3 leading-none"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </span>
              <span className="font-bold">Payment</span>
            </div>
            <div className="border border-2 rounded-lg p-3">
              <p className="flex gap-5 border-b py-2 m-0">
                <span className="text-gray-500">Contact</span>
                <span className="font-semibold">{data?.tel}</span>
              </p>
              <p className="flex gap-5 m-0 border-b py-2">
                <span className="text-gray-500">Ship to</span>
                <span className="font-semibold">{data?.address}</span>
              </p>
              <p className="flex  gap-5 py-2 m-0 border-b py-2">
                <span className="text-gray-500">Method</span>
                <span className="font-semibold">Standard Shipping</span>
                <span>{formatter.format(+data?.money_ship)}</span>
              </p>
              <p className="flex gap-5 py-2 m-0">
                <span className="text-gray-500">Payment Method</span>
                <span className="font-semibold">
                  {data?.pttt
                    ? capitalizeFirstLetter(data?.pttt)
                    : "Pay after recieve"}
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="col-span-6 ">
          <div className="bg-gray-50  p-5 min-h-screen">
            <div className="listItem flex flex-col gap-3 border-b pb-3">
              {data?.detailBill?.length > 0 &&
                data?.detailBill.map((item) => (
                  <ItemCheckout key={item.id} item={item}></ItemCheckout>
                ))}
            </div>
            <div className="subtotal py-3 border-b m-0">
              <p className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">
                  {parseFloat(
                    data?.total - data?.money_ship + +data?.voucher
                  ).toFixed(2)}
                </span>
              </p>
              <p className="flex mb-3 justify-between items-center m-0">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">
                  {formatter.format(data?.money_ship)}
                </span>
              </p>
              {data?.voucher && (
                <p className="flex justify-between items-center m-0">
                  <span className="text-gray-600">Voucher</span>
                  <span className="font-semibold">
                    -{formatter.format(+data?.voucher)}
                  </span>
                </p>
              )}
            </div>
            <div className="total py-3">
              <p className="flex justify-between items-center">
                <span className="text-xl">Total</span>
                <span className="font-semibold text-3xl">
                  {formatter.format(data?.total)}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Payment;
