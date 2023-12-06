import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import ItemDm from "../../components/ItemDm";
import Layout from "../../components/layouts/Layout";
import Swal from "sweetalert2";
import Cookies from "universal-cookie";
import { setUser } from "../../redux-thunk/userSlice";
import { useDispatch } from "react-redux";

const Coin = () => {
  const { user } = useSelector((state) => state.user);
  const [settings, setSettings] = useState();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const FetchSetting = async () => {
    setLoading(true);

    const response = await axios({
      method: "get",
      url: "https://shoppet.fun/api/setting/all",
      headers: {
        Authorization: "Bearer " + user?.token,
      },
    });
    if (response) {
      console.log(response);
      setSettings(response.data);
      setLoading(false);
    }
  };
  const FetchCheckAcCoin = async () => {
    const response = await axios({
      method: "get",
      url: "https://shoppet.fun/api/users/checkCoin/" + user?.id,
      headers: {
        Authorization: "Bearer " + user?.token,
      },
    });
    if (response) {
      const cookies = new Cookies();

      console.log(response);
      cookies.set("user", {
        ...user,
        check_attendance: response.data.check_attendance,
      });
      dispatch(
        setUser({
          ...user,
          check_attendance: response.data.check_attendance,
        })
      );
    }
  };
  useEffect(() => {
    FetchSetting();
    FetchCheckAcCoin();
  }, []);
  const formRef = useRef();
  const handleSubmit = async (e) => {
    e.preventDefault();
    let coin = formRef.current.querySelector('input[name="coin"]:checked');
    let value = 0;
    if (coin) {
      value = coin.value;
    } else {
      value = 0;
    }
    if (value > 0) {
      let formData = new FormData();
      formData.append("user_id", user?.id);
      formData.append("coin", +value);

      try {
        setLoading(true);
        const response = await axios({
          method: "post",
          url: "https://shoppet.fun/api/coin/add_dm",
          headers: {
            Authorization: "Bearer " + user?.token,
          },
          data: formData,
        });
        if (response) {
          const cookies = new Cookies();

          console.log(response);
          cookies.set("user", {
            ...user,
            attendance: response.data.dm,
            check_attendance: response.data.check_attendance,
            coin_dif: { ...user.coin_dif, coin: response.data.coin },
          });
          dispatch(
            setUser({
              ...user,
              attendance: response.data.dm,
              check_attendance: response.data.check_attendance,

              coin_dif: { ...user.coin_dif, coin: response.data.coin },
            })
          );
          setLoading(false);
          Swal.fire({
            position: "center-center",
            icon: "success",
            title: "Điểm danh thành công!",
            showConfirmButton: false,
            timer: 1000,
          });
        }
      } catch (e) {
        console.log(e);

        setLoading(false);
        Swal.fire({
          position: "center-center",
          icon: "error",
          title: "Điểm danh thất bại! Vui lòng thử lại sau",
          showConfirmButton: false,
          timer: 1000,
        });
      }
    } else {
      alert("hehehe");
    }
  };
  return (
    <Layout>
      <div className="container my-5">
        <div className="grid grid-cols-12 gap-5 items-center">
          <div className="col-span-6">
            <form ref={formRef} onSubmit={handleSubmit} action="" metho="post">
              <div className="flex gap-2 w-full my-3 justify-between">
                {settings &&
                  settings.map((item, index) => {
                    if (index >= 7 && index < 14) {
                      return <ItemDm item={item} index={index}></ItemDm>;
                    }
                  })}
              </div>
              {user?.check_attendance == 0 ? (
                <>
                  {loading && (
                    <button
                      type="submit"
                      className="w-full py-3 flex items-center justify-center text-2xl bg-orange-400 rounded-xl font-bold text-slate-50 cursor-pointer"
                    >
                      Đang xử lý...
                    </button>
                  )}
                  {!loading && (
                    <button
                      type="submit"
                      className="w-full py-3 flex items-center justify-center text-2xl bg-orange-400 rounded-xl font-bold text-slate-50 cursor-pointer"
                    >
                      Take attendance now
                    </button>
                  )}
                </>
              ) : (
                <p className="w-full py-3 flex items-center justify-center text-2xl bg-orange-400 rounded-xl font-bold text-slate-50 cursor-pointer opacity-30">
                  Come back tomorrow
                </p>
              )}
            </form>
          </div>
          <div className="col-span-6">
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-3 top-2/3 right-[30px]  shadow rounded-xl">
                <Link to="/event" className="overflow-hidden block rounded-xl">
                  <img
                    src="./minion-bikini.gif "
                    className="w-full event-image h-[160px] rounded-xl"
                    alt=""
                  />
                </Link>
                <span className=" text-event py-2 block  text-center right-0 left-0  text-red-500 font-bold">
                  Play games to receive attractive gifts
                </span>
              </div>
              <div className="col-span-3 top-1/3 right-[30px]  shadow rounded-xl">
                <Link
                  to="/eventZom"
                  className="overflow-hidden block rounded-xl"
                >
                  <img
                    src="./PvZ-1-pvz-1.jpg "
                    className="w-full event-image h-[160px] rounded-xl"
                    alt=""
                  />
                </Link>
                <span className=" text-event py-2 block  text-center right-0 left-0  text-red-500 font-bold">
                  Play games to receive attractive gifts
                </span>
              </div>
              <div className="col-span-3 top-1/3 left-[30px]  shadow rounded-xl">
                <Link
                  to="/eventShoot"
                  className="overflow-hidden block rounded-xl"
                >
                  <img
                    src="./sexye.webp"
                    className="w-full event-image h-[160px] rounded-xl"
                    alt=""
                  />
                </Link>
                <span className=" text-event py-2 block  text-center right-0 left-0  text-red-500 font-bold">
                  Play games to receive attractive gifts
                </span>
              </div>
              <div className="col-span-3 top-1/3 left-[30px]  shadow rounded-xl">
                <Link
                  to="/eventDog"
                  className="overflow-hidden block rounded-xl"
                >
                  <img
                    src="./eventd.png"
                    className="w-full event-image h-[160px] rounded-xl"
                    alt=""
                  />
                </Link>
                <span className=" text-event py-2 block  text-center right-0 left-0  text-red-500 font-bold">
                  Play games to receive attractive gifts
                </span>
              </div>
            </div>
          </div>
          <div className="col-span-6">
            <Link to="/farm">
              <img
                src="./nongtrai.png"
                className="rounded-lg cursor-pointer"
                alt=""
              />
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Coin;
