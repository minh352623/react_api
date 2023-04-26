import React, { useEffect, useState } from "react";
import Header from "../components/layouts/Header";
import { Link, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
import Cookies from "universal-cookie";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "../redux-thunk/userSlice";
import Loader from "../components/Loader";
import Swal from "sweetalert2";
import HeaderClient from "../components/layouts/HeaderClient";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");
  const { user, faceioInstance } = useSelector((state) => state.user);
  const { loading } = useSelector((state) => state.user);
  const [urlGoogle, setUrlGoogle] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let user = { email, password };
    user = JSON.stringify(user);
    try {
      dispatch(setLoading(true));

      let result = await axios.post("https://shoppet.site/api/login", user, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
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

    const { data } = await axios.get(
      "https://graph.facebook.com/me?access_token=" + token
    );
    if (data) {
      console.log(data);
      try {
        dispatch(setLoading(true));
        let user = { name: data.name, token };
        console.log(user);
        let result = await axios.post(
          "https://shoppet.site/api/loginWithFace",
          user,
          {
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (result) {
          console.log(result);
          const cookies = new Cookies();
          cookies.set("jwt", token);
          cookies.set("user", result.data.user);
          dispatch(setUser(result.data.user));
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

  useEffect(() => {
    const getUrlGoogle = async () => {
      const result = await axios.get(`https://shoppet.site/api/auth/google`);
      if (result) {
        setUrlGoogle(result.data.url);
      }
    };
    getUrlGoogle();
  }, []);

  //xác thực gương mặt
  const faceSignIn = async () => {
    try {
      console.log(faceioInstance);
      const userData = await faceioInstance.authenticate({
        locale: "auto",
      });
      console.log(userData);
      console.log("Unique Facial ID: ", userData.facialId);
      console.log("PayLoad: ", userData.payload);

      try {
        dispatch(setLoading(true));

        let result = await axios.post(
          "https://shoppet.site/api/loginWithFaceID",
          JSON.stringify(userData.payload),
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
    } catch (errorCode) {
      console.log(errorCode);
      handleError(errorCode);
    }
  };
  const handleError = (errCode) => {
    // Log all possible error codes during user interaction..
    // Refer to: https://faceio.net/integration-guide#error-codes
    // for a detailed overview when these errors are triggered.
    // const fioErrCode={PERMISSION_REFUSED:1,NO_FACES_DETECTED:2,UNRECOGNIZED_FACE:3,MANY_FACES:4,PAD_ATTACK:5,FACE_MISMATCH:6,NETWORK_IO:7,WRONG_PIN_CODE:8,PROCESSING_ERR:9,UNAUTHORIZED:10,TERMS_NOT_ACCEPTED:11,UI_NOT_READY:12,SESSION_EXPIRED:13,TIMEOUT:14,TOO_MANY_REQUESTS:15,EMPTY_ORIGIN:16,FORBIDDDEN_ORIGIN:17,FORBIDDDEN_COUNTRY:18,UNIQUE_PIN_REQUIRED:19,SESSION_IN_PROGRESS:20},fioState={UI_READY:1,PERM_WAIT:2,PERM_REFUSED:3,PERM_GRANTED:4,REPLY_WAIT:5,PERM_PIN_WAIT:6,AUTH_FAILURE:7,AUTH_SUCCESS:8}
    switch (errCode) {
      case fioErrCode.PERMISSION_REFUSED:
        console.log("Access to the Camera stream was denied by the end user");
        break;
      case fioErrCode.NO_FACES_DETECTED:
        console.log(
          "No faces were detected during the enroll or authentication process"
        );
        break;
      case fioErrCode.UNRECOGNIZED_FACE:
        console.log("Unrecognized face on this application's Facial Index");
        break;
      case fioErrCode.MANY_FACES:
        console.log("Two or more faces were detected during the scan process");
        break;
      case fioErrCode.PAD_ATTACK:
        console.log(
          "Presentation (Spoof) Attack (PAD) detected during the scan process"
        );
        break;
      case fioErrCode.FACE_MISMATCH:
        console.log(
          "Calculated Facial Vectors of the user being enrolled do not matches"
        );
        break;
      case fioErrCode.WRONG_PIN_CODE:
        console.log("Wrong PIN code supplied by the user being authenticated");
        break;
      case fioErrCode.PROCESSING_ERR:
        console.log("Server side error");
        break;
      case fioErrCode.UNAUTHORIZED:
        console.log(
          "Your application is not allowed to perform the requested operation (eg. Invalid ID, Blocked, Paused, etc.). Refer to the FACEIO Console for additional information"
        );
        break;
      case fioErrCode.TERMS_NOT_ACCEPTED:
        console.log(
          "Terms & Conditions set out by FACEIO/host application rejected by the end user"
        );
        break;
      case fioErrCode.UI_NOT_READY:
        console.log(
          "The FACEIO Widget code could not be (or is being) injected onto the client DOM"
        );
        break;
      case fioErrCode.SESSION_EXPIRED:
        console.log(
          "Client session expired. The first promise was already fulfilled but the host application failed to act accordingly"
        );
        break;
      case fioErrCode.TIMEOUT:
        console.log(
          "Ongoing operation timed out (eg, Camera access permission, ToS accept delay, Face not yet detected, Server Reply, etc.)"
        );
        break;
      case fioErrCode.TOO_MANY_REQUESTS:
        console.log(
          "Widget instantiation requests exceeded for freemium applications. Does not apply for upgraded applications"
        );
        break;
      case fioErrCode.EMPTY_ORIGIN:
        console.log(
          "Origin or Referer HTTP request header is empty or missing"
        );
        break;
      case fioErrCode.FORBIDDDEN_ORIGIN:
        console.log("Domain origin is forbidden from instantiating fio.js");
        break;
      case fioErrCode.FORBIDDDEN_COUNTRY:
        console.log(
          "Country ISO-3166-1 Code is forbidden from instantiating fio.js"
        );
        break;
      case fioErrCode.SESSION_IN_PROGRESS:
        console.log(
          "Another authentication or enrollment session is in progress"
        );
        break;
      case fioErrCode.NETWORK_IO:
      default:
        console.log(
          "Error while establishing network connection with the target FACEIO processing node"
        );
        break;
    }
  };
  return (
    <>
      {loading && <Loader></Loader>}
      {!loading && (
        <>
          <Form
            onSubmit={handleSubmit}
            className="w-[600px] mx-auto mt-5 shadow-lg p-5 rounded-lg"
          >
            <p
              className="transition-all items-center w-full mb-2 px-6 leading-none h-fit justify-center flex hover:scale-110  gap-3 cursor-pointer text-white rounded-lg py-3 bg-slate-400"
              onClick={faceSignIn}
            >
              <span>
                <img className="w-8 h-8" src="/face-recognition.png" alt="" />
              </span>
              <span>Face Sign In</span>
            </p>
            <div className="flex flex-col gap-2 text-center mb-2">
              <p
                onClick={loginWithFacebook}
                className="transition-all px-6 items-center text-center flex justify-center leading-none h-fit hover:scale-110  gap-3 cursor-pointer m-0 text-white rounded-lg py-3 bg-blue-500"
              >
                <span className="flex items-center">
                  <i className=" leading-none flex justify-center items-center text-xl w-8 h-8 fa-brands fa-facebook"></i>
                </span>
                <span>Login with Facebook</span>
              </p>
              {urlGoogle && (
                <a
                  href={urlGoogle}
                  className="transition-all items-center  px-6 h-fit leading-none justify-center flex hover:scale-110  gap-3 cursor-pointer text-white rounded-lg py-3 bg-red-500"
                >
                  <span>
                    <i className=" leading-none  flex justify-center items-center text-xl w-8 h-8 fa-brands fa-google"></i>
                  </span>
                  <span>Login with Google</span>
                </a>
              )}
            </div>
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
            <Link to="/forgorpassword" className="my-3">
              Quên mật khẩu?
            </Link>

            <div className="flex justify-between my-2">
              <Button variant="primary" type="submit">
                Login
              </Button>
              <Link
                className="px-4 py-2 border hover:text-slate-50 transition-all hover:bg-blue-400 border-blue-400 text-blue-400 rounded-lg"
                to="/register"
              >
                Register
              </Link>
            </div>
          </Form>
        </>
      )}
    </>
  );
};

export default Login;
