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
import Momo from "../../modules/checkout/Momo";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Loading from "../../components/Loading";
import ItemCouponShiping from "../../components/ItemCouponShiping";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setChangeMoney } from "../../redux-thunk/userSlice";
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
  const [show, setShow] = React.useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { isShowCart, carts } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const cookies = new Cookies();

  const info = cookies.get("infoPayment");
  const sumcur = cookies.get("sumcur");

  const dispatch = useDispatch();

  const handlePayment = async () => {
    console.log(parseFloat(JSON.parse(localStorage.getItem("sum"))).toFixed(2));
    if (!info) return;
    const formData = new FormData();
    formData.append("phone", info.phone);
    formData.append("address", info.address + "," + info.country);
    formData.append(
      "total",
      parseFloat(JSON.parse(localStorage.getItem("sum"))).toFixed(2)
    );
    formData.append("userId", user?.id);
    formData.append("fee", feeVc);

    if (JSON.parse(localStorage.getItem("infoVoucher"))) {
      const voucher = JSON.parse(localStorage.getItem("infoVoucher"));
      if (+voucher.feature == 1) {
        formData.append(
          "voucher",
          parseFloat(sumCart() * (+voucher.value / 100).toFixed(2))
        );
      } else if (+voucher.feature == 2) {
        formData.append("voucher", parseFloat(voucher.value).toFixed(2));
      }

      const formData2 = new FormData();
      formData2.append("user_id", user?.id);
      formData2.append("coupon_id", voucher.id);
      try {
        const response = await axios({
          method: "post",
          url: "https://shoppet.site/api/coupon/delete_user_coupon",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + user?.token,
          },
          data: formData2,
        });
      } catch (e) {
        console.log(e);
      }
    }

    const response = await axios({
      method: "post",
      url: "https://shoppet.site/api/bill/add",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + user?.token,
      },
      data: formData,
    });
    if (response) {
      const infoVoucher = localStorage.removeItem("infoVoucher");
      localStorage.removeItem("sum");

      console.log(response);
      navigate("/payment/" + response.data.id_bill);
    }
  };
  const [feeVc, setFee] = React.useState(0);
  const sumCart = () => {
    let sum = 0;
    if (carts) {
      carts.map((item) => {
        sum += parseFloat(item.total);
      });
    }

    return sum;
  };
  const [currentMoney, setCurrentMoney] = useState(null);
  const fee = async () => {
    let codeWard = JSON.parse(localStorage.getItem("codeWard"));
    let codeDistrict = JSON.parse(localStorage.getItem("codeDistrict"));
    let service_id = JSON.parse(localStorage.getItem("service_id"));

    console.log(sumCart() * 23000);
    const result = await axios({
      method: "POST",
      url: "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",

      headers: {
        "Content-Type": "application/json",
        token: "8909150e-3f24-11ed-b824-262f869eb1a7",
        ShopId: "3299752",
      },
      data: JSON.stringify({
        service_id: +service_id,
        insurance_value: parseInt(sumCart() * 23000),
        coupon: null,
        to_ward_code: codeWard,
        to_district_id: +codeDistrict,
        from_district_id: 1758,
        height: 50,
        length: 20,
        weight: 100,
        width: 20,
      }),
    });
    console.log(result);
    if (result) {
      localStorage.setItem(
        "sum",
        JSON.stringify(+sumcur + result.data.data.service_fee / 23000)
      );
      setFee(result.data.data.service_fee / 23000);
    }
  };
  React.useEffect(() => {
    fee();
  }, []);

  //
  const [vouchers, setVouchers] = React.useState();
  const callVoucher = async () => {
    handleShow();
    localStorage.removeItem("infoVoucher");
    try {
      setLoading(true);
      const response = await axios({
        method: "get",
        url: "https://shoppet.site/api/coupon/get_coupon_user/" + user?.id,

        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user?.token,
        },
      });
      console.log(response);
      if (response) {
        setVouchers(response.data.coupons);
      }
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };
  //

  const handleSetMoney = async () => {
    const infoVoucher = JSON.parse(localStorage.getItem("infoVoucher"));
    console.log(infoVoucher);
    if (infoVoucher) {
      if (+infoVoucher.feature == 1) {
        console.log(sumCart() * (+infoVoucher.value / 100));
        setCurrentMoney(sumCart() - sumCart() * (+infoVoucher.value / 100));
        localStorage.setItem(
          "sum",
          JSON.stringify(
            sumCart() - sumCart() * (+infoVoucher.value / 100) + feeVc
          )
        );
        dispatch(setChangeMoney(true));
      } else {
        if (+infoVoucher.feature == 2) {
          console.log(sumCart() - +infoVoucher.value);
          setCurrentMoney(sumCart() - +infoVoucher.value);
          localStorage.setItem(
            "sum",
            JSON.stringify(sumCart() - +infoVoucher.value + feeVc)
          );
          dispatch(setChangeMoney(true));
        } else {
          setCurrentMoney(sumCart());
          localStorage.setItem("sum", JSON.stringify(sumCart() + feeVc));
        }
      }
    } else {
      localStorage.setItem("sum", JSON.stringify(sumCart() + feeVc));
      setCurrentMoney(null);
    }

    handleClose();
  };

  const cacaulateVoucherMoney = () => {
    const infoVoucher = JSON.parse(localStorage.getItem("infoVoucher"));
    if (infoVoucher) {
      if (+infoVoucher.feature == 1) {
        return formatter.format(sumCart() * (+infoVoucher.value / 100));
      } else if (+infoVoucher.feature == 2) {
        return formatter.format(infoVoucher.value);
      }
    }
    return null;
  };
  return (
    <Layout>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>My Voucher</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <Loading></Loading>
          ) : (
            <>
              {vouchers?.length > 0 &&
                vouchers.map((item) => (
                  <ItemCouponShiping item={item}></ItemCouponShiping>
                ))}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSetMoney}>
            Áp dụng
          </Button>
        </Modal.Footer>
      </Modal>
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
                <span className="font-semibold">{formatter.format(feeVc)}</span>
              </div>
            </div>
            <div className="text-end">
              <p
                onClick={() => callVoucher()}
                className="text-center font-bold block my-3 px-4 py-2 border border-2 rounded-xl text-orange-500 cursor-pointer hover:bg-orange-500 hover:text-slate-50 transition-all border-orange-400"
              >
                My Voucher
              </p>
            </div>
          </div>
          <div className=" mt-3 justify-between">
            <>
              <Paypal sumf={sumCart()} user={user} fee={feeVc} info={info} />
              <div>
                <Vnpay sumf={sumCart()} user={user} fee={feeVc} info={info} />
                <Momo
                  sumf={sumCart()}
                  user={user}
                  fee={feeVc}
                  info={info}
                ></Momo>
              </div>
            </>
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
              <p className="flex pb-3 justify-between items-center m-0">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">{formatter.format(feeVc)}</span>
              </p>
              {currentMoney && (
                <p className="flex justify-between items-center m-0">
                  <span className="text-gray-600">Voucher</span>
                  <span className="font-semibold">
                    -{cacaulateVoucherMoney()}
                  </span>
                </p>
              )}
            </div>
            <div className="total py-3">
              <p className="flex justify-between items-center">
                <span className="text-xl">Total</span>
                <span className="font-semibold text-3xl">
                  {formatter.format(
                    currentMoney ? currentMoney + feeVc : sumCart() + feeVc
                  )}
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
