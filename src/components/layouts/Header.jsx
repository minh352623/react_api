// import React from "react";
import * as React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "../../redux-thunk/userSlice";
import axios from "axios";
import Cookies from "universal-cookie";
import Loader from "../Loader";

const cookies = new Cookies();

const Header = ({ check = true }) => {
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();

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

      navigate("/login");
    } catch (err) {
      navigate("/login");
    }
  }, [user]);
  if (loading) return <Loader></Loader>;
  return (
    <>
      <Navbar className="bg-white shadow-lg" expand="lg">
        <Container fluid className=" px-5 flex items-center">
          <Navbar.Brand href="#">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-xxl"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
              />
            </svg>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <div className="flex justify-around items-center flex-1">
              <Nav
                className="me-auto my-2 my-lg-0 flex gap-3 text-black"
                style={{ maxHeight: "100px" }}
                navbarScroll
              >
                <NavLink
                  className={({ isActive }) =>
                    isActive ? "text-green-500" : "text-black"
                  }
                  to="/admin"
                >
                  Home
                </NavLink>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? "text-green-500" : "text-black"
                  }
                  to="/product"
                >
                  Product
                </NavLink>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? "text-green-500" : "text-black"
                  }
                  to="/category"
                >
                  Categoty
                </NavLink>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? "text-green-500" : "text-black"
                  }
                  to="/group"
                >
                  Group
                </NavLink>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? "text-green-500" : "text-black"
                  }
                  to="/users"
                >
                  Users
                </NavLink>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? "text-green-500" : "text-black"
                  }
                  to="/slider"
                >
                  Slider
                </NavLink>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? "text-green-500" : "text-black"
                  }
                  to="/settings"
                >
                  Settings
                </NavLink>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? "text-green-500" : "text-black"
                  }
                  to="/menu"
                >
                  Menu
                </NavLink>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? "text-green-500" : "text-black"
                  }
                  to="/partner"
                >
                  Partner
                </NavLink>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? "text-green-500" : "text-black"
                  }
                  to="/discount"
                >
                  Discount
                </NavLink>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? "text-green-500" : "text-black"
                  }
                  to="/bills"
                >
                  Bills
                </NavLink>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? "text-green-500" : "text-black"
                  }
                  to="/comments"
                >
                  Comments
                </NavLink>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? "text-green-500" : "text-black"
                  }
                  to="/coupon"
                >
                  Coupon
                </NavLink>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? "text-green-500" : "text-black"
                  }
                  to="/seed"
                >
                  Seed
                </NavLink>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? "text-green-500" : "text-black"
                  }
                  to="/mission"
                >
                  Mission
                </NavLink>
              </Nav>
              {user && user != null && check ? (
                <>
                  <Nav>
                    <NavDropdown
                      className="admin"
                      title={user && "Hi ! " + user?.name}
                    >
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
                </>
              ) : (
                <>
                  <p></p>
                  <Nav className="flex gap-3 justify-end">
                    <NavLink
                      className={({ isActive }) =>
                        isActive ? "text-green-500" : "text-black"
                      }
                      to="/login"
                    >
                      Login
                    </NavLink>
                    <NavLink
                      className={({ isActive }) =>
                        isActive ? "text-green-500" : "text-black"
                      }
                      to="/register"
                    >
                      Register
                    </NavLink>
                  </Nav>
                </>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
