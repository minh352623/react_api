import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useSelector } from "react-redux";
import CountDownMission from "./CountDownMission";
import { useNavigate } from "react-router-dom";
import {
  EmailShareButton,
  FacebookShareButton,
  HatenaShareButton,
  InstapaperShareButton,
  LineShareButton,
  LinkedinShareButton,
  LivejournalShareButton,
  MailruShareButton,
  OKShareButton,
  PinterestShareButton,
  PocketShareButton,
  RedditShareButton,
  TelegramShareButton,
  TumblrShareButton,
  TwitterShareButton,
  ViberShareButton,
  VKShareButton,
  WhatsappShareButton,
  WorkplaceShareButton
} from "react-share";


import {
  EmailIcon,
  FacebookIcon,
  FacebookMessengerIcon,
  HatenaIcon,
  InstapaperIcon,
  LineIcon,
  LinkedinIcon,
  LivejournalIcon,
  MailruIcon,
  OKIcon,
  PinterestIcon,
  PocketIcon,
  RedditIcon,
  TelegramIcon,
  TumblrIcon,
  TwitterIcon,
  ViberIcon,
  VKIcon,
  WeiboIcon,
  WhatsappIcon,
  WorkplaceIcon
} from "react-share";

import {
  FacebookShareCount,
  HatenaShareCount,
  OKShareCount,
  PinterestShareCount,
  RedditShareCount,
  TumblrShareCount,
  VKShareCount
} from "react-share";
const ItemMission = ({
  item,
  missuser,
  FetchMissUser,
  FetchWaterUser,
  setShowFriend,
  FetchFriend,
}) => {
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [loop, setLoop] = useState();
  const diemdanh = useRef();
  const [load, setLoad] = useState();
  const navigate = useNavigate();
  const [show, setShow] = React.useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleMission = async (item) => {
    let formData = new FormData();
    formData.append("user_id", user?.id);
    formData.append("mission_id", item.id);
    formData.append("energy_miss", item.energy);
    localStorage.setItem("sh_dm", 0);
    try {
      setLoading(true);
      const response = await axios({
        method: "post",
        url: "https://shoppet.site/api/mission/add_user",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user?.token,
        },
        data: formData,
      });
      if (response.status) {
        FetchMissUser();
        setLoading(false);

        Swal.fire({
          position: "center-center",
          icon: "success",
          title: "Điểm danh thành công!",
          showConfirmButton: false,
          timer: 1000,
        });
        localStorage.setItem(
          "date_mission",
          new Date(Date.now() + 1 * 1 * 1 * 15 * 1000)
        );
        setLoop(localStorage.getItem("date"));
      }
    } catch (e) {
      console.log(e);
    }
  };

  const [width, setWidth] = useState();
  const widthPer = useRef();
  useEffect(() => {
    if (missuser) {
      widthPer.current
        ? (widthPer.current.style.width =
            (missuser.energy_user * 100) / item.energy + "%")
        : "";
      setWidth((missuser.energy_user * 100) / item.energy);
    }
  }, [width]);

  const rewarded = async (item, e) => {
    let formData = new FormData();
    formData.append("user_id", user?.id);
    formData.append("water", +item.water_take);
    formData.append("dm_water", 1);
    formData.append("mission_id", item.id);
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
        setLoading(false);
        Swal.fire({
          position: "center-center",
          icon: "success",
          title: "Nhiệm vụ hoàn thành!",
          showConfirmButton: false,
          timer: 1000,
        });
        e.target.parentElement.parentElement.parentElement.parentElement.remove();
        FetchMissUser();
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
  };
  const [itemShare, setItemShare] = React.useState();

  const handleMissionRedirect = async (item) => {
    if (item?.value_type == "/home") {
      console.log("home");
      localStorage.setItem("nv_luot", JSON.stringify(item));
      navigate("/home");
    }

    if (item?.value_type == "/neighbor") {
      console.log("true");
      localStorage.setItem("mission_neighbor", JSON.stringify(item));
      setShowFriend(true);
      FetchFriend();
    }

    if (item?.value_type == "/share") {
      console.log('share');
      setItemShare(item)
      handleShow()
    }
  };
  if (missuser) {
    return (
      <div className="col-span-6 bg-white">
        <div className="p-3">
          <div className="flex gap-3 justify-between items-center">
            <span className="w-[100px] p-2 bg-slate-200 rounded-full shadow-2xl">
              <img src={item.image} className="" alt="" />
            </span>
            <div className="flex py-2 flex-col gap-1 flex-1">
              <span className="font-bold text-orange-700 text-start">
                {item.name}
              </span>
              <span className="w-full py-3 bg-slate-200 rounded-full relative">
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  font-bold z-10 ">
                  {missuser.energy_user}/{item.energy}
                </span>
                <span
                  ref={widthPer}
                  className={`absolute top-0  left-0 h-full rounded-full w-[${width}%] bg-blue-400`}
                ></span>
              </span>
              <p className=" gap-2 flex text-orange-500">
                <span>Nhận nước</span>
                <img src="./drop.png" className="w-[20px]" alt="" />
                <span> x{item.water_take}</span>
              </p>
            </div>
            <div className="ml-5">
              {missuser.energy_user == item.energy ? (
                <p
                  onClick={(e) => rewarded(item, e)}
                  className="py-2 px-4 cursor-pointer hover:bg-orange-700 transition-all bg-orange-500 text-slate-50 font-bold rounded-full"
                >
                  Nhận thưởng
                </p>
              ) : (
                <>
                  {item.type_mission == 1 && (
                    <div>
                      {localStorage.getItem("sh_dm") != 0 && (
                        <p
                          ref={diemdanh}
                          onClick={() => handleMission(item)}
                          className="py-2  diemdanh_miss px-4 cursor-pointer hover:bg-green-700 bg-green-600 text-slate-50 font-bold rounded-full"
                        >
                          {loading ? "Đang xử lý" : "Điểm danh"}
                        </p>
                      )}
                      <div>
                        <CountDownMission
                          loop={loop}
                          setLoad={setLoad}
                        ></CountDownMission>
                      </div>
                    </div>
                  )}
                  {item.type_mission != 1 && (
                    <p
                      onClick={() => handleMissionRedirect(item)}
                      className="py-2 px-4 cursor-pointer hover:bg-green-700 bg-green-600 text-slate-50 font-bold rounded-full"
                    >
                      Thực hiện
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Chia sẻ mạng xã hội</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="flex gap-3">
            <FacebookShareButton
              url="https://main--leafy-trifle-205341.netlify.app/seo/home-page"
              quote="Shoppet Nông trại vui vẻ"
              hashtag="#ShoppetNongtraivuive" 
           >
              <FacebookIcon onClick={()=>handleMission(itemShare)} iconFillColor="white" round="true"></FacebookIcon>
              <FacebookShareCount url="https://main--leafy-trifle-205341.netlify.app/seo/home-page" >
              {count => <span className="text-black w-[12px]">{count}</span> }
            </FacebookShareCount>
            </FacebookShareButton>
          
            <TelegramShareButton title="Shoppet nông trại vui vẻ"
              url="https://main--leafy-trifle-205341.netlify.app/seo/home-page"
            
            >
                <TelegramIcon
                onClick={()=>handleMission(itemShare)}
                iconFillColor="white" round="true"
                ></TelegramIcon>
            </TelegramShareButton>
            <LinkedinShareButton
              url="https://main--leafy-trifle-205341.netlify.app/seo/home-page"
              title="Shoppet nông trại vui vẻ"
              summary="Chơi game nhận thưởng"
            >

              <LinkedinIcon
              onClick={()=>handleMission(itemShare)}
              iconFillColor="white" round="true"
              ></LinkedinIcon>
            </LinkedinShareButton>
            </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        
        </Modal.Footer>
      </Modal>
    <div className="col-span-6 bg-white">
      <div className="p-3">
        <div className="flex gap-3 justify-between items-center">
          <span className="w-[100px] p-2 bg-slate-200 rounded-full shadow-2xl">
            <img src={item.image} className="" alt="" />
          </span>
          <div className="flex py-2 flex-col gap-1 flex-1">
            <span className="font-bold text-orange-700 text-start">
              {item.name}
            </span>
            <span className="w-full block text-center py-1 bg-slate-200 rounded-full font-bold">
              0/{item.energy}
            </span>
            <p className=" gap-2 flex text-orange-500">
              <span>Nhận nước</span>
              <img src="./drop.png" className="w-[20px]" alt="" />
              <span> x{item.water_take}</span>
            </p>
          </div>
          <div className="ml-5">
            {item.type_mission == 1 ? (
              <p
                onClick={() => handleMission(item)}
                className="py-2 px-4 cursor-pointer hover:bg-green-700 bg-green-600 text-slate-50 font-bold rounded-full"
              >
                {loading ? "Đang xử lý" : "Điểm danh"}
              </p>
            ) : (
              <p
                onClick={() => handleMissionRedirect(item)}
                className="py-2 px-4 cursor-pointer hover:bg-green-700 bg-green-600 text-slate-50 font-bold rounded-full"
              >
                Thực hiện
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default ItemMission;
