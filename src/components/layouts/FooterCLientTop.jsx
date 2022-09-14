import React from "react";

const FooterCLientTop = () => {
  return (
    <div className="footer-top py-4 ">
      <div className="grid grid-cols-3 gap-5">
        <div className="mail">
          <div className="icon-mail flex items-center gap-3">
            <span className="border-2  leading-none border-orange-500 rounded-full  p-3 flex justify-center items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#ea580c"
                viewBox="0 0 24 24"
                strokeWidth="1"
                stroke="currentColor"
                className="w-20 leading-none max-h-fit "
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.98l7.5-4.04a2.25 2.25 0 012.134 0l7.5 4.04a2.25 2.25 0 011.183 1.98V19.5z"
                />
              </svg>
            </span>
            <h4 className="font-bold">
              Join now and get 10% off your next purchase!
            </h4>
          </div>
        </div>
        <div className="content px-5 flex items-center justify-center border-l-2">
          <h6 className="text-gray-500 leading-7 font-bold">
            Subscribe to the weekly newsletter for all the latest updates
          </h6>
        </div>
        <div className="flex items-center justify-center">
          <form className="w-full">
            <div className="relative">
              <input
                type="text"
                placeholder="Enter your email..."
                className="w-full flex-1 rounded-3xl pl-5 py-3 border-2 border-gray-400"
              />
              <div className="absolute top-1/2 right-[12px]">
                <button
                  type="submit"
                  className="uppercase hover:bg-orange-500 transition-all text-white py-2 px-3 rounded-3xl -translate-y-1/2 bg-slate-900"
                >
                  subscribe
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FooterCLientTop;
