import axios from "axios";
import React, { useEffect } from "react";
import { useRef } from "react";
import "../countdown.css";
import Swal from "sweetalert2";
import { useState } from "react";
import { useSelector } from "react-redux";

const CountDown = ({ FetchWaterUser }) => {
  const { user } = useSelector((state) => state.user);
  const [loop, setLoop] = useState();
  const countDown = useRef();
  const receive = useRef();
  useEffect(() => {
    if (!localStorage.getItem("date")) {
      localStorage.setItem(
        "date",
        new Date(Date.now() + 1 * 1 * 5 * 60 * 1000)
      );
    }
    function getTimeRemaining(endtime) {
      var t = Date.parse(endtime) - Date.now();
      var seconds = Math.floor((t / 1000) % 60);
      var minutes = Math.floor((t / 1000 / 60) % 60);
      var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
      //   var days = Math.floor(t / (1000 * 60 * 60 * 24));
      return {
        total: t,
        // days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds,
      };
    }

    function initializeClock(id, endtime) {
      var clock = document.getElementById(id);
      //   var daysSpan = clock.querySelector(".days");
      var hoursSpan = clock.querySelector(".hours");
      var minutesSpan = clock.querySelector(".minutes");
      var secondsSpan = clock.querySelector(".seconds");

      function updateClock() {
        var t = getTimeRemaining(endtime);

        // daysSpan.innerHTML = t.days;
        hoursSpan.innerHTML = ("0" + t.hours).slice(-2);
        minutesSpan.innerHTML = ("0" + t.minutes).slice(-2);
        secondsSpan.innerHTML = ("0" + t.seconds).slice(-2);

        if (t.total <= 0) {
          clearInterval(timeinterval);
          countDown.current?.classList.add("invisible");

          receive.current?.classList.remove("hidden");
        } else {
          receive.current?.classList.add("hidden");

          countDown.current?.classList.remove("invisible");
        }
      }

      updateClock();
      var timeinterval = setInterval(updateClock, 1000);
    }
    // count down timer:
    var deadline = new Date(localStorage.getItem("date"));
    initializeClock("clockdiv", deadline);
  }, [loop]);
  const handleWater = async () => {
    console.log("ádasd");
    const formData = new FormData();
    formData.append("user_id", user?.id);

    try {
      const response = await axios({
        method: "post",
        url: "https://shoppet.fun/api/seed/handleIncrementWater",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user?.token,
        },
        data: formData,
      });
      if (response) {
        setLoop(localStorage.getItem("date"));

        FetchWaterUser();
        Swal.fire({
          position: "center-center",
          icon: "success",
          title: "Bạn đã nhận được 50 nước!",
          showConfirmButton: false,
          timer: 1000,
        });
        localStorage.setItem(
          "date",
          new Date(Date.now() + 1 * 1 * 5 * 60 * 1000)
        );
        setLoop(localStorage.getItem("date"));
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div>
      <div
        ref={receive}
        onClick={handleWater}
        className="hidden px-4  text-center py-2 rounded-xl bg-orange-500 font-bold text-slate-50 w-[200px] "
      >
        Nhận nước ngay
      </div>
      <div ref={countDown} id="clockdiv">
        <div>
          <span class="hours"></span>
        </div>
        <div>
          <span class="minutes"></span>
        </div>
        <div>
          <span class="seconds"></span>
        </div>
        <br />
      </div>
    </div>
  );
};

export default CountDown;
