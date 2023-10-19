import React, { useEffect, useState } from "react";
import Header from "../../components/layouts/Header";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const schema = yup.object({
  name: yup.string().min(2, "Tên mã ít nhất 2 kí tự"),
  code: yup
    .string()
    .required("Code bắt buộc phải nhập")
    .min(6, "Code ít nhất 6 kí tự"),
  number: yup.string().required("Số lượng  bắt buộc phải nhập"),

  feature: yup
    .string("Nhóm bắt buộc phải chọn")
    .required("Nhóm bắt buộc phải chọn"),
});
const UpdateCoupon = () => {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const { user } = useSelector((state) => state.user);
  const { coupon } = useParams();
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isValid, isSubmitting, isSubmitSuccessful },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const FetchCoupon = async () => {
    try {
      setLoading(true);
      const response = await axios({
        method: "GET",
        url: "https://shoppet.fun/api/coupon/getOne/" + coupon,

        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user?.token,
        },
      });
      if (response.data) {
        console.log(response.data);
        setValue("name", response.data.name);
        setValue("code", response.data.code);
        setValue("number", response.data.number);
        setValue("feature", response.data.feature);
        setValue("value", response.data.value);
        setValue("coin_dre", response.data.coin_dre);

        setLoading(false);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const onSubmitUpdate = async (values) => {
    console.log(values);
    if (!isValid) return;
    const formData = new FormData();
    // file_path: values.file_path[0].name,
    // console.log(values);

    // console.log(values.file_path);
    formData.append("name", values.name);
    formData.append("code", values.code);
    formData.append("number", +values.number);
    formData.append("feature", +values.feature);
    formData.append("value", +values.value);
    formData.append("coin_dre", +values.coin_dre);

    try {
      const result = await axios({
        method: "post",
        url: "https://shoppet.fun/api/coupon/update/" + coupon,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user?.token,
        },
        data: formData,
      });

      if (result) {
        setMessage("Update mã giảm giá thành công");
        setError("");
      }

      console.log(result);
    } catch (e) {
      console.log(e);
      setMessage("");
      setError("Có lỗi xảy ra. Vui lòng kiểm tra lại!");
      if (e.response.status == 422) {
        setError(e.response.data.message);
      }
    }
  };
  useEffect(() => {
    FetchCoupon();
  }, []);
  return (
    <>
      <Header></Header>
      <Form
        encType="multipart/form-data"
        method="post"
        onSubmit={handleSubmit(onSubmitUpdate)}
        className="w-[1000px] mx-auto mt-5 shadow-lg p-5 rounded-lg"
      >
        <h2 className="text-center">Upadte Coupon</h2>

        {error && <h4 className="text-red-400 text-center">{error}</h4>}
        {message && (
          <h4 className="text-green-400 bg-green-200 p-3 rounded-lg text-center">
            {message}
          </h4>
        )}

        <div className="grid grid-cols-2 gap-x-5 gap-y-3">
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Name code</Form.Label>
            <Form.Control
              type="text"
              {...register("name")}
              name="name"
              placeholder="Enter name"
            />
            {errors?.name && (
              <p className="text-red-500 mt-1 text-sm">{errors.name.message}</p>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Code</Form.Label>
            <Form.Control
              type="text"
              name="code"
              {...register("code")}
              placeholder="Enter Code"
            />
            {errors?.code && (
              <p className="text-red-500 mt-1 text-sm">{errors.code.message}</p>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Number</Form.Label>
            <Form.Control
              type="number"
              name="number"
              min="1"
              max="20"
              {...register("number")}
              placeholder="Number"
            />
            {errors?.password && (
              <p className="text-red-500 mt-1 text-sm">
                {errors.password.message}
              </p>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Coin_Dre</Form.Label>
            <Form.Control
              type="number"
              name="coin_dre"
              {...register("coin_dre")}
              placeholder="Coin_dre"
            />
            {errors?.coin_dre && (
              <p className="text-red-500 mt-1 text-sm">
                {errors.coin_dre.message}
              </p>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Tính năng</Form.Label>
            <Form.Select
              aria-label="Default select example"
              name="feature"
              {...register("feature")}
            >
              <option value="">Tính năng</option>

              <option value="1">Giảm %</option>
              <option value="2">Giảm Tiền</option>
              <option value="3">Freeship</option>
            </Form.Select>
            {errors?.group && (
              <p className="text-red-500 mt-1 text-sm">
                {errors.group.message}
              </p>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Giá trị</Form.Label>
            <Form.Control
              type="number"
              name="value"
              min="1"
              max="100"
              {...register("value")}
              placeholder="10 or null(freeship)"
            />
            {errors?.value && (
              <p className="text-red-500 mt-1 text-sm">
                {errors.value.message}
              </p>
            )}
          </Form.Group>
        </div>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </>
  );
};

export default UpdateCoupon;
