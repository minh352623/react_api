import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import ItemStore from "../../modules/farm/ItemStore";
import Swal from "sweetalert2";
import Cookies from "universal-cookie";
import { setUser } from "../../redux-thunk/userSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import CountDown from "../../components/CountDown";
import Rain from "../../components/Rain";
import ItemDm from "../../components/ItemDm";
import ItemDmRain from "../../components/ItemDmRain";
import ItemMission from "../../components/ItemMission";
import Loading from "../../components/Loading";
import ItemFriend from "../../components/ItemFriend";

const Farm = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [showStore, setShowStore] = useState(false);
  const kettle = useRef();
  const seed = useRef();
  const rain = useRef();

  const [store, setStore] = useState();
  const [loading, setLoading] = useState(false);
  const FetchStore = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://shoppet.site/api/seed/getAll`, {
        headers: { Authorization: "Bearer " + user?.token },
      });
      if (response) {
        setStore(response.data);
        setLoading(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleWater = async () => {
    if (seedUser) {
      if (+waterUser > 0) {
        if (+seedUser.water_contributed == +seedUser.water_cost) {
          Swal.fire({
            position: "center-center",
            icon: "error",
            title: "Cây đã đủ nước!",
            showConfirmButton: false,
            timer: 1000,
          });
        } else {
          kettle.current.classList.add("animate_kettle");
          setTimeout(async () => {
            let myAudio = new Audio("mixkit-pouring-a-small-drink-142.wav");
            rain.current.classList.remove("invisible");
            myAudio.play();
            kettle.current.classList.remove("animate_kettle");
            try {
              const formData = new FormData();
              formData.append("user_id", user?.id);
              const response = await axios({
                method: "post",
                url: "https://shoppet.site/api/seed/handleWatering",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + user?.token,
                },
                data: formData,
              });
              console.log(response);
              FetchSeedUser();
              FetchWaterUser();
              rain.current.classList.add("invisible");
            } catch (e) {
              console.log(e);
            }
          }, 2500);
          setTimeout(function () {
            myAudio.pause();
          }, 3000);
        }
      } else {
        Swal.fire({
          position: "center-center",
          icon: "error",
          title: "Số nước không đủ!",
          showConfirmButton: false,
          timer: 1000,
        });
      }
    } else {
      Swal.fire({
        position: "center-center",
        icon: "error",
        title: "Ban chưa trồng cây!",
        showConfirmButton: false,
        timer: 1000,
      });
    }
  };
  const handleSeed = () => {
    seed.current.classList.add("animate_kettle");

    setTimeout(() => {
      let myAudio = new Audio("pb.wav");
      myAudio.play();
      seed.current.classList.remove("animate_kettle");
      seed.current.parentElement.parentElement.classList.add("invisible");
    }, 2800);
    setTimeout(() => {
      myAudio.pause();
    });
  };

  const addSeedUser = async (id, water_cost, coin_cost) => {
    const formData = new FormData();
    formData.append("id_seed", id);
    formData.append("water_cost", water_cost);
    formData.append("coin_cost", coin_cost);
    formData.append("user_id", user?.id);

    try {
      const response = await axios({
        method: "post",
        url: "https://shoppet.site/api/seed/add_user",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user?.token,
        },
        data: formData,
      });
      console.log(response);
      if (response.status == 202) {
        Swal.fire({
          position: "center-center",
          icon: "error",
          title: response.data.message,
          showConfirmButton: false,
          timer: 1000,
        });
      } else {
        seed.current.click();
        seed.current.parentElement.parentElement.classList.remove("invisible");
        setShowStore(false);
        const cookies = new Cookies();
        cookies.set("user", {
          ...user,
          coin_dif: {
            ...user.coin_dif,
            coin: +response.data.coin_user.coin,
          },
        });
        dispatch(
          setUser({
            ...user,
            coin_dif: {
              ...user.coin_dif,
              coin: +response.data.coin_user.coin,
            },
          })
        );
        setTimeout(() => {
          FetchSeedUser();
        }, 2800);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const [seedUser, setSeedUser] = useState();
  const [waterUser, setWaterUser] = useState();
  const widthPercent = useRef();
  const FetchSeedUser = async () => {
    try {
      const response = await axios({
        method: "get",
        url: "https://shoppet.site/api/seed/getSeedUser/" + user?.id,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user?.token,
        },
      });
      if (response) {
        console.log(response);
        if (response?.data?.data) {
          const width = parseFloat(
            (+response.data.data.water_contributed /
              +response.data.data.water_cost) *
              100
          ).toFixed(0);
          console.log(width);
          widthPercent.current
            ? (widthPercent.current.style.width = `${width}%`)
            : "";
        } else {
          console.log(0);
          widthPercent.current ? (widthPercent.current.style.width = `0%`) : "";
        }
        setSeedUser(response.data.data);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const FetchWaterUser = async () => {
    try {
      const response = await axios({
        method: "get",
        url: "https://shoppet.site/api/seed/getWaterUser/" + user?.id,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user?.token,
        },
      });
      if (response) {
        console.log(response);

        setWaterUser(response.data.data);
      }
    } catch (e) {
      console.log(e);
    }
  };
  let myAudio = new Audio("mixkit-lo-fi-05-767.mp3");
  if (typeof myAudio.loop == "boolean") {
    myAudio.loop = true;
  } else {
    // myAudio.addEventListener(
    //   "ended",
    //   function () {
    //     this.currentTime = 0;
    //     this.play();
    //   },
    //   false
    // );
  }
  const [audioBg, setAudioBg] = useState(false);
  const play_audio_bg = function () {
    setAudioBg(true);
    myAudio.play();
  };
  const pause_audio_bg = function () {
    setAudioBg(false);
    myAudio.pause();
  };
  const [settings, setSettings] = useState();

  const FetchSetting = async () => {
    const response = await axios({
      method: "get",
      url: "https://shoppet.site/api/setting/all",
      headers: {
        Authorization: "Bearer " + user?.token,
      },
    });
    if (response) {
      console.log(response);
      setSettings(response.data);
    }
  };
  const FetchCheckAcRain = async () => {
    const response = await axios({
      method: "get",
      url: "https://shoppet.site/api/users/checkRain/" + user?.id,
      headers: {
        Authorization: "Bearer " + user?.token,
      },
    });
    if (response) {
      const cookies = new Cookies();

      console.log(response);
      cookies.set("user", {
        ...user,
        check_attendance_rain: response.data.check_attendance_rain,
      });
      dispatch(
        setUser({
          ...user,
          check_attendance_rain: response.data.check_attendance_rain,
        })
      );
    }
  };

  //call nhiệm vụ
  const [missions, setMissions] = useState();
  const FetchMissions = async () => {
    setLoading(true);
    const response = await axios({
      method: "get",
      url: "https://shoppet.site/api/mission/getAll",
      headers: {
        Authorization: "Bearer " + user?.token,
      },
    });
    if (response) {
      setMissions(response.data);
      setLoading(false);
    }
  };
  const [missUser, setMissionUser] = useState();
  const FetchMissUser = async () => {
    try {
      setLoading(true);
      const response = await axios({
        method: "get",
        url: "https://shoppet.site/api/mission/mission_user/" + user?.id,
        headers: {
          Authorization: "Bearer " + user?.token,
        },
      });
      if (response) {
        console.log(response);
        setMissionUser(response.data);
        setLoading(false);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const FetchDataPage = async () => {
    await FetchStore();

    await FetchCheckAcRain();
    await FetchSeedUser();
    await FetchWaterUser();
    await FetchSetting();
    await FetchMissions();
    await FetchMissUser();
  };
  useEffect(() => {
    FetchDataPage();
    return () => {};
  }, [widthPercent.current]);
  const handleHarvest = async () => {
    try {
      const formData = new FormData();
      formData.append("user_id", user?.id);
      const response = await axios({
        method: "post",
        url: "https://shoppet.site/api/seed/harvest",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user?.token,
        },
        data: formData,
      });
      if (response) {
        const cookies = new Cookies();
        cookies.set("user", {
          ...user,
          coin_dif: {
            ...user.coin_dif,
            coin: +user.coin_dif.coin + +response.data,
          },
        });
        dispatch(
          setUser({
            ...user,
            coin_dif: {
              ...user.coin_dif,
              coin: +user.coin_dif.coin + +response.data,
            },
          })
        );
        Swal.fire({
          position: "center-center",
          icon: "success",
          title: `Ban đã nhân được ${response.data} xu!`,
          showConfirmButton: false,
          timer: 1500,
        });
        FetchSeedUser();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const [mission, setShowMission] = useState(false);
  //incre rain
  const fromRain = useRef();
  const handleIncreRain = async function (e) {
    e.preventDefault();
    const rain = fromRain.current.querySelector('input[name="rain"]').value;
    console.log(rain);
    if (+rain > 0) {
      let formData = new FormData();
      formData.append("user_id", user?.id);
      formData.append("water", +rain);

      try {
        setLoading(true);
        const response = await axios({
          method: "post",
          url: "https://shoppet.site/api/users/add_water",
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
            check_attendance_rain: response.data.check_attendance_rain,
            attendance_rain: response.data.rain,
          });
          dispatch(
            setUser({
              ...user,
              check_attendance_rain: response.data.check_attendance_rain,
              attendance_rain: response.data.rain,
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
          FetchWaterUser();
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
  //friend
  const [showFriend, setShowFriend] = useState(false);
  const [friends, setFriends] = useState();

  const FetchFriend = async () => {
    try {
      setLoading(true);
      const response = await axios({
        method: "get",
        url: "https://shoppet.site/api/seed/friend",
        headers: {
          Authorization: "Bearer " + user?.token,
        },
      });
      if (response) {
        console.log(response);
        setFriends(response.data);
        setLoading(false);
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <>
      {showFriend && (
        <div className="bg-[rgba(0,0,0,0.3)] transition-all fixed z-[999] m-auto flex items-center justify-center top-0 bottom-0 left-0 right-0 ">
          <div className="vp rounded-lg w-[50%] z-[999] m-auto bg-slate-50 h-[90%]">
            <div className="header_vp leading-none items-center flex justify-between h-[8%] px-4 py-2 bg-orange-500 rounded-t-lg text-xl text-slate-50 text-center font-bold">
              <span></span>
              <span>Danh sách bạn bè đang chơi nông trại</span>
              <span
                onClick={() => setShowFriend(false)}
                className="block cursor-pointer hover:text-blue-500"
              >
                Đóng
              </span>
            </div>

            <div className="bg-orange-100 px-5 py-3 h-[92%] overflow-y-auto">
              <div className="grid grid-cols-12 gap-3">
                {loading && (
                  <div className="text-center flex justify-center items-center">
                    <Loading></Loading>
                  </div>
                )}
                {!loading &&
                  friends &&
                  friends.map((item) => (
                    <ItemFriend key={item.id} item={item}></ItemFriend>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="bg_farm w-screen h-screen relative">
        {audioBg ? (
          <p
            onClick={() => {
              console.log("audio");
              pause_audio_bg();
            }}
            className="px-4 py-2 cursor-pointer rounded-lg bg-orange-500 inline-block mt-3 text-slate-50 ml-3"
          >
            Tat nhạc
          </p>
        ) : (
          <p
            onClick={() => {
              console.log("audio");
              play_audio_bg();
            }}
            className="px-4 py-2 cursor-pointer rounded-lg bg-orange-500 inline-block mt-3 text-slate-50 ml-3"
          >
            Bật nhạc
          </p>
        )}
        {mission && (
          <div className="bg-[rgba(0,0,0,0.3)] transition-all fixed z-[100] m-auto flex items-center justify-center top-0 bottom-0 left-0 right-0 ">
            <div className="vp rounded-lg w-[90%] m-auto bg-slate-50 h-[90%]">
              <div className="header_vp flex justify-between h-[8%] px-4 py-2 bg-orange-500 rounded-t-lg text-xl text-slate-50 text-center font-bold">
                <span></span>
                <span className="text-uppercase">Nhận thêm nước</span>
                <span
                  onClick={() => setShowMission(false)}
                  className="block cursor-pointer hover:text-blue-500"
                >
                  Đóng
                </span>
              </div>

              <div className="bg-orange-100 px-5 py-3 h-[92%] rounded-b-lg overflow-y-auto">
                {loading ? (
                  <Loading></Loading>
                ) : (
                  <>
                    <div className="bg-slate-50 px-6 py-2">
                      <p className="text-orange-600 font-semibold pl-2">
                        Nhận thêm xu,vật phẩm và nước
                      </p>
                      <form ref={fromRain} action="" onSubmit={handleIncreRain}>
                        <div className="flex  gap-3">
                          {settings &&
                            settings.map((item, index) => {
                              if (index >= 14) {
                                console.log("index", index);
                                return (
                                  <ItemDmRain
                                    index={index}
                                    item={item}
                                    key={item.id}
                                  ></ItemDmRain>
                                );
                              }
                            })}
                        </div>
                        <div className="text-center flex justify-center">
                          {user?.check_attendance_rain == 0 ? (
                            <button
                              type="submit"
                              className="px-6 py-2 w-2/3  rounded-2xl bg-orange-500 text-slate-50 font-bold "
                            >
                              {loading ? "Đang xử lý" : "Nhận thưởng"}
                            </button>
                          ) : (
                            <p className="px-6 py-2 w-2/3  rounded-2xl bg-orange-500 text-slate-50 font-bold opacity-60">
                              Quay lại ngày mai
                            </p>
                          )}
                        </div>
                      </form>
                    </div>
                    <div className="grid grid-cols-12 gap-3 my-2">
                      {missions &&
                        missUser &&
                        missions.map((item, index) => {
                          localStorage.setItem("check_empty", 0);
                          let data = "";
                          let check = 0;
                          missUser?.map((item2) => {
                            if (item2.mission_id == item.id) {
                              data = item2;
                            }
                            if (
                              item2.mission_id == item.id &&
                              item2.received == 1
                            ) {
                              check = 1;
                              return;
                            }
                          });
                          if (check == 0) {
                            localStorage.setItem("check_empty", index + 1);
                            return (
                              <ItemMission
                                FetchFriend={FetchFriend}
                                FetchWaterUser={FetchWaterUser}
                                FetchMissUser={FetchMissUser}
                                setShowFriend={setShowFriend}
                                missuser={data}
                                item={item}
                                key={item.id}
                              ></ItemMission>
                            );
                          }
                        })}
                      {(missUser && !localStorage.getItem("check_empty")) ||
                      +localStorage.getItem("check_empty") == 0 ? (
                        <div className="col-span-12">
                          <h2 className="text-green-500">
                            Chúc mừng bạn đã hoàn thành nhiệm vụ hôm nay!
                          </h2>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
        {showStore && (
          <div className="bg-[rgba(0,0,0,0.3)] transition-all fixed z-[100] m-auto flex items-center justify-center top-0 bottom-0 left-0 right-0 ">
            <div className="vp rounded-lg w-[90%] m-auto bg-slate-50 h-[90%]">
              <div className="header_vp flex justify-between h-[8%] px-4 py-2 bg-orange-500 rounded-t-lg text-xl text-slate-50 text-center font-bold">
                <span></span>
                <span>Vật phẩm</span>
                <span
                  onClick={() => setShowStore(false)}
                  className="block cursor-pointer hover:text-blue-500"
                >
                  Đóng
                </span>
              </div>
              <div className="flex h-[8%] gap-3 px-4 py-2 text-center justify-center shadow-xl">
                <span className="font-bold text-orange-500 cursor-pointer">
                  Cửa hàng
                </span>
                <span className="font-bold cursor-pointer">Kho</span>
              </div>
              <div className="bg-orange-100 px-5 py-3 h-[84%] overflow-y-auto">
                <div className="grid grid-cols-12 gap-3">
                  {store &&
                    store.map((item) => (
                      <ItemStore
                        addSeedUser={addSeedUser}
                        item={item}
                        key={item.id}
                      ></ItemStore>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="store absolute top-[10%] p-3 left-[5%] bg-slate-50 flex items-center justify-center rounded-full">
          <img
            onClick={() => setShowStore(true)}
            className="w-[100px] cursor-pointer"
            src="./shopping-bag.png"
            alt=""
          />
        </div>
        <Link
          to="/home"
          className="store shadow-xl absolute top-[55%] p-3 left-[5%] bg-slate-50 flex items-center justify-center rounded-full"
        >
          <img className="w-[100px] cursor-pointer" src="./house.png" alt="" />
        </Link>
        <div className="absolute z-10 bottom-[50%] right-[100px] w-[150px] h-[150px] p-3 cursor-pointer bg-slate-50 rounded-full flex items-center justify-center">
          <div className="flex flex-col items-center ">
            <img
              src="./bucket.png"
              className="w-[100px]  bottom-[80px] bucket"
              alt=""
            />
            <p className="px-4 m-0 py-1 w-[120px] bg-slate-50 rounded-2xl flex  items-center justify-center gap-1 absolute top-[-40px] shadown ">
              <span className="text-2xl text-orange-400 font-bold">50</span>
              <span className="block">
                <img className="w-[100px] block" src="./drop.png" alt="" />
              </span>
            </p>
            <div className="absolute -bottom-[30%] left-1/2 -translate-x-1/2 ">
              <CountDown FetchWaterUser={FetchWaterUser}></CountDown>
            </div>
          </div>
        </div>
        <div className="absolute z-10 bottom-[50px] right-[100px] w-[150px] h-[150px] p-3 cursor-pointer bg-slate-50 rounded-full flex items-center justify-center">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-25"></span>
          <div className="flex flex-col items-center ">
            <img
              ref={kettle}
              src="./kettle.png"
              onClick={handleWater}
              className="w-[100px] fixed bottom-[80px]"
              alt=""
            />
            <p className="px-4 m-0 py-1 w-[150px] bg-slate-50 rounded-2xl flex  items-center justify-center gap-1 absolute bottom-[-20px] ">
              <span className="text-2xl text-orange-400 font-bold">
                {waterUser ? waterUser : 0}
              </span>
              <span className="block">
                <img className="w-[50px] block" src="./drop.png" alt="" />
              </span>
            </p>
          </div>
        </div>
        <div className="invisible  transotion-all duration-500 z-10 absolute bottom-[50px] right-[50px] w-[150px] h-[150px] p-3 cursor-pointer  rounded-full flex items-center justify-center">
          <div className="flex flex-col items-center ">
            <img
              ref={seed}
              src="./seeds.png"
              onClick={handleSeed}
              className="w-[100px] fixed bottom-[320px] transition-all duration-500"
              alt=""
            />
          </div>
        </div>
        <div className="absolute z-10 bottom-[50px] left-1/4 w-[150px] h-[150px] p-3 cursor-pointer bg-slate-50 rounded-full flex items-center justify-center">
          <div
            onClick={() => setShowMission(true)}
            className="flex flex-col items-center "
          >
            <img
              src="./drop.png"
              className="w-[100px] fixed bottom-[80px]"
              alt=""
            />
            <p className="px-2 m-0 py-1 text-blue-500 font-bold w-[120px] bg-slate-50 rounded-2xl flex  items-center justify-center gap-1 absolute bottom-[-20px] ">
              Thêm nước
            </p>
          </div>
        </div>
        {seedUser && (
          <div className="flex flex-col fixed bottom-[50px] left-1/2 -translate-x-1/2">
            <div ref={rain} className="invisible absolute right-[50px] top-0">
              <Rain></Rain>
            </div>
            <p className="m-0 overflow-y-hidden w-[350px] flex justify-center">
              {+seedUser.water_contributed == +seedUser.water_cost ? (
                <img
                  src={seedUser.seed.img_3}
                  alt=""
                  className="w-[300px] animation_img_3 "
                />
              ) : +seedUser.water_contributed > +seedUser.water_cost / 2 ? (
                <img
                  src={seedUser.seed.img_2}
                  alt=""
                  className="w-[300px] animate_seed_new"
                />
              ) : (
                <img
                  src={seedUser.seed.img}
                  alt=""
                  className="w-[300px] animate_seed_new"
                />
              )}
            </p>

            {+seedUser.water_contributed == +seedUser.water_cost ? (
              <p
                onClick={handleHarvest}
                className="px-6 py-3 text-xl cursor-pointer rounded-xl mt-1 bg-orange-600 text-slate-50 font-bold text-center"
              >
                Thu hoạch ngay
              </p>
            ) : (
              <p
                className={`
                      py-3 text-slate-50 relative transition-all   mt-1 rounded-xl bg-orange-700
                  `}
              >
                <p
                  ref={widthPercent}
                  className={`absolute transition-all top-0 h-full  bg-blue-400 rounded-xl`}
                ></p>
                <div className="absolute flex items-center gap-1 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
                  <span>
                    {seedUser.water_contributed
                      ? +seedUser.water_cost - +seedUser.water_contributed
                      : seedUser.water_cost}
                  </span>
                  <span>
                    <img src="./drop.png" className="w-[15px]" alt="" />
                  </span>
                  <span>Kết trái</span>
                </div>
              </p>
            )}
          </div>
        )}
        {!seedUser ? (
          <div
            onClick={() => setShowStore(true)}
            className="fixed bottom-[50px] left-1/2 -translate-x-1/2  text-center flex justify-center flex-col itemx-center bg-orange-700 text-slate-50 px-10 py-2 rounded-lg font-bold text-2xl cursor-pointer"
          >
            <p className="text-center m-0 flex justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-8 h-8 animate-bounce"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"
                />
              </svg>
            </p>
            Trồng cây mới
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default Farm;
