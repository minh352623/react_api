import * as React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import regeneratorRuntime from "regenerator-runtime";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useNavigate } from "react-router-dom";
import { NavLink, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setLoading,
  setSearchVoice,
  setUser,
} from "../../redux-thunk/userSlice";
import axios from "axios";
import Cookies from "universal-cookie";
import Loader from "../Loader";
import { ShowCart } from "../../redux-thunk/cartSlice";
import Notify from "../Notify";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import lodash from "lodash";
import MicroPhone from "../MicroPhone";
import Coupon from "../Coupon";
import { formatter } from "../../trait/FormatMoney";

const cookies = new Cookies();

const HeaderClient = ({ check, data = [], settings = [], fixed }) => {
  const navigate = useNavigate();
  const { carts } = useSelector((state) => state.cart);
  const [isShowInfo, setIsShowInfo] = React.useState(false);
  const { user, loading, faceioInstance } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  // console.log(settings);
  const handleLogout = React.useCallback(async () => {
    try {
      dispatch(setUser(null));
      cookies.remove("jwt");
      cookies.remove("user");

      const result = await axios({
        method: "get",
        url: "https://shoppet.site/api/logout",
        headers: {
          Authorization: "Bearer " + user?.token,
        },
      });
      ////console.log(result);
      localStorage.removeItem("coin");

      navigate("/login");
    } catch (err) {
      navigate("/login");
    }
  }, [user]);
  //nhận diện khuôn mặt

  //đăng kí gương mặt
  const faceRegistration = async () => {
    if (user) {
      try {
        const userInfo = await faceioInstance.enroll({
          locale: "auto",
          payload: {
            email: user.email,
            userId: user.id,
            username: user.name,
          },
        });
        console.log(userInfo);
        console.log("Unique Facial ID: ", userInfo.facialId);
        console.log("Enrollment Date: ", userInfo.timestamp);
        console.log("Gender: ", userInfo.details.gender);
        console.log("Age Approximation: ", userInfo.details.age);
      } catch (errorCode) {
        console.log(errorCode);
        handleError(errorCode);
      }
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

  //giọng nói\

  const [inputValue, setValueInput] = React.useState();
  // const commands = [
  //   {
  //     command: ["Go to *", "Open *"],
  //     callback: (redirectPage) => setRedirectUrl(redirectPage),
  //   },
  // ];
  const [redirectUrl, setRedirectUrl] = React.useState("");
  const { transcript, listening } = useSpeechRecognition();
  if (!SpeechRecognition.browserSupportsSpeechRecognition) {
    return null;
  }

  React.useEffect(() => {
    const searchVoice = lodash.debounce(() => {
      if (transcript) {
        console.log("tran" + transcript);
        dispatch(setSearchVoice(transcript));
        navigate("/shop");
      }
    }, 1000);
    searchVoice();
  }, [transcript]);
  //end giong noi
  if (loading) return <Loader></Loader>;

  return (
    <>
      {listening && <MicroPhone></MicroPhone>}
      <div className={`header transition-all `}>
        <div className="header-top py-1 px-5 bg-black text-white text-sm flex items-center justify-between">
          <div className="contact-left flex items-center gap-x-2">
            <div className="flex items-center gap-x-2">
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 3h5m0 0v5m0-5l-6 6M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z"
                  />
                </svg>
              </span>
              <span className="font-semibold leading-none">
                +{settings[3]?.config_value}
              </span>
            </div>
            <span className="leading-none">|</span>
            <div className="flex items-center gap-x-2">
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </span>
              <span className="font-semibold leading-none">
                {settings[4]?.config_value}
              </span>
            </div>
          </div>
          <div className="contact-right text-white flex items-center gap-x-3">
            <Link
              className="hover:text-orange-500 text-orange-100 font-semibold text-md inline-block "
              to="/contact"
            >
              Contact
            </Link>
            <span>|</span>
            <Link
              className="hover:text-orange-500 text-orange-100 font-semibold text-md inline-block "
              to="/FAQs"
            >
              FAQs
            </Link>
            {user && user != null && check ? (
              <div className="flex items-center">
                <Nav>
                  <NavDropdown
                    className="first:text-yellow-500"
                    title={user && "Hi ! " + user?.name}
                  >
                    {user && +user.group_id === 1 && (
                      <NavDropdown.Item>
                        <Link to="/admin">Admin</Link>
                      </NavDropdown.Item>
                    )}
                    <NavDropdown.Item onClick={handleLogout}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </Nav>
                <span>
                  <img
                    src={
                      user.image
                        ? `${user.image}`
                        : "https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png"
                    }
                    className="w-10 h-10 object-cover rounded-full shadow-lg"
                    alt=""
                  />
                </span>
              </div>
            ) : (
              <>
                <p></p>
                <Nav className="flex gap-3 justify-end text-white font-semibold">
                  <NavLink
                    className={({ isActive }) =>
                      isActive ? "text-orange-500" : "text-white"
                    }
                    to="/login"
                  >
                    Login
                  </NavLink>
                  <NavLink
                    className={({ isActive }) =>
                      isActive ? "text-orange-500" : "text-white "
                    }
                    to="/register"
                  >
                    Register
                  </NavLink>
                </Nav>
              </>
            )}
          </div>
        </div>
        <div
          className={`header-bot  ${
            fixed ? "fixed top-0 left-0 right-0 z-50" : ""
          }  py-2 px-5 bg-[#72129b] `}
        >
          <div className="header-bot__info flex items-center justify-between">
            <div className="logo cursor-pointer">
              <img src="../logo.webp" alt="" />
            </div>
            <form className="header-search flex items-center">
              <div className="relative">
                <input
                  id="transcript"
                  value={transcript}
                  className="py-2 px-4 h-[44px] outline-none rounded-3xl w-[500px] rounded-r-none"
                  type="text"
                  onChange={(e) => setValueInput(e.target.value)}
                  name="keyword"
                  placeholder="Find the best for your best"
                />

                <span className="absolute top-1/2 -translate-y-1/2 hover:bg-slate-400 rounded-full cursor-pointer hover:text-slate-50 transition-all p-2 text-slate-900 right-0 ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-6 h-6"
                    onClick={() => {
                      dispatch(setSearchVoice(null));


                      SpeechRecognition.startListening({ language: "vi-VN" });


                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
                    />
                  </svg>
                </span>
              </div>
              <button className="py-2 px-4 rounded-3xl bg-[#101010] rounded-l-none text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </form>
            <div className="flex items-center gap-x-3 text-white">
              {user && (
                <>
                  <button
                    className="transition-all px-6 leading-none h-fit inline-flex hover:scale-110  gap-3 cursor-pointer text-white rounded-lg py-3 bg-orange-500"
                    onClick={faceRegistration}
                  >
                    Face Registration
                  </button>
                  <Coupon></Coupon>
                  <Notify></Notify>
                </>
              )}
              <div className="cursor-pointer relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8  hover:scale-110"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  onClick={() => setIsShowInfo((isShowInfo) => !isShowInfo)}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                {isShowInfo && (
                  <ul className="absolute z-10 p-0 w-[200px] rounded-lg right-0 bg-gray-300">
                    <li className="text-center">
                      <Link
                        to="/"
                        className="text-slate-900 rounded-lg hover:text-white hover:bg-orange-400 p-2 block"
                      >
                        Đổi mật khẩu
                      </Link>
                    </li>
                    <li className="text-center">
                      <Link
                        to="/info"
                        className="text-slate-900 rounded-lg hover:text-white hover:bg-orange-400 p-2 block"
                      >
                        Thông tin cá nhân
                      </Link>
                    </li>
                    <li className="text-center">
                      <Link
                        to="/mybill"
                        className="text-slate-900 rounded-lg hover:text-white hover:bg-orange-400 p-2 block"
                      >
                        Đơn hàng của tôi
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
              <span className="cursor-pointer icon-cart relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 hover:scale-110"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  onClick={() => dispatch(ShowCart(true))}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span className="absolute top-[-10px] right-[-10px] text-black w-5 h-5 flex items-center justify-center rounded-full leading-none bg-white">
                  {carts ? carts.length : 0}
                </span>
              </span>
            </div>
          </div>
          <div className="header-bot__menu mt-2 text-white">
            <div className="menu flex items-center justify-between">
              <ul className="menu__list p-0 m-0 flex gap-x-10">
                {data?.length > 0 &&
                  data?.map((item) => (
                    <li key={item.id}>
                      <Link
                        className="text-xl no-underline transi hover:text-orange-500 text-orange-50 font-semibold"
                        to={`/${item.name.toLowerCase()}`}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
              </ul>

              {user && (
                <div className="free-ship flex items-center">
                  <span className="text-xl font-semibold">
                    {formatter.format(
                      user?.coin_dif ? +user?.coin_dif?.coin : 0
                    )}
                  </span>
                  <span className="text-xl">
                    <img src="./coin2.gif" className="w-[30px]" alt="" />
                  </span>
                  <Link
                    to="/coin"
                    className="text-2xl p-2 bg-orange-500 text-white rounded-lg leading-none"
                  >
                    +
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderClient;
