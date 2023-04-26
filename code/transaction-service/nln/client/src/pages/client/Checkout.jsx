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
import axios from "axios";
import Swal from "sweetalert2";

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
    .min(3, "Địa chỉ ít nhất 3 kí tự"),
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
    if (!isValid) {
      return;
    }
    if (carts) {
      let infoAdd =
        JSON.parse(localStorage.getItem("ward")) +
        ", " +
        JSON.parse(localStorage.getItem("district")) +
        ", " +
        JSON.parse(localStorage.getItem("province"));
      const info = {
        name: values.firstName + values.lastName,
        address: values.address + ", " + infoAdd,
        phone: values.phone,
        country: values.country,
      };
      const cookies = new Cookies();
      cookies.set("infoPayment", info);
      let sum = 0;
      carts.map((item) => {
        sum += parseFloat(item.total);
      });
      cookies.set("sumcur", sum);

      navigate("/shipping");
    }
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
      setValue("phone", user?.phone);
    }
  };
  const [codeProvince, setCodeProvivce] = useState();
  const [codeDistrict, setCodeDistrict] = useState();
  const [codeWard, setCodeWard] = useState();

  const [province, setProvince] = useState();
  const [district, setDistrict] = useState();
  const [ward, setWard] = useState();

  const getProvince = async () => {
    const provinceNew = await axios({
      method: "GET",
      url: "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",

      headers: {
        "Content-Type": "application/json",
        token: "8909150e-3f24-11ed-b824-262f869eb1a7",
      },
    });
    if (provinceNew) {
      console.log(provinceNew);
      setProvince(provinceNew.data.data);
    }
  };
  const getDistrict = async (codeProvince) => {
    const districtNew = await axios({
      method: "POST",
      url: "https://online-gateway.ghn.vn/shiip/public-api/master-data/district",

      headers: {
        "Content-Type": "application/json",
        token: "8909150e-3f24-11ed-b824-262f869eb1a7",
      },
      data: JSON.stringify({
        province_id: +codeProvince,
      }),
    });
    if (districtNew) {
      console.log(districtNew);
      setDistrict(districtNew.data.data);
    }
  };
  const getWard = async (codeDistrict) => {
    const wardNew = await axios({
      method: "POST",
      url: "https://online-gateway.ghn.vn/shiip/public-api/master-data/ward",

      headers: {
        "Content-Type": "application/json",
        token: "8909150e-3f24-11ed-b824-262f869eb1a7",
      },
      data: JSON.stringify({
        district_id: +codeDistrict,
      }),
    });
    if (wardNew) {
      console.log(wardNew);
      setWard(wardNew.data.data);
    }
  };

  useEffect(() => {
    getProvince();

    setDefaultValue();
  }, []);
  console.log(codeDistrict);

  const getService = async (toDistrict) => {
    const result = await axios({
      method: "POST",
      url: "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services",

      headers: {
        "Content-Type": "application/json",
        token: "8909150e-3f24-11ed-b824-262f869eb1a7",
      },
      data: JSON.stringify({
        shop_id: 3299752,
        from_district: 1758,
        to_district: +toDistrict,
      }),
    });
    if (result) {
      console.log(result.data.data[0].service_id);
      localStorage.setItem(
        "service_id",
        JSON.stringify(result.data.data[0].service_id)
      );
    }
  };
  useEffect(() => {
    if (codeProvince) {
      getDistrict(codeProvince);
    }
    if (codeDistrict) {
      getWard(codeDistrict);
      getService(codeDistrict);
    }
    console.log("out");
  }, [codeDistrict, codeProvince]);

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
                  <label className="mb-1" htmlFor="">
                    Tỉnh Thành
                  </label>
                  <Form.Select
                    name="province"
                    onChange={(e) => {
                      localStorage.setItem(
                        "province",
                        JSON.stringify(
                          e.target.options[e.target.selectedIndex].text
                        )
                      );
                      setCodeProvivce(e.target.value);
                    }}
                    placeholder="Enter province"
                    aria-label="Default select example"
                  >
                    <option value="">Vui lòng chọn tỉnh thành</option>
                    {province &&
                      province?.length > 0 &&
                      province.map((item) => (
                        <option value={item.ProvinceID}>
                          {item.ProvinceName}
                        </option>
                      ))}
                  </Form.Select>
                </Form.Group>
                {codeProvince && (
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <label className="mb-1" htmlFor="">
                      Quận/Huyện
                    </label>
                    <Form.Select
                      name="district"
                      onChange={(e) => {
                        localStorage.setItem(
                          "district",
                          JSON.stringify(
                            e.target.options[e.target.selectedIndex].text
                          )
                        );
                        setCodeDistrict(e.target.value);
                      }}
                      placeholder="Enter district"
                    >
                      <option value="">Vui lòng chọn Quận/Huyện</option>
                      {district &&
                        district?.length > 0 &&
                        district.map((item) => (
                          <option value={item.DistrictID}>
                            {item.DistrictName}
                          </option>
                        ))}
                    </Form.Select>
                  </Form.Group>
                )}
                {codeDistrict && (
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <label className="mb-1" htmlFor="">
                      Xã/Phường/Thị Trấn
                    </label>
                    <Form.Select
                      name="ward"
                      onChange={(e) => {
                        localStorage.setItem(
                          "ward",
                          JSON.stringify(
                            e.target.options[e.target.selectedIndex].text
                          )
                        );
                        localStorage.setItem(
                          "codeWard",
                          JSON.stringify(e.target.value)
                        );
                        localStorage.setItem(
                          "codeDistrict",
                          JSON.stringify(codeDistrict)
                        );
                        setCodeWard(e.target.value);
                      }}
                      aria-label="Default select example"
                    >
                      <option value="">Vui lòng chọn Xã/Phường/Thị Trấn</option>
                      {ward &&
                        ward?.length > 0 &&
                        ward.map((item) => (
                          <option value={item.WardCode}>{item.WardName}</option>
                        ))}
                    </Form.Select>
                  </Form.Group>
                )}
                {codeWard && (
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control
                      type="text"
                      {...register("address")}
                      name="address"
                      placeholder="address"
                    />
                    {errors?.address && (
                      <p className="text-red-500 mt-1 text-sm">
                        {errors.address.message}
                      </p>
                    )}
                  </Form.Group>
                )}
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
                   text-center  text-white px-6 py-3 rounded-xl  transition-all`}
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
