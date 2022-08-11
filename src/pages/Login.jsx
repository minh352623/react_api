import React, { useEffect, useState } from "react";
import Header from "../components/layouts/Header";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("user-info")) {
      navigate("/");
    }
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    let user = { email, password };
    console.log(user);
    user = JSON.stringify(user);
    try {
      let result = await axios.post("http://127.0.0.1:8000/api/login", user, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      const { data } = result;
      console.log(data.user);
      localStorage.setItem("user-info", JSON.stringify(data.user));
      navigate("/");
    } catch (err) {
      setErrors("Thông tin không hợp lệ");
    }
  };
  return (
    <>
      <Header></Header>
      <Form
        onSubmit={handleSubmit}
        method="post"
        className="w-[600px] mx-auto mt-5 shadow-lg p-5 rounded-lg"
      >
        {errors && <h4 className="text-red-400 text-center">{errors}</h4>}
        <h2 className="text-center">Login</h2>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            name="email"
            // value={email}
            placeholder="Enter email"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            name="password"
            // value={password}
            placeholder="Password"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Check me out" />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </>
  );
};

export default Login;
