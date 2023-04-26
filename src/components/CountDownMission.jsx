import { random } from "lodash";
import React, { useEffect } from "react";
import { useRef } from "react";
import "../countdown.css";
const CountDownMission = ({ loop, setLoad }) => {
  const countDown = useRef();
  useEffect(() => {
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
          countDown.current?.classList.add("none");
          localStorage.setItem("sh_dm", 1);
          setLoad(Math.random());
          //   receive.current?.classList.remove("invisible");
        } else {
          //   receive.current?.classList.add("invisible");
          countDown.current?.classList.remove("none");
          localStorage.setItem("sh_dm", 0);
        }
      }

      updateClock();
      var timeinterval = setInterval(updateClock, 1000);
    }
    // count down timer:
    var deadline = new Date(localStorage.getItem("date_mission"));
    initializeClock("clockdiv", deadline);
  }, [loop]);

  return (
    <div>
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

export default CountDownMission;
