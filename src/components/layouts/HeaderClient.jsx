import * as React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useNavigate } from "react-router-dom";
import { NavLink, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "../../redux-thunk/userSlice";
import axios from "axios";
import Cookies from "universal-cookie";
import Loader from "../Loader";
const cookies = new Cookies();

const HeaderClient = ({ check, data = [], settings = [] }) => {
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  console.log(settings);
  const handleLogout = React.useCallback(async () => {
    try {
      dispatch(setUser(null));
      cookies.remove("jwt");
      cookies.remove("user");

      const result = await axios({
        method: "get",
        url: "http://127.0.0.1:8000/api/logout",
        headers: {
          Authorization: "Bearer " + user?.token,
        },
      });
      ////console.log(result);

      navigate("/login");
    } catch (err) {
      navigate("/login");
    }
  }, [user]);
  if (loading) return <Loader></Loader>;
  return (
    <>
      <div className="header sticky">
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
                    {user && user.group_id === 1 && (
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
                        ? `http://127.0.0.1:8000${user.image}`
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
        <div className="header-bot  py-4 px-5 bg-[#72129b]">
          <div className="header-bot__info flex items-center justify-between">
            <div className="logo cursor-pointer">
              <img src="./logo.webp" alt="" />
            </div>
            <form className="header-search flex items-center">
              <input
                className="py-2 px-4 h-[44px] outline-none rounded-3xl w-[500px] rounded-r-none"
                type="text"
                name="keyword"
                placeholder="Find the best for your best"
              />
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
              <span className="cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8  hover:scale-110"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </span>
              <span className="cursor-pointer relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 hover:scale-110"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span className="absolute top-[-10px] right-[-10px] text-black w-5 h-5 flex items-center justify-center rounded-full leading-none bg-white">
                  0
                </span>
              </span>
            </div>
          </div>
          <div className="header-bot__menu mt-6 text-white">
            <div className="menu flex items-center justify-between">
              <ul className="menu__list p-0 m-0 flex gap-x-10">
                {data.length > 0 &&
                  data.map((item) => (
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

              <div className="free-ship">
                <span className="text-xl">
                  Free shipping on orders over $50
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderClient;
