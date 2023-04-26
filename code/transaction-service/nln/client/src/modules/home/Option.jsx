import React from "react";
import ButtonHome from "../../components/ButtonHome";

const Option = () => {
  return (
    <div className="my-3">
      <div className="relative">
        <img
          className="rounded-2xl  h-full h-[350px] w-full object-cover"
          src="./noooo.jpg"
          alt=""
        />
        <div className="absolute top-1/2 left-1/2 text-center text-white -translate-x-1/2 -translate-y-1/2">
          <h2 className="text-[50px] font-serif">New Puppy or Kitten?</h2>
          <h3>Discover everything you need to make them feel at home</h3>
          <div className="flex gap-5 justify-center mt-5">
            <ButtonHome className="bg-slate-50 hover:text-white shadow-lg text-slate-900 font-bold hover:bg-orange-500">
              Shop Kitten
            </ButtonHome>
            <ButtonHome className="bg-slate-50 hover:text-white shadow-lg text-slate-900 font-bold hover:bg-orange-500">
              Shop Puppy
            </ButtonHome>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Option;
