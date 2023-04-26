import {
  collection,
  getDocs,
  onSnapshot,
  where,
  query,
  orderBy,
} from "firebase/firestore";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { db } from "../firebase/firebase-config";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setNotifycations } from "../redux-thunk/userSlice";

const Notify = () => {
  const { user, notifycations } = useSelector((state) => state.user);

  const [show, setShow] = useState(false);
  const colRef = collection(db, "notifycations");
  let q = query(
    colRef,
    where("user_id", "==", user?.id)
    // orderBy("date", "desc")
  );
  const [number, setNumber] = useState(0);
  const dispatch = useDispatch();
  // const [notifycations, setnotifycations] = useState([]);
  useEffect(() => {
    //lấy thông báo
    // getDocs(colRef)
    //   .then((snapshot) => {
    //     let notys = [];

    //     snapshot.docs.forEach((doc) => {
    //       notys.push({
    //         id: doc.id,
    //         ...doc.data(),
    //       });
    //     });
    //     console.log(notys);
    //     setnotifycations(notys);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    onSnapshot(q, (snapshot) => {
      let notys = [];
      let number2 = 0;
      console.log("vao day r");
      snapshot.docs.forEach((doc) => {
        if (doc.data().read == 0) {
          number2++;
        }
        notys.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      console.log(notys.length);
      console.log(notifycations.length);

      if (notifycations.length > 0 && notys.length > notifycations.length) {
        Swal.fire({
          position: "top-right",
          icon: "info",
          title: "Bạn có thông báo mới về đơn hàng kìa!",
          showConfirmButton: false,
          timer: 2000,
        });
      }

      console.log(notys);
      notys = notys.sort(function (a, b) {
        return -(a.date.seconds - b.date.seconds);
      });
      dispatch(setNotifycations(notys));
      setNumber(number2);
    });
  }, []);
  return (
    <div>
      <div className="relative">
        <span className="absolute top-[-8px] right-0 bg-red-500 p-2 w-[20px] h-[20px] rounded-full flex justify-center items-center">
          {number}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-8 h-8 cursor-pointer"
          onClick={() => setShow((show) => !show)}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
          />
        </svg>
        {show && (
          <ul className="absolute z-10 top-full rounded h-[500px] overflow-y-scroll right-0 w-[500px] p-3 bg-slate-50 shadow-lg">
            {notifycations?.length > 0 &&
              notifycations.map((item) => {
                return (
                  <li key={item.date} className="my-2  w-full">
                    <Link
                      className="px-2 block text-slate-900 bg-gray-300 py-3 rounded-lg"
                      to="/mybill"
                    >
                      <span>{item.content}</span>
                      <p className="m-0">
                        {new Date(item.date.seconds * 1000).toLocaleString()}
                      </p>
                    </Link>
                  </li>
                );
              })}
            {(!notifycations || notifycations.length <= 0) && (
              <li className="text-slate-900 text-xl">Không có thông báo mới</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Notify;
