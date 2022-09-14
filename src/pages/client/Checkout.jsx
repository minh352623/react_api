import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../components/layouts/Layout";
import { useSelector } from "react-redux";
import Form from "react-bootstrap/Form";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ItemCheckout from "../../modules/checkout/ItemCheckout";
import { formatter } from "../../trait/FormatMoney";
import { useDispatch } from "react-redux";
import Cookies from "universal-cookie";

const schema = yup.object({
  phone: yup
    .string()
    .required("Số điện thoại bắt buộc phải nhập!")
    .matches(
      /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/,
      "Sô điện thoại chưa đúng!"
    ),
  country: yup.string().required("Vui lòng chọn quốc gia"),
  lastName: yup.string().required("Tên bắt buộc phải nhập"),
  address: yup
    .string()
    .required("Địa chỉ bắt buộc phải nhập")
    .min(10, "Địa chỉ ít nhất 10 kí tự"),
});
const Checkout = () => {
  const { isShowCart, carts } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const onSubmitAdd = async (values) => {
    if (!isValid) return;
    const info = {
      name: values.firstName + values.lastName,
      address: values.address,
      phone: values.phone,
      country: values.country,
    };
    const cookies = new Cookies();
    cookies.set("infoPayment", info);
    navigate("/shipping");
  };
  const sumCart = () => {
    let sum = 0;
    if (carts) {
      carts.map((item) => {
        sum += parseFloat(item.total);
      });
    }
    return sum;
  };
  const setDefaultValue = () => {
    if (user) {
      setValue("lastName", user?.name);
      setValue("address", user?.address);
      setValue("phone", user?.phone);
    }
  };
  useEffect(() => {
    // if (carts && !carts.length <= 0) {
    //   navigate("/cart");
    // }
    setDefaultValue();
  }, []);
  return (
    <Layout>
      <div className="grid grid-cols-12 mx-auto w-3/4 bg-gray-100">
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
              <span class="font-bold">Infomation</span>
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
              <span>Shiping</span>
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
            <Form
              encType="multipart/form-data"
              method="post"
              onSubmit={handleSubmit(onSubmitAdd)}
              className="  mt-5  rounded-lg"
            >
              <p className="text-start text-xl my-3">Contact information</p>

              {/* {error && <h4 className="text-red-400 text-center">{error}</h4>} */}
              {message && (
                <h4 className="text-green-400 bg-green-200 p-3 rounded-lg text-center">
                  {message}
                </h4>
              )}

              <div className="grid grid-cols-1 gap-x-5 gap-y-3">
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Control
                    type="text"
                    {...register("phone")}
                    name="phone"
                    placeholder="Mobile phone number"
                  />
                  {errors?.phone && (
                    <p className="text-red-500 mt-1 text-sm">
                      {errors.phone.message}
                    </p>
                  )}
                </Form.Group>
                <p className="text-xl">Shopping address</p>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Select
                    {...register("country")}
                    name="country"
                    placeholder="Enter country"
                    aria-label="Default select example"
                  >
                    <option value="vietnam">Việt Nam</option>
                  </Form.Select>
                  {errors?.country && (
                    <p className="text-red-500 mt-1 text-sm">
                      {errors.country.message}
                    </p>
                  )}
                </Form.Group>
                <div className="grid gap-3 grid-cols-12">
                  <div className="col-span-6">
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Control
                        type="text"
                        {...register("firstName")}
                        name="firstName"
                        placeholder="FirstName"
                      />
                      {errors?.firstName && (
                        <p className="text-red-500 mt-1 text-sm">
                          {errors.firstName.message}
                        </p>
                      )}
                    </Form.Group>
                  </div>
                  <div className="col-span-6">
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Control
                        type="text"
                        {...register("lastName")}
                        name="lastName"
                        placeholder="LastName"
                      />
                      {errors?.lastName && (
                        <p className="text-red-500 mt-1 text-sm">
                          {errors.lastName.message}
                        </p>
                      )}
                    </Form.Group>
                  </div>
                </div>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Control
                    type="text"
                    {...register("address")}
                    name="address"
                    placeholder="Address"
                  />
                  {errors?.address && (
                    <p className="text-red-500 mt-1 text-sm">
                      {errors.address.message}
                    </p>
                  )}
                </Form.Group>
              </div>
              <div className="flex items-center justify-between">
                <Link to="/cart">
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
                    <span class="leading-none h-4">Return to cart</span>
                  </span>
                </Link>
                <button
                  className={`bg-blue-500 hover:bg-blue-700
                   text-center text-white px-6 py-3 rounded-xl  transition-all`}
                  type="submit"
                >
                  Continue to shipping
                </button>
              </div>
            </Form>
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
              <p className="flex justify-between items-center m-0">
                <span className="text-gray-600">Shipping</span>
                <span className="text-xs">Calculated at next step</span>
              </p>
            </div>
            <div className="total py-3">
              <p className="flex justify-between items-center">
                <span className="text-xl">Total</span>
                <span className="font-semibold text-3xl">
                  {formatter.format(sumCart())}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
