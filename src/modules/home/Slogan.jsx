import React from "react";

const Slogan = () => {
  return (
    <div className="slogan mt-3 rounded-2xl">
      <div className="slogan-content rounded-2xl relative">
        <div className="img rounded-2xl">
          <img className="w-full rounded-2xl" src="./bg-6.jpg" alt="" />
        </div>
        <div className="grid grid-cols-12 w-full h-full absolute top-1/2 -translate-y-1/2">
          <div className="col-span-8 text-white text-center my-auto">
            <h3 className="text-4xl">Take your pick of the litter</h3>
            <p className="font-bold">
              An odor-free home starts with Arm & Hammer.
            </p>
            <p>
              <a
                href=""
                className="py-2 px-8 hover:bg-orange-500 transition-all bg-amber-800 rounded-3xl font-bold text-white"
              >
                Shop now
              </a>
            </p>
          </div>
          <div className="col-span-4"></div>
        </div>
      </div>
    </div>
  );
};

export default Slogan;
