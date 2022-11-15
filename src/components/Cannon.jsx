import React from "react";
import { useEffect } from "react";
import "../cannon.css";
const Cannon = () => {
  useEffect(() => {
    const cannonBtn = document.querySelector(".js-cannon");
    const cannonSvg = document.querySelector(".c-cannon__svg");
    const cannonWheel = document.querySelector(".c-cannon__wheel");

    const burstCircle = new mojs.Burst({
      angle: 52,
      count: 4,
      degree: 20,
      left: "65%",
      radius: { 20: 50 },
      parent: cannonBtn,
      top: "5%",
      children: {
        delay: [0, 350, 200, 150],
        duration: 1600,
        easing: mojs.easing.bezier(0.1, 1, 0.3, 1),
        fill: [
          "hsla(295, 51%, 50%, 1.00)",
          "hsla(38, 85%, 53%, 1.00)",
          "hsla(109, 39%, 53%, 1.00)",
          "hsla(216, 64%, 64%, 1.00)",
        ],
        opacity: 0.6,
        radius: { "rand(5, 20)": 0 },
        scale: 1,
      },
    });

    const burstLine = new mojs.Burst({
      angle: 42,
      count: 6,
      degree: 17,
      left: "35%",
      radius: { 40: 120 },
      parent: cannonBtn,
      top: "40%",
      children: {
        duration: 600,
        easing: mojs.easing.bezier(0.1, 1, 0.3, 1),
        radius: { 20: 0 },
        scale: 1,
        shape: "line",
        stroke: [
          "hsla(295, 51%, 50%, 1.00)",
          "hsla(38, 85%, 53%, 1.00)",
          "hsla(109, 39%, 53%, 1.00)",
          "hsla(216, 64%, 64%, 1.00)",
          "hsla(0, 0%, 92%, 1.00)",
          "hsla(219, 13%, 62%, 1.00)",
        ],
      },
    });

    const translateEasing = mojs.easing.path(
      "M0,100 C0,72 10,-0.1 50,0 C89.6,0.1 100,72 100,100"
    );

    const burstIcon = new mojs.Tween({
      duration: 1000,
      easing: mojs.easing.bezier(0.1, 1, 0.3, 1),
      onUpdate: (progress) => {
        // onsole.log(translateEasing(progress));
        const cannonMove = translateEasing(progress);

        cannonSvg.style.transform = `translate3d(${-20 * cannonMove}%, 0, 0)`;
        cannonBtn.style.fill = "hsla(295, 51%, 50%, 1.00)";
      },
      onComplete: () => {
        cannonBtn.style.fill = "hsla(0, 0%, 100%, 1.00)";
      },
    });

    const activeWheel = () => {
      cannonWheel.classList.add("is-active");
    };

    const deactiveWheel = () => {
      cannonWheel.classList.remove("is-active");
    };

    const triggerCannon = () => {
      burstCircle.replay();
      burstLine.replay();
      burstIcon.replay();
      activeWheel();
    };

    // Event binding
    cannonBtn.addEventListener("click", triggerCannon);
    cannonWheel.addEventListener("animationend", deactiveWheel);

    //const mojsPlayer = new MojsPlayer({ add: burstLine });
  }, []);
  return (
    <main>
      <div class="p-page">
        <button class="c-cannon js-cannon">
          <svg
            class="c-cannon__svg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 511.999 511.999"
            width="200"
          >
            <path d="M480.047 140.324L346.303 6.581A22.319 22.319 0 0 0 330.416 0a22.32 22.32 0 0 0-15.888 6.581l-21.584 21.582c-8.76 8.761-8.76 23.016 0 31.775l4.771 4.771L71.342 260.744a109.531 109.531 0 0 0-37.823 82.835c0 26.233 9.188 51.043 25.999 70.81L28.016 445.89a8.994 8.994 0 0 0 0 12.72c1.756 1.757 4.058 2.635 6.36 2.635s4.604-.878 6.36-2.635l31.507-31.507c19.881 16.868 44.958 26.013 70.779 26.011 4.906 0 9.841-.35 14.77-1.018 22.537 35.946 62.508 59.902 107.976 59.902 70.223 0 127.354-57.131 127.354-127.354 0-42.008-20.448-79.323-51.909-102.535l80.705-93.202 4.772 4.772c4.244 4.244 9.886 6.582 15.888 6.582s11.644-2.337 15.888-6.582l21.582-21.582c8.759-8.757 8.759-23.012-.001-31.773zM375.133 384.647c0 60.304-49.061 109.365-109.365 109.365s-109.364-49.061-109.364-109.365 49.061-109.365 109.364-109.365 109.365 49.061 109.365 109.365zm-49.29-112.267c-17.907-9.621-38.364-15.087-60.075-15.087-70.223 0-127.354 57.131-127.354 127.354 0 17.853 3.699 34.855 10.361 50.292a91.444 91.444 0 0 1-70.451-26.63c-17.293-17.293-26.815-40.281-26.815-64.731a91.547 91.547 0 0 1 31.611-69.237L310.467 77.465l32.9 32.897 65.797 65.797-83.321 96.221zm141.484-113l-21.584 21.582a4.458 4.458 0 0 1-3.167 1.312 4.465 4.465 0 0 1-3.167-1.312L305.665 47.219a4.486 4.486 0 0 1 0-6.335l21.584-21.582c1.142-1.142 2.474-1.312 3.167-1.312s2.026.17 3.167 1.312l133.744 133.742a4.487 4.487 0 0 1 0 6.336z" />
            <path
              class="c-cannon__wheel"
              d="M265.768 311.462c-40.355 0-73.185 32.831-73.185 73.185 0 40.355 32.831 73.185 73.185 73.185 40.355 0 73.186-32.831 73.186-73.185s-32.831-73.185-73.186-73.185zm8.994 18.733c23.241 3.826 41.63 22.214 45.458 45.454h-17.042c-3.369-14.004-14.411-25.046-28.416-28.412v-17.042zm-17.99 0v17.041c-14.004 3.368-25.046 14.408-28.415 28.412h-17.041c3.829-23.239 22.216-41.626 45.456-45.453zm0 108.902c-23.242-3.827-41.631-22.217-45.457-45.459h17.041c3.366 14.006 14.409 25.051 28.416 28.418v17.041zm-11.497-54.451c0-11.3 9.194-20.493 20.493-20.493 11.3 0 20.494 9.194 20.494 20.493s-9.194 20.493-20.494 20.493c-11.3.001-20.493-9.193-20.493-20.493zm29.487 54.453v-17.041c14.007-3.368 25.05-14.412 28.417-28.418h17.042c-3.826 23.242-22.216 41.632-45.459 45.459z"
            />
          </svg>
        </button>
      </div>
    </main>
  );
};

export default Cannon;
