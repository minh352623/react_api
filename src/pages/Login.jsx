import React, { useEffect, useState } from "react";
import Header from "../components/layouts/Header";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
import Cookies from "universal-cookie";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "../redux-thunk/userSlice";
import Loader from "../components/Loader";
import HeaderClient from "../components/layouts/HeaderClient";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");
  const { user } = useSelector((state) => state.user);
  const { loading } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let user = { email, password };
    user = JSON.stringify(user);
    try {
      dispatch(setLoading(true));

      let result = await axios.post(
        "https://shoppet-tm.herokuapp.com/api/login",
        user,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(result);
      if (result?.data?.token) {
        console.log(result.data.token);
        const cookies = new Cookies();
        cookies.set("jwt", result.data.token);
        cookies.set("user", result.data.user);
        dispatch(setUser(result.data.user));
        setTimeout(() => {
          dispatch(setLoading(false));
        }, 1000);
        navigate("/home");
      }
    } catch (err) {
      setErrors("Thông tin không hợp lệ");
      dispatch(setLoading(false));
    }
  };
  const loginWithFacebook = async (e) => {
    e.preventDefault();
    window.FB.getLoginStatus((response) => {
      console.log(response.status);
      if (response.status !== "connected") {
        return window.FB.login(
          (res) => {
            if (res.status === "not_authorized") {
              return;
            }
            console.log(res);
            const accessToken = res.authResponse.accessToken;
            fbLogin(accessToken, res.authResponse);
          },
          { scope: "email" }
        );
      }
      const accessToken = response.authResponse.accessToken;
      fbLogin(accessToken, response.authResponse);
    });
  };
  const fbLogin = async (token, info) => {
    console.log(token);
    console.log(info);
    const cookies = new Cookies();
    cookies.set("jwt", token);
    const { data } = await axios.get(
      "https://graph.facebook.com/me?access_token=" + token
    );
    if (data) {
      try {
        dispatch(setLoading(true));
        let user = { name: data.name, token };

        let result = await axios.post(
          "https://shoppet-tm.herokuapp.com/api/loginWithFace",
          user,
          {
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (result) {
          result.data.token = token;
          console.log(result.data);
          cookies.set("user", result.data);
          dispatch(setUser(result.data));
          setTimeout(() => {
            dispatch(setLoading(false));
          }, 300);
          navigate("/home");
        }
      } catch (err) {
        setErrors("Thông tin không hợp lệ");
        dispatch(setLoading(false));
      }
    } else {
      alert("khong thanh cong");
    }
  };
  return (
    <>
      {loading && <Loader></Loader>}
      {!loading && (
        <>
          <HeaderClient check={false}></HeaderClient>
          <Form
            onSubmit={handleSubmit}
            className="w-[600px] mx-auto mt-5 shadow-lg p-5 rounded-lg"
          >
            <p
              onClick={loginWithFacebook}
              className="px-6 cursor-pointer text-white rounded-lg py-3 bg-blue-500"
            >
              Login with Facebook
            </p>
            <h2 className="text-center">Login</h2>
            {errors && <h4 className="text-red-400 text-center">{errors}</h4>}

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
      )}
    </>
  );
};

export default Login;
