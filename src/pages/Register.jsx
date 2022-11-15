import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
import Header from "../components/layouts/Header";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import HeaderClient from "../components/layouts/HeaderClient";
// import { useHistory } from "react-router-dom";
// let history = useHistory();
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

const schema = yup.object({
  name: yup.string().min(8, "Tên user ít nhất 8 kí tự"),
  email: yup
    .string()
    .required("Email bắt buộc phải nhập")
    .email("Email không hợp lệ"),
  password: yup
    .string()
    .required("Mật khẩu bắt buộc phải nhập")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Mật khẩu phải 8 chữ số và ít nhất có 1 chữ hoa, 1 chữ thường, 1 kí tự đặt biệt,1 số"
    ),
});
const Register = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting, isSubmitSuccessful },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [error, setErrors] = useState("");

  const onSubmitAdd = async (values) => {
    // e.preventDefault();
    let user = {
      name: values.name,
      email: values.email,
      password: values.password,
      phone,
    };
    console.log(user);
    user = JSON.stringify(user);
    try {
      let result = await axios.post("https://shoppet.site/api/register", user, {
        headers: { "Content-Type": "application/json" },
      });
      console.log(result);
      if (result.status == 201) {
        navigate("/login");
      }
    } catch (e) {
      console.log(e.response.data.errors);
      setErrors("Thông tin không hợp lệ");
      console.log(error);
    }
  };
  return (
    <>
      <Form
        method="post"
        onSubmit={handleSubmit(onSubmitAdd)}
        className="w-[600px] mx-auto mt-5 shadow-lg p-5 rounded-lg"
      >
        {errors && <h4 className="text-red-400 text-center">{error}</h4>}
        <h2 className="text-center">Register</h2>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Usename</Form.Label>
          <Form.Control
            onChange={(e) => setName(e.target.value)}
            defaultValue={name}
            {...register("name")}
            type="text"
            name="name"
            placeholder="Enter Usename"
          />
          {errors?.name && (
            <p className="text-red-500 mt-1 text-sm">{errors.name.message}</p>
          )}
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            name="email"
            defaultValue={email}
            {...register("email")}
            placeholder="Enter email"
          />
          {errors?.email && (
            <p className="text-red-500 mt-1 text-sm">{errors.email.message}</p>
          )}
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            name="password"
            defaultValue={password}
            {...register("password")}
            placeholder="Password"
          />
          {errors?.password && (
            <p className="text-red-500 mt-1 text-sm">
              {errors.password.message}
            </p>
          )}
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Phone</Form.Label>
          <Form.Control
            onChange={(e) => setPhone(e.target.value)}
            type="text"
            name="password"
            value={phone}
            placeholder="Phone"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Check me out" />
        </Form.Group>
        <div className="flex justify-between">
          <Button variant="primary" type="submit">
            Register
          </Button>
          <Link
            className="px-4 py-2 border hover:text-slate-50 transition-all hover:bg-blue-400 border-blue-400 text-blue-400 rounded-lg"
            to="/login"
          >
            Login
          </Link>
        </div>
      </Form>
    </>
  );
};

export default Register;
