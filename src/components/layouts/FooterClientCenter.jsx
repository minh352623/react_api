import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const FooterClientCenter = ({ settings }) => {
  console.log(settings);

  return (
    <div className="grid grid-cols-4 gap-5 items-center py-5 border-t  border-t-gray-300">
      <div className="footer_logo">
        <div className="image">
          <img src="../logoFotter.png" alt="" />
        </div>
        <p className="my-3 w-11/12">
          If you have any question, please contact us at{" "}
          <span className="text-orange-500">
            {settings && settings[4].config_value}
          </span>
        </p>
        <p className="flex items-center gap-3">
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.25 9.75v-4.5m0 4.5h4.5m-4.5 0l6-6m-3 18c-8.284 0-15-6.716-15-15V4.5A2.25 2.25 0 014.5 2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44-.054.902-.417 1.173l-1.293.97a1.062 1.062 0 00-.38 1.21 12.035 12.035 0 007.143 7.143c.441.162.928-.004 1.21-.38l.97-1.293a1.125 1.125 0 011.173-.417l4.423 1.106c.5.125.852.575.852 1.091V19.5a2.25 2.25 0 01-2.25 2.25h-2.25z"
              />
            </svg>
          </span>
          <span className="font-bold">
            {settings && settings[3].config_value}
          </span>
        </p>
        <p className="flex items-center gap-3">
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
              />
            </svg>
          </span>
          <span className="font-bold">
            {settings && settings[5].config_value}
          </span>
        </p>
        <div className="socials flex items-center gap-2">
          <Link
            className="text-gray-400"
            to={settings && settings[0].config_value}
          >
            <span className="text-white hover:bg-orange-500 transition-all leading-none h-full w-full block flex items-center justify-center max-h-[32px]  max-w-[32px] rounded-full p-[20px] bg-slate-800">
              <i className="fa-brands fa-facebook-f leading-none"></i>
            </span>
          </Link>
          <Link
            className="text-gray-400"
            to={settings && settings[0].config_value}
          >
            <span className="text-white hover:bg-orange-500 transition-all leading-none h-full w-full block flex items-center justify-center max-h-[32px]  max-w-[32px] rounded-full p-[20px] bg-slate-800">
              <i className="fa-brands fa-twitter"></i>
            </span>
          </Link>
          <Link
            className="text-gray-400"
            to={settings && settings[2].config_value}
          >
            <span className="text-white hover:bg-orange-500 transition-all leading-none h-full w-full block flex items-center justify-center max-h-[32px]  max-w-[32px] rounded-full p-[20px] bg-slate-800">
              <i className="fa-brands fa-linkedin-in"></i>
            </span>
          </Link>
          <Link
            className="text-gray-400"
            to={settings && settings[1].config_value}
          >
            <span className="text-white hover:bg-orange-500 transition-all leading-none h-full w-full block flex items-center justify-center max-h-[32px]  max-w-[32px] rounded-full p-[20px] bg-slate-800">
              <i className="fa-brands fa-instagram"></i>
            </span>
          </Link>
        </div>
      </div>
      <div className="corporate">
        <p className="font-semibold text-xl">Corporate</p>
        <ul className="p-0 flex flex-col gap-1 ">
          <li>
            <Link className="text-gray-400" to="#">
              Careers
            </Link>
          </li>
          <li>
            <Link className="text-gray-400" to="#">
              About Us
            </Link>
          </li>
          <li>
            <Link className="text-gray-400" to="#">
              Contact Us
            </Link>
          </li>
          <li>
            <Link className="text-gray-400" to="#">
              FAQs
            </Link>
          </li>
          <li>
            <Link className="text-gray-400" to="#">
              Vendors
            </Link>
          </li>
          <li>
            <Link className="text-gray-400" to="#">
              Affiliate Program
            </Link>
          </li>
        </ul>
      </div>
      <div className="corporate">
        <p className="font-semibold text-xl">Information</p>
        <ul className="p-0 flex flex-col gap-1 ">
          <li>
            <Link className="text-gray-400" to="#">
              Online Store
            </Link>
          </li>
          <li>
            <Link className="text-gray-400" to="#">
              Privacy Policy
            </Link>
          </li>
          <li>
            <Link className="text-gray-400" to="#">
              Refund Policy
            </Link>
          </li>
          <li>
            <Link className="text-gray-400" to="#">
              Shipping Policy
            </Link>
          </li>
          <li>
            <Link className="text-gray-400" to="#">
              Terms of Service
            </Link>
          </li>
          <li>
            <Link className="text-gray-400" to="#">
              Track Order
            </Link>
          </li>
        </ul>
      </div>
      <div className="corporate">
        <p className="font-semibold text-xl">Services</p>
        <ul className="p-0 flex flex-col gap-1 ">
          <li>
            <Link className="text-gray-400" to="#">
              Grooming
            </Link>
          </li>
          <li>
            <Link className="text-gray-400" to="#">
              Positive Dog Training
            </Link>
          </li>
          <li>
            <Link className="text-gray-400" to="#">
              Veterinary Services
            </Link>
          </li>
          <li>
            <Link className="text-gray-400" to="#">
              Petco Insurance
            </Link>
          </li>
          <li>
            <Link className="text-gray-400" to="#">
              Pet Adoption
            </Link>
          </li>
          <li>
            <Link className="text-gray-400" to="#">
              Resource Center
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FooterClientCenter;
