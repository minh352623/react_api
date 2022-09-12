import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Layout from "../../components/layouts/Layout";

const InfoUser = () => {
  const { user } = useSelector((state) => state.user);

  return (
    <Layout>
      {user && (
        <div className="px-5 my-5 container">
          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-3">
              <div className="info-left py-5 rounded-lg flex items-center  flex-col w-full bg-cyan-700">
                <div className="relative image rounded-full bg-slate-50 p-2 w-[120px] h-[120px]">
                  <img
                    src={`http://127.0.0.1:8000${user.image}`}
                    className="w-full h-full object-cover rounded-full"
                    alt=""
                  />
                  <Link
                    className="absolute p-2  bg-slate-900 text-white rounded-full hover:bg-slate-600  right-0 bottom-[4px]"
                    to="/editInfo"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      class="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                      />
                    </svg>
                  </Link>
                </div>
                <div className="text-center">
                  <p className="m-0 mt-3  text-white text-2xl">{user.name}</p>
                  <p className="m-0 text-white text-sm">{user.email}</p>
                </div>
              </div>
            </div>
            <div className="col-span-9">
              <div className="right">
                <div className="description bg-cyan-700 rounded-t-lg p-3 py-4">
                  <p className="text-white text-center text-xl italic">
                    {user.description}
                  </p>
                </div>
                <div className="bio px-3 bg-white shadow-lg py-[32px] rounded-b-lg">
                  <span className="text-2xl text-gray-500">Bio Graph</span>
                  <div className="grid grid-cols-12 mt-3">
                    <div className="col-span-6">
                      <p className="flex gap-5 text-gray-400">
                        <span>Name:</span>
                        <span>{user.name}</span>
                      </p>
                      <p className="flex gap-5 text-gray-400">
                        <span>Email:</span>
                        <span>{user.email}</span>
                      </p>
                    </div>
                    <div className="col-span-6">
                      <p className="flex gap-5 text-gray-400">
                        <span>Phone:</span>
                        <span>{user.phone || "NO DATA"}</span>
                      </p>
                      <p className="flex gap-5 text-gray-400">
                        <span>Address:</span>
                        <span>{user.address || "NO DATA"}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default InfoUser;
