import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import Cookies from "universal-cookie";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Rain from "../../components/Rain";
import Loading from "../../components/Loading";
import Cannon from "../../components/Cannon";
import { toast } from "react-toastify";

const FriendFarm = () => {
  const { user } = useSelector((state) => state.user);

  const kettle = useRef();

  const [loading, setLoading] = useState(false);

  const [seedUser, setSeedUser] = useState();
  const widthPercent = useRef();
  const FetchSeedUser = async () => {
    let friend = JSON.parse(localStorage.getItem("friend_mission"));
    try {
      const response = await axios({
        method: "get",
        url: "https://shoppet.site/api/seed/getSeedUser/" + friend?.user_id,
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
        console.log("asdasd");
      }
    } catch (e) {
      console.log(e);
    }
  };
  const cannon = useRef();
  const bomb = useRef();

  useEffect(() => {
    FetchSeedUser();
    return () => {};
  }, [seedUser?.water_contributed]);
  const handleCannon = () => {
    if (
      !localStorage.getItem("cannon") ||
      +localStorage.getItem("cannon") < 3
    ) {
      if (!localStorage.getItem("cannon")) {
        localStorage.setItem("cannon", 1);
      } else {
        let number = +JSON.parse(localStorage.getItem("cannon")) + 1;
        localStorage.setItem("cannon", number);
      }
      let myAudio = new Audio("../cannon-shot-14799.mp3");
      myAudio.play();
      cannon.current.classList.add("animation_cannon");
      bomb.current.classList.add("animation_bomb");
      bomb.current.classList.remove("invisible");
      setTimeout(() => {
        cannon.current.classList.remove("animation_cannon");
      }, 1000);
      setTimeout(async () => {
        bomb.current.classList.remove("animation_bomb");
        bomb.current.classList.add("invisible");
        //calcalate

        try {
          const friend = JSON.parse(localStorage.getItem("friend_mission"));
          const mission = JSON.parse(localStorage.getItem("mission_neighbor"));
          console.log(friend);
          console.log(mission);
          if (friend && mission) {
            const formData = new FormData();
            formData.append("user_id", user?.id);
            formData.append("mission_id", mission?.id);
            formData.append("energy_miss", mission?.energy);

            formData.append("user_friend", friend?.user_id);

            const response = await axios({
              method: "post",
              url: "https://shoppet.site/api/mission/calculate_friend",
              headers: {
                Authorization: "Bearer " + user?.token,
              },
              data: formData,
            });
            console.log(response);
            if (response.data?.message) {
              toast.error(
                `Nhà của ${friend?.user?.name} không còn gì để phá!`,
                {
                  position: "top-center",
                  autoClose: 1000,
                }
              );
            } else {
              FetchSeedUser();
              toast.success(`Nhà của ${friend?.user?.name} đã bị bắn!`, {
                position: "top-center",
                autoClose: 1000,
              });
            }
          } else {
            toast.warning("Lối xảy ra! Vui lòng thử lại sau", {
              position: "top-left",
              autoClose: 1000,
            });
          }
        } catch (e) {
          console.log(e);
        }
      }, 1000);
    } else {
      toast.warning("Bạn đã hết lượt bắn!", {
        position: "top-left",
        autoClose: 1000,
      });
    }
  };
  return (
    <>
      {loading && <Loading></Loading>}
      {!loading && (
        <div className="bg_farm w-screen h-screen relative">
          <Link
            to="/farm"
            className="store shadow-xl absolute top-[5%] p-3 left-[15%] bg-slate-50 flex items-center justify-center rounded-full"
          >
            <img
              onClick={() => {
                localStorage.removeItem("cannon");
                localStorage.removeItem("mission_neighbor");
                localStorage.removeItem("friend_mission");
              }}
              className="w-[100px] cursor-pointer"
              src="../house.png"
              alt=""
            />
          </Link>
          <div className="absolute z-10 bottom-[50px] left-[50px]">
            <img
              ref={cannon}
              onClick={handleCannon}
              src="../cannon.png"
              className="w-1/2 cursor-pointer "
              alt=""
            />
          </div>
          <img
            src="../bomb.png"
            ref={bomb}
            className="w-[100px] invisible  fixed bottom-[200px] left-[250px]"
            alt=""
          />

          {seedUser && (
            <div className="flex flex-col fixed bottom-[50px] left-1/2 -translate-x-1/2">
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
                  Cây đã chín
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
                      <img src="../drop.png" className="w-[15px]" alt="" />
                    </span>
                    <span>Kết trái</span>
                  </div>
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default FriendFarm;
