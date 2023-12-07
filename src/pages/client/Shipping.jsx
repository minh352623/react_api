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
import { logEvent } from "firebase/analytics";
import { analytics } from "../../firebase/firebase-config";
import { ethers } from "ethers";
import Swal from "sweetalert2";
import { ABI, address } from "../../trait/ABI";

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
          url: "https://shoppet.fun/api/coupon/delete_user_coupon",
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
      url: "https://shoppet.fun/api/bill/add",
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
  React.useEffect(async () => {
    fee();
  }, []);

  //
  const [vouchers, setVouchers] = React.useState();
  const callVoucher = async () => {
    logEvent(analytics, "Chọn Voucher");

    handleShow();
    localStorage.removeItem("infoVoucher");
    try {
      setLoading(true);
      const response = await axios({
        method: "get",
        url: "https://shoppet.fun/api/coupon/get_coupon_user/" + user?.id,

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

  const createOrderBlockchain = async (orderId, email, totalPrice, date) => {
    try {
      const res = await axios({
        method: "post",
        url: "https://chiase.shoppet.fun/api/blockchain/addOrder",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          idOrder: orderId,
          email: email,
          price: totalPrice,
          date: date,
        },
      });
    } catch (e) {
      console.log(
        "🚀 ~ file: Shipping.jsx:249 ~ createOrderBlockchain ~ e:",
        e
      );
    }
  };

  //payment with metamask
  const [provider, setProvider] = useState(null);
  const [singer, setSinger] = useState(null);
  const [contract, setContract] = useState(null);

  const [statePaymentMetamask, setStatePaymentMetamask] = useState("");
  const [stateModalMetamask, setStateModalMetamask] = useState(false);
  const initializeProvider = async () => {
    if (window.ethereum) {
      // Modern dapp browsers
      try {
        await window.ethereum.enable();
        const providerInstance = new ethers.providers.Web3Provider(
          window.ethereum
        );
        // const accounts = await providerInstance.send('eth_requestAccounts', []);
        // console.log("🚀 ~ file: Blockchain.jsx:23 ~ initializeProvider ~ accounts:", accounts)
        const singer = providerInstance.getSigner();
        console.log(
          "🚀 ~ file: Shipping.jsx:256 ~ initializeProvider ~ singer:",
          singer
        );
        const contract = new ethers.Contract(
          address,
          JSON.parse(JSON.stringify(ABI)),
          singer
        );
        // const contract = new ethers.Contract(
        //   address,
        //   JSON.parse(JSON.stringify(ABI)),
        //   singer
        // );
        // console.log(
        //   "🚀 ~ file: Blockchain.jsx:27 ~ initializeProvider ~ contract:",
        //   contract
        // );
        const res = await contract.getOrderById(1);
        console.log(
          "🚀 ~ file: Shipping.jsx:165 ~ React.useEffect ~ res:",
          res
        );
        setProvider(providerInstance);
        setSinger(singer);
        setContract(contract);
      } catch (error) {
        console.log(
          "🚀 ~ file: HeaderClient.jsx:289 ~ initializeProvider ~ error:",
          error
        );
      }
    } else {
      // Non-dapp browsers or old versions of MetaMask
      console.error("No web3 provider detected");
    }
  };
  const paymentWithMetamask = async () => {
    try {
      if (!singer) {
        await initializeProvider();
        Swal.fire({
          position: "center-center",
          icon: "success",
          title: "Vui lòng chọn lại thanh toán Metamask!!!",
          showConfirmButton: false,
          timer: 2000,
        });
        return;
      }
      console.log(
        "total: ",
        (
          parseFloat(JSON.parse(localStorage.getItem("sum"))) * 0.000610074
        ).toString()
      );
      setStateModalMetamask(true);
      setStatePaymentMetamask("Metamask đang xủ lý giao dịch...");
      const tx = await singer.sendTransaction({
        to: "0x4b2804CD7221a5d072049358C2837E7554Ea5F3A",
        // value: ethers.utils.parseEther('0.0001'),

        value: ethers.utils.parseEther(
          (
            parseFloat(JSON.parse(localStorage.getItem("sum"))).toFixed(2) *
            0.000610074
          ).toString()
        ),
      });
      console.log(
        "🚀 ~ file: Shipping.jsx:251 ~ paymentWithMetamask ~ tx:",
        tx
      );
      const txReceipt = await tx.wait();
      console.log(
        "🚀 ~ file: Shipping.jsx:301 ~ paymentWithMetamask ~ txReceipt:",
        txReceipt
      );

      if (txReceipt.status === 1) {
        console.log("Transaction succeeded!");
        console.log("Transaction hash:", txReceipt.transactionHash);
      } else {
        console.log("Transaction failed.");
        console.log("Transaction hash:", txReceipt.transactionHash);
      }
      setStatePaymentMetamask("Hệ thống đang xủ lý giao dịch...");
      // return;
      //order
      const formData = new FormData();
      formData.append("phone", info.phone);
      formData.append("address", info.address + "," + info.country);
      formData.append(
        "total",
        parseFloat(JSON.parse(localStorage.getItem("sum"))).toFixed(2)
      );
      formData.append("fee", feeVc);

      formData.append("userId", user?.id);
      formData.append("pttt", "metamask");
      formData.append("transaction_id_metamask", tx.hash);
      formData.append("from_address_metamask", tx.from);
      formData.append("to_address_metamask", tx.to);

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
            url: "https://shoppet.fun/api/coupon/delete_user_coupon",
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
      const infoVoucher = localStorage.removeItem("infoVoucher");
      const orderGHN = await applyToGHN();
      console.log(
        "🚀 ~ file: Shipping.jsx:382 ~ paymentWithMetamask ~ orderGHN:",
        orderGHN
      );
      formData.append("order_id_ghn", orderGHN?.data.data.order_code);

      const response = await axios({
        method: "post",
        url: "https://shoppet.fun/api/bill/add",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user?.token,
        },
        data: formData,
      });
      if (response) {
        await createOrderBlockchain(
          response.data.id_bill.toString() ?? "N/A",
          user.email ?? "test@gmail.com",
          response.data.total.toString() ?? "10000",
          response.data.date.toString() ?? Date.now().toString()
        );

        localStorage.removeItem("sum");
        setStatePaymentMetamask("Order success!!");
        setStateModalMetamask(false);

        console.log(response);
        
          window.location.href = "/payment/" + response.data.id_bill
      }
      //order
    } catch (err) {
      console.log(err.code == "INSUFFICIENT_FUNDS");
      setStateModalMetamask(false);
      switch (err.code) {
        case "ACTION_REJECTED":
          Swal.fire({
            position: "center-center",
            icon: "error",
            title: "Bạn đã từ chối giao dịch qua Metamask",
            showConfirmButton: false,
            timer: 2000,
          });
          break;
        case "INSUFFICIENT_FUNDS":
          Swal.fire({
            position: "center-center",
            icon: "error",
            title: "Số dư của bạn không đủ",
            showConfirmButton: false,
            timer: 2000,
          });
          break;
        case "NUMERIC_FAULT":
          Swal.fire({
            position: "center-center",
            icon: "error",
            title:
              "Số tiền quy đổi ra eth quá nhỏ, vui lòng mua thêm hàng để thanh toán!!",
            showConfirmButton: false,
            timer: 2000,
          });
          break;
        default:
          Swal.fire({
            position: "center-center",
            icon: "error",
            title: "Error from server",
            showConfirmButton: false,
            timer: 2000,
          });
          break;
      }
      console.log(
        "🚀 ~ file: Shipping.jsx:247 ~ paymentWithMetamask ~ err:",
        err
      );
    }
  };

  const applyToGHN = async () => {
    try {
      let service_id = JSON.parse(localStorage.getItem("service_id"));
      let codeWard = JSON.parse(localStorage.getItem("codeWard"));
      let codeDistrict = JSON.parse(localStorage.getItem("codeDistrict"));
      const itemCart = carts.map((item) => {
        return {
          name: item.name,
          code: item.id.toString(),
          quantity: +item.number,
          price: parseInt(parseFloat(item.price * 23000).toFixed(0)),
          length: 12,
          width: 12,
          height: 12,
          weight: 500,
          category: {
            level1: "Thức Ăn Thú Cưng",
          },
        };
      });
      const response = await axios({
        method: "POST",
        url: "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/create",
        headers: {
          "Content-Type": "application/json",
          Token: "4528b2a9-85c8-11ee-b1d4-92b443b7a897",
          ShopId: "190365",
        },
        data: JSON.stringify({
          payment_type_id: 2,
          note: "Shoppet Payment",
          required_note: "KHONGCHOXEMHANG",
          from_name: "TinTest124",
          from_phone: "0987654321",
          from_address:
            "447 tổ 16 ấp Mỹ bình, Xã Thạnh Mỹ Tây, Châu Phú, An Giang Vietnam",
          from_ward_name: "Xã Thạnh Mỹ Tây",
          from_district_name: "Huyện Châu Phú",
          from_province_name: "An Giang",
          client_order_code: "",
          to_name: user?.email,
          to_phone: info.phone,
          to_address: info.address + "," + info.country,
          to_ward_code: codeWard,
          to_district_id: +codeDistrict,
          cod_amount:
            parseInt(
              parseFloat(JSON.parse(localStorage.getItem("sum"))).toFixed(2)
            ) * 23000,
          content: "Theo New York Times",
          weight: 200,
          length: 1,
          width: 19,
          height: 10,
          pick_station_id: 1444,
          deliver_station_id: null,
          insurance_value:
            parseInt(
              parseFloat(JSON.parse(localStorage.getItem("sum"))).toFixed(2)
            ) * 23000,
          service_id: +service_id,
          service_type_id: 2,
          coupon: null,
          pick_shift: [2],
          items: itemCart,
        }),
      });
      console.log(
        "🚀 ~ file: Shipping.jsx:497 ~ applyToGHN ~ response:",
        response
      );
      return response;
    } catch (e) {
      console.log("🚀 ~ file: Shipping.jsx:446 ~ applyToGHN ~ e:", e);
    }
  };
  //end payment with metamask
  return (
    <Layout>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={stateModalMetamask}
        onHide={() => setStateModalMetamask(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Payment Metamask</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="flex gap-3">
            {statePaymentMetamask}
            <div role="status">
              <svg
                aria-hidden="true"
                class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span class="sr-only">Loading...</span>
            </div>
          </div>
        </Modal.Body>
      </Modal>
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
              <Paypal
                applyToGHN={applyToGHN}
                sumf={sumCart()}
                user={user}
                fee={feeVc}
                info={info}
              />
              <div className="flex flex-col gap-3">
                <Vnpay
                  applyToGHN={applyToGHN}
                  sumf={sumCart()}
                  user={user}
                  fee={feeVc}
                  info={info}
                />
                <Momo
                  sumf={sumCart()}
                  user={user}
                  fee={feeVc}
                  info={info}
                  applyToGHN={applyToGHN}
                ></Momo>
                <p
                  onClick={paymentWithMetamask}
                  className="w-full px-3 py-2 cursor-pointer hover:scale-105 text-white rounded-xl flex items-center gap-3  bg-slate-500"
                >
                  <img src="./fox.png" className="w-[50px] h-[50px]" alt="" />
                  <span className="uppercase text-2xl space-x-3">
                    Metamask
                  </span>{" "}
                </p>
              </div>
            </>
          </div>
          <div className="flex items-center justify-between gap-3">
            <Link to="/checkout">
              <span className="flex items-center border rounded-lg border-blue-500 px-4 py-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  class="w-5 h-4 leading-none"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
                <span class="leading-none">Return to infomation</span>
              </span>
            </Link>
            <div className="flex gap-5 items-center justify-between">
              <p
                onClick={handlePayment}
                className={`bg-blue-700 m-0 hover:bg-blue-800
                   text-center text-white px-6 py-3 rounded-xl cursor-pointer  transition-all`}
              >
                Get paid goods
              </p>
            </div>
          </div>
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
