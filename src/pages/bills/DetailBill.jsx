import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Header from "../../components/layouts/Header";
import Loading from "../../components/Loading";
import ItemCheckout from "../../modules/checkout/ItemCheckout";
import Status from "../../modules/payment/Status";
import { formatter } from "../../trait/FormatMoney";
import Form from "react-bootstrap/Form";

const DetailBill = () => {
  const { bill } = useParams();
  const { user } = useSelector((state) => state.user);
  const [data, setData] = useState();
  const [status, setStatus] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const fetchBill = async () => {
    try {
      setLoading(true);
      const response = await axios({
        method: "get",
        url: "https://shoppet-tm.herokuapp.com/api/bill/detail/" + bill,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user?.token,
        },
      });
      if (response) {
        console.log(response);
        setData(response.data);
        setStatus(parseInt(response.data.status));
        setLoading(false);
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    fetchBill();
  }, []);
  const handleChange = (e) => {
    setStatus(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("status", status);
    try {
      const response = await axios({
        method: "post",
        url: "https://shoppet-tm.herokuapp.com/api/bill/update/" + bill,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user?.token,
        },
        data: formData,
      });
      if (response) {
        console.log(response);
        setMessage("Cập nhật bill thành công");
        setError("");
      }
    } catch (e) {
      console.log(e);
      setMessage("");
      setError("Có lỗi xảy ra. Vui lòng kiểm tra lại!");
    }
  };
  return (
    <>
      <Header></Header>
      {loading && <Loading></Loading>}
      {!loading && (
        <div className="grid grid-cols-12 h-full mt-5 rounded-lg m-auto w-3/4 bg-gray-50">
          <div className="col-span-12 mx-auto">
            <Status status={parseInt(data?.status)}></Status>
          </div>
          <div className="col-span-6 rounded-lg p-5">
            <div className="mess mb-3">
              {error && <h4 className="text-red-400 text-center">{error}</h4>}
              {message && (
                <h4 className="text-green-400 bg-green-200 p-3 rounded-lg text-center">
                  {message}
                </h4>
              )}
            </div>
            <div className="image">
              <div className=" border-2 rounded-lg p-3">
                <p className="flex gap-5 border-b py-2 m-0">
                  <span className="text-gray-500">Contact</span>
                  <span className="font-semibold">{data?.tel}</span>
                </p>
                <p className="flex gap-5 m-0 border-b py-2">
                  <span className="text-gray-500">Ship to</span>
                  <span className="font-semibold">{data?.address}</span>
                </p>
                <p className="flex gap-5 py-2 m-0">
                  <span className="text-gray-500">Method</span>
                  <span className="font-semibold">Standard Shipping</span>
                  <span>{formatter.format(2)}</span>
                </p>
              </div>
            </div>
            <div className="mt-5">
              <form onSubmit={handleSubmit}>
                <p>Status</p>
                <select
                  onChange={(e) => handleChange(e)}
                  className="form-select"
                  name="status"
                  defaultValue={data?.status}
                >
                  <option value="0">Processing</option>
                  <option value="1">In Transit</option>
                  <option value="2">Delivered</option>
                </select>

                <p className="text-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-700 mt-3 rounded-xl text-white"
                  >
                    Update
                  </button>
                </p>
              </form>
            </div>
          </div>
          <div className="col-span-6 rounded-lg">
            <div className="bg-gray-50  p-5">
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
                    {formatter.format(parseInt(data?.total) - 2)}
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
                    {formatter.format(parseInt(data?.total))}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DetailBill;
