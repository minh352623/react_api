import React from "react";

const Status = ({ status = 0 }) => {
  return (
    <div className="flex mt-3 gap-2 justify-center items-center">
      <div className="flex  items-center justify-center">
        {/* <span className="w-[200px] p-2"></span> */}
        <p className="flex-col items-center justify-center">
          <span className="">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-16 h-16 p-2 bg-green-500 rounded-full text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.875 14.25l1.214 1.942a2.25 2.25 0 001.908 1.058h2.006c.776 0 1.497-.4 1.908-1.058l1.214-1.942M2.41 9h4.636a2.25 2.25 0 011.872 1.002l.164.246a2.25 2.25 0 001.872 1.002h2.092a2.25 2.25 0 001.872-1.002l.164-.246A2.25 2.25 0 0116.954 9h4.636M2.41 9a2.25 2.25 0 00-.16.832V12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 12V9.832c0-.287-.055-.57-.16-.832M2.41 9a2.25 2.25 0 01.382-.632l3.285-3.832a2.25 2.25 0 011.708-.786h8.43c.657 0 1.281.287 1.709.786l3.284 3.832c.163.19.291.404.382.632M4.5 20.25h15A2.25 2.25 0 0021.75 18v-2.625c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125V18a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
          </span>
          <span className="font-semibold text-green-400">Processing</span>
        </p>
      </div>

      <div className="flex  items-center justify-center">
        <span
          className={`w-[200px] mb-[30px] mr-3 p-[2px] ${
            status >= 1 ? "bg-green-400" : "bg-gray-400"
          } rounded-3xl`}
        ></span>
        <p className=" flex-col items-center justify-center">
          <span className="">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className={`w-16 h-16 p-2  ${
                status >= 1 ? "bg-green-500" : "bg-gray-400"
              } rounded-3xl rounded-full text-white`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
              />
            </svg>
          </span>
          <span
            className={`font-semibold   ${
              status >= 1 ? "text-green-400" : "text-gray-400"
            } rounded-3xl`}
          >
            In Transit
          </span>
        </p>
      </div>
      <div className="flex  items-center justify-center">
        <span
          className={`w-[200px] mb-[30px] mr-3 p-[2px] ${
            status >= 2 ? "bg-green-400" : "bg-gray-400"
          } rounded-3xl`}
        ></span>
        <p className="flex-col items-center justify-center">
          <span className="">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className={`w-16 h-16 p-2  ${
                status >= 2 ? "bg-green-500" : "bg-gray-400"
              } rounded-3xl rounded-full text-white`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
          </span>
          <span
            className={`font-semibold   ${
              status >= 2 ? "text-green-400" : "text-gray-400"
            } rounded-3xl`}
          >
            Delivered
          </span>
        </p>
      </div>
    </div>
  );
};

export default Status;
