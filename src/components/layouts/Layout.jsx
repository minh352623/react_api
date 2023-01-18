import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import HeaderClient from "./HeaderClient";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../Loading";
import Loader from "../Loader";
import FooterClient from "./FooterClient";
import { Link } from "react-router-dom";
import {
  handleAddCart,
  handleDeleteCart,
  handleFetchCart,
  SetCart,
  ShowCart,
} from "../../redux-thunk/cartSlice";
import { formatter } from "../../trait/FormatMoney";
import ReactDOM from "react-dom";

const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  console.log(user);

  const { isShowCart, carts } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const containerCart = useRef(null);
  const contentCart = useRef(null);
  const [menus, setMenus] = useState();
  const [settings, setSettings] = useState();
  const [loading, setLoading] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const ScrollTop = useRef();
  const hiddenCart = (e) => {
    if (
      !contentCart.current.contains(e.target) &&
      !e.target.matches(".icon-cart svg")
    ) {
      dispatch(ShowCart(false));
    }
  };

  const FetchMenu = async () => {
    setLoading(true);
    const response = await axios({
      method: "get",
      url: "https://shoppet.site/api/menu/all",
      headers: {
        Authorization: "Bearer " + user?.token,
      },
    });
    if (response) {
      setMenus(response.data);
      setLoading(false);
    }
  };
  const FetchSetting = async () => {
    setLoading(true);

    const response = await axios({
      method: "get",
      url: "https://shoppet.site/api/setting/all",
      headers: {
        Authorization: "Bearer " + user?.token,
      },
    });
    if (response) {
      setSettings(response.data);
      setLoading(false);
    }
  };
  const Fetch = async () => {
    await FetchMenu();
    await FetchSetting();
  };
  const scrollTop = () => {
    window.scrollTo(0, 0);
  };
  const showScrollTop = () => {
    if (window.scrollY > 50) {
      setIsFixed(true);
      ScrollTop.current.style.visibility = "visible";
    } else {
      setIsFixed(false);

      ScrollTop.current.style.visibility = "hidden";
    }
  };
  useEffect(() => {
    if (user) {
      Fetch();
    }
    dispatch(handleFetchCart());
    ScrollTop.current.addEventListener("click", scrollTop);
    window.addEventListener("scroll", showScrollTop);
    containerCart.current.addEventListener("click", hiddenCart);
    return () => {
      ScrollTop.current?.removeEventListener("click", scrollTop);
      window.removeEventListener("scroll", showScrollTop);
      containerCart.current?.removeEventListener("click", hiddenCart);
    };
  }, [dispatch, user]);

  const sumCart = () => {
    let sum = 0;
    if (carts) {
      carts.map((item) => {
        sum += parseFloat(item.total);
      });
    }
    return sum;
  };
  return (
    <div className="overflow-x-hidden">
      {loading && <Loader></Loader>}
      {menus && settings && !loading && (
        <HeaderClient
          fixed={isFixed}
          settings={settings}
          data={menus}
          check
        ></HeaderClient>
      )}
      {!loading && children}

      {settings && <FooterClient settings={settings}></FooterClient>}

      <div
        ref={ScrollTop}
        className="scroll-top border z-[100] bg-slate-100  fixed bottom-[24px] right-[200px] hover:bg-orange-500 hover:text-white border-2 p-2 rounded-full border-slate-900 hover:border-orange-500 cursor-pointer"
      >
        <span className="">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 15.75l7.5-7.5 7.5 7.5"
            />
          </svg>
        </span>
      </div>
      <div
        ref={containerCart}
        className={`container-cart ${
          isShowCart ? "visible" : "invisible"
        } fixed top-0 transition-all z-[100] duration-300 cursor-pointer bottom-0 left-0 right-0 bg-[rgba(0,0,0,0.3)]`}
      >
        <div
          ref={contentCart}
          className={`${
            isShowCart ? "" : "translate-x-full"
          } cart p-3 w-[400px] h-full bg-white absolute right-0 z-20 transition-all duration-300`}
        >
          <div className="cart-header border-b h-[5vh] flex items-center justify-between">
            <h4>Your cart</h4>
            <span className="text-[#ed6436]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#ed6436"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 cursor-pointer hover:scale-110"
                onClick={() => dispatch(ShowCart(false))}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 19.5l15-15m-15 0l15 15"
                />
              </svg>
            </span>
          </div>
          <div className="py-3 cart-center flex flex-col gap-3 h-[75vh] overflow-auto">
            {carts &&
              carts.map((item) => (
                <div
                  key={item.id}
                  className="cart-item flex items-center gap-3 justify-between pb-3 border-b"
                >
                  <div className="image w-[100px] h-[100px] border rounded-lg">
                    <img
                      className="w-full h-full object-cover"
                      src={`${item.file_path}`}
                      alt=""
                    />
                  </div>
                  <div className="info">
                    <p className="name m-0">{item.name}</p>
                    <p className="price my-2 font-bold text-orange-500">
                      {formatter.format(item.price)}
                    </p>
                    <div className="in_de border flex rounded-2xl px-3 justify-between py-1  w-[120px]">
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          // onClick={() => addToCart(item.id, -1)}
                          onClick={() =>
                            dispatch(
                              handleAddCart({ idpro: item.id, number: -1 })
                            )
                          }
                          className="cursor-pointer hover:scale-125 font-bold hover:text-orange-500 w-6 h-6"
                        >
                          <path strokeLinecap="round" d="M5 12h14" />
                        </svg>
                      </span>
                      <span>{item.number}</span>
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          // onClick={() => addToCart(item.id, 1)}
                          onClick={() =>
                            dispatch(
                              handleAddCart({ idpro: item.id, number: 1 })
                            )
                          }
                          className="cursor-pointer hover:scale-125 font-bold hover:text-orange-500 w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 5v14m7-7H5"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                  <span className="mr-[12px]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      onClick={() =>
                        dispatch(handleDeleteCart({ idpro: item.id }))
                      }
                      className="w-6 h-6 hover:text-orange-500 hover:scale-110"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 19.5l15-15m-15 0l15 15"
                      />
                    </svg>
                  </span>
                </div>
              ))}
          </div>
          <div className="h-[20vh] py-2">
            <div className="subtitle flex justify-between ">
              <span className="font-bold">Subtotal</span>
              <span className="text-orange-600 font-bold">
                {carts ? formatter.format(sumCart()) : 0}
              </span>
            </div>
            <p className="text-gray-400">
              Tax included. Shipping calculated at checkout.
            </p>
            <div className="buttons-cart mt-4 flex gap-2">
              <div className="view-cart">
                <Link
                  className="border-2 border hover:border-orange-500 border-gray-500 hover:text-orange-500 transition-all text-slate-900 font-bold rounded-3xl px-5 py-2"
                  to="/cart"
                >
                  View Cart
                </Link>
              </div>
              <div className="view-cart">
                <Link
                  className="border-2  text-white bg-orange-500 hover:bg-slate-900 font-bold rounded-3xl px-5 py-2 transition-al"
                  to="checkout"
                >
                  Check out
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
