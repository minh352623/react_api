import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
import Header from "../components/layouts/Header";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderClient from "../components/layouts/HeaderClient";
// import { useHistory } from "react-router-dom";
// let history = useHistory();

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    let user = { name, email, password };
    user = JSON.stringify(user);
    try {
      let result = await axios.post(
        "http://127.0.0.1:8000/api/register",
        user,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(result);
      if (result.status == 201) {
        navigate("/login");
      }
    } catch (e) {
      console.log(e.response.data.errors);
      setErrors("Thông tin không hợp lệ");
      console.log(errors);
    }
  };
  return (
    <>
      <HeaderClient check={false}></HeaderClient>

      <Form
        method="post"
        onSubmit={handleSubmit}
        className="w-[600px] mx-auto mt-5 shadow-lg p-5 rounded-lg"
      >
        {errors && <h4 className="text-red-400 text-center">{errors}</h4>}
        <h2 className="text-center">Register</h2>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Usename</Form.Label>
          <Form.Control
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            name="name"
            placeholder="Enter Usename"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            name="email"
            value={email}
            placeholder="Enter email"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            name="password"
            value={password}
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

export default Register;
