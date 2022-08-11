import React, { useEffect, useState } from "react";
import Header from "../../components/layouts/Header";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";

const schema = yup.object({
  name: yup.string().min(6, "Tên sản phẩm ít nhất 6 kí tự"),
  price: yup
    .number("Giá Sản phẩm phải là số")
    .required("Giá bắt buộc phải nhập")
    .min(1, "Giá sản phẩm ít nhất 1 kí tự"),

  description: yup
    .string()
    .required("Thông tin bắt buộc phải nhập")
    .min(10, "Thông tin sản phẩm ít nhất 10 kí tự"),
});
const AddProduct = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting, isSubmitSuccessful },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  useEffect(() => {
    if (!localStorage.getItem("user-info")) {
      navigate("/login");
    }
  }, []);

  const onSubmitAdd = async (values) => {
    console.log(values);
    if (!isValid) return;
    const formData = new FormData();
    // file_path: values.file_path[0].name,
    // console.log(values);

    console.log(values.file_path);
    formData.append("name", values.name);
    formData.append("price", values.price);
    formData.append("description", values.description);
    formData.append("file_path", values.file_path[0]);

    try {
      const result = await axios({
        method: "post",
        url: "http://127.0.0.1:8000/api/product/add",
        headers: {
          authorization: "you token",
          "Content-Type": "application/json",
        },
        data: formData,
      });
      reset({
        name: "",
        price: "",
        description: "",
        file_path: "",
      });
      if (result) {
        setMessage("Thêm thành công");
        setError("");
      }
      console.log(result);
    } catch (e) {
      console.log(e);
      setMessage("");
      setError("Có lỗi xảy ra. Vui lòng kiểm tra lại!");
    }
  };
  return (
    <>
      <Header></Header>
      <Form
        encType="multipart/form-data"
        method="post"
        onSubmit={handleSubmit(onSubmitAdd)}
        className="w-[1000px] mx-auto mt-5 shadow-lg p-5 rounded-lg"
      >
        <h2 className="text-center">Add Product</h2>

        {error && <h4 className="text-red-400 text-center">{error}</h4>}
        {message && (
          <h4 className="text-green-400 bg-green-200 p-3 rounded-lg text-center">
            {message}
          </h4>
        )}

        <div className="grid grid-cols-1 gap-x-5 gap-y-3">
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Name Product</Form.Label>
            <Form.Control
              type="text"
              {...register("name")}
              name="name"
              placeholder="Enter product name"
            />
            {errors?.name && (
              <p className="text-red-500 mt-1 text-sm">{errors.name.message}</p>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="text"
              name="price"
              {...register("price")}
              placeholder="Enter price"
            />
            {errors?.price && (
              <p className="text-red-500 mt-1 text-sm">
                {errors.price.message}
              </p>
            )}
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="file"
              name="file_path"
              {...register("file_path")}
              placeholder="Password"
            />
            {errors?.file_path && (
              <p className="text-red-500 mt-1 text-sm">
                {errors.file_path.message}
              </p>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              {...register("description")}
              placeholder="description"
            />
            {errors?.description && (
              <p className="text-red-500 mt-1 text-sm">
                {errors.description.message}
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

export default AddProduct;
